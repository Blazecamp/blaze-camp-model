"""Build synthesis/10_equipment_model.json (+ generated tables for the .md).

Inputs (read-only):
  analysis/equipment/lib_resistance.json      (MASTER EXERCISE LIBRARY S..BE, per-exercise implement/constraint tags)
  analysis/equipment/lib_athletic_core.json   (MASTER EXERCISE LIBRARY B..T)
  analysis/equipment/prog_mm_equipment.json   (MASTER MODEL program items; alternates)
Everything hand-authored below cites its source (OBSERVED tab!cell, COACH-CHAT, SCIENCE [S#] from
synthesis/10b_equipment_variables_science.md, or INFERRED).
Run:  .venv/bin/python synthesis/_build_10/build_10_equipment_model.py
"""
import json, re, collections, statistics, os, sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
from zones import load_zone, coach_level_estimate, guidance  # noqa: E402

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), '..', '..'))
P = lambda *a: os.path.join(ROOT, *a)
RES = json.load(open(P('analysis/equipment/lib_resistance.json')))
ATH = json.load(open(P('analysis/equipment/lib_athletic_core.json')))
MM = json.load(open(P('analysis/equipment/prog_mm_equipment.json')))

# ---------------------------------------------------------------------------------------------
# 1. Canonical kit tokens (what the intake form asks).  Library tokens are mapped onto these.
# ---------------------------------------------------------------------------------------------
KIT_TOKENS = {
    # household / space (assumed for everyone unless stated)
    'floor': 'floor space for lying/standing work', 'wall': 'solid wall', 'partner_or_wall': 'a wall to throw against or a partner',
    'household': 'table, chair, towel, backpack, door frame', 'slider': 'towel or glider on a smooth floor',
    'step_low': 'stair, curb or low step up to knee height', 'bench': 'sturdy bench or chair at knee height',
    'box': 'stable box/chair/bench at knee height (box squats, step-ups)', 'anchor_point': 'couch, door or partner to hold the feet',
    'cones': 'cones or markers (shoes/bottles work)', 'open_space_short': '10-20 m of clear space',
    'open_space_long': '40-60 m+ runway, track, field or a safe road for running', 'jump_rope': 'jump rope',
    # athletic props
    'hurdles': 'mini/adjustable hurdles', 'plate_low_target': 'weight plate laid flat or any low stable target',
    'plyo_box_high': 'plyo box at or above hip height', 'two_boxes': 'two boxes (drop box + jump box)',
    'medball': 'medicine ball (coach: light, 8-10 lb) + wall/partner', 'slam_ball': 'non-bounce slam ball',
    # free weights
    'dumbbell': 'dumbbells', 'kettlebell': 'kettlebell(s)', 'barbell': 'straight barbell', 'rack': 'squat rack / stands',
    'weight_plate': 'weight plates', 'weight_bench': 'flat/adjustable weight bench', 'decline_bench': 'decline bench',
    'seal_bench': 'seal row bench (or bench on boxes)', 'ez_bar': 'EZ curl bar', 'hex_bar': 'hex/trap bar', 'ssb': 'safety squat bar',
    'landmine': 'landmine attachment', 'barbell_bumpers_platform': 'bumper plates + a place where the bar may be dropped',
    'sandbag': 'sandbag', 'sled': 'push/pull sled + turf', 'farmer_handles': 'farmer-carry handles (LIB-19 carries)',
    # bodyweight apparatus (v1: no elastic tokens - COACH-ANSWER EQ-01/EQ-12, see EXCLUDED_TOKENS)
    'pullup_bar': 'pull-up bar (doorway, rack or park)', 'dip_bars': 'dip bars / station', 'dip_belt': 'dip/weight belt',
    'trx': 'TRX / suspension trainer', 'rings': 'gymnastic rings', 'stability_ball': 'swiss/stability ball', 'foam_roller': 'foam roller',
    # gym stations
    'cable': 'cable column / functional trainer', 'cable_attachments': 'cable handles, ropes, mag grips',
    'machine_selectorized': 'pin-loaded machines (leg ext/curl, pulldown, row, chest press, shoulder press, calf)',
    'machine_plate_loaded': 'plate-loaded machines (leg press, hack squat)',
    'machine_specialty': 'specialty machines (pendulum squat, hip-thrust machine, good-morning machine)',
    'belt_squat': 'belt squat machine (load hangs from a hip belt: no axial spinal load, COACH-ANSWER EQ-11)',
    'smith': 'Smith machine', 'ghd': 'glute-ham developer', 'hyper_bench': '45-degree hyperextension bench', 'reverse_hyper': 'reverse hyper',
    # cardio
    'treadmill': 'treadmill', 'cardio_machine_cal': 'bike / rower / ski erg with calorie readout',
}
# v1 (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12): "I don't do bands. I don't program anything with bands." / "No variable
# resistance should be available in this for now."  These tokens are no longer intake vocabulary and are in no profile's kit, so any
# option whose every route needs one of them is out of scope.  They stay defined here only so library 'needs' remain readable.
EXCLUDED_TOKENS = {
    'band': 'resistance bands - OUT OF SCOPE (COACH-ANSWER EQ-01/EQ-02/EQ-07/EQ-08)',
    'band_anchor': 'band anchor - OUT OF SCOPE (COACH-ANSWER EQ-01)',
    'chains': 'lifting chains - OUT OF SCOPE (variable resistance, COACH-ANSWER EQ-12)',
}
RES_TOKMAP = {'dumbbell': 'dumbbell', 'bodyweight': None, 'barbell': 'barbell', 'cable': 'cable', 'machine_sel': 'machine_selectorized',
              'band': 'band', 'bench_press': 'weight_bench', 'bench': 'bench', 'box': 'box', 'kettlebell': 'kettlebell',
              'pullup_bar': 'pullup_bar', 'rack': 'rack', 'machine_pl': 'machine_plate_loaded', 'hex': 'hex_bar', 'plate': 'weight_plate',
              'seal_bench': 'seal_bench', 'household_object': 'household', 'wall': 'wall', 'dip_bars': 'dip_bars',
              'machine_pl_specialty': 'machine_specialty', 'step': 'step_low', 'medball': 'medball', 'landmine': 'landmine', 'EZ': 'ez_bar',
              'TRX': 'trx', 'dip_belt': 'dip_belt', 'stability_ball': 'stability_ball', 'GHD': 'ghd', 'hyper_bench': 'hyper_bench',
              'rings': 'rings', 'anchor': 'anchor_point', 'other_attachment': 'cable_attachments', 'smith': 'smith',
              'foam_roller': 'foam_roller', 'reverse_hyper': 'reverse_hyper', 'sandbag': 'sandbag', 'slider': 'slider',
              'decline_bench': 'decline_bench'}
ATH_TOKMAP = {t: t for t in ['floor', 'open_space_long', 'step_low', 'treadmill', 'barbell', 'medball', 'cardio_machine_cal',
                             'plate_low_target', 'partner_or_wall', 'dumbbell', 'open_space_short', 'barbell_bumpers_platform', 'hurdles',
                             'pullup_bar', 'kettlebell', 'bench', 'cones', 'cable', 'band', 'hex_bar', 'slam_ball', 'two_boxes',
                             'plyo_box_high', 'wall']}

HOUSEHOLD = {'floor', 'wall', 'partner_or_wall', 'household', 'slider', 'step_low', 'bench', 'box', 'anchor_point', 'cones',
             'open_space_short'}
GYM_COMMON = {'dumbbell', 'kettlebell', 'barbell', 'rack', 'weight_plate', 'plate_low_target', 'weight_bench', 'decline_bench',
              'ez_bar', 'pullup_bar', 'dip_bars', 'dip_belt', 'stability_ball', 'foam_roller', 'cable',
              'cable_attachments', 'machine_selectorized', 'machine_plate_loaded', 'smith', 'hyper_bench', 'treadmill',
              'cardio_machine_cal', 'medball', 'slam_ball', 'two_boxes', 'seal_bench', 'jump_rope'}

# v1 profiles (COACH-ANSWER EQ-01: the nine intake options were RIGHT except bands -> eight intake options; EQ-02 home kit without
# bands).  intake_option = the number on the intake form; FULL_FACILITY and FIELD_TRACK_NO_KIT are DERIVED (reached through add-on
# answers, not offered as a first choice) and are kept so the coverage tables still show the top and bottom of each setting.
PROFILES = {
    'FULL_FACILITY': dict(
        label='Full gym + every performance add-on (platform/bumpers, turf/runway, hurdles, belt squat, sled)',
        kit=HOUSEHOLD | GYM_COMMON | {'open_space_long', 'hurdles', 'plyo_box_high', 'hex_bar', 'ssb', 'landmine', 'barbell_bumpers_platform',
                                      'sandbag', 'sled', 'farmer_handles', 'trx', 'rings', 'machine_specialty', 'belt_squat', 'ghd', 'reverse_hyper'},
        ask=[], intake_option=None, derived_from="FULL_GYM with the add-ons barbell_bumpers_platform, hurdles, open_space_long, rings, belt_squat, farmer_handles answered yes",
        maps_to={'lib_athletic_core': 'P5_performance_facility', 'lib_resistance': 'full_gym (minus bands/chains)'},
        typical_client='athletes, teams, hybrid/CrossFit clients training at a facility'),
    'FULL_GYM': dict(
        label='Full commercial gym (everything a big-box gym has, incl. specialty machines)',
        kit=HOUSEHOLD | GYM_COMMON | {'plyo_box_high', 'hex_bar', 'ssb', 'landmine', 'sandbag', 'sled', 'trx', 'machine_specialty', 'ghd',
                                      'reverse_hyper'},
        ask=['barbell_bumpers_platform', 'hurdles', 'open_space_long', 'rings', 'belt_squat', 'farmer_handles'], intake_option=1,
        maps_to={'lib_athletic_core': 'P4_commercial_gym (+hex bar, high box)', 'lib_resistance': 'full_gym (minus bands/chains/bumpers)'},
        typical_client='gen-pop, physique, strength, athletes training alone'),
    'BASIC_GYM': dict(
        label='Basic commercial gym, no specialty machines/bars',
        kit=HOUSEHOLD | GYM_COMMON,
        ask=['trx', 'hex_bar', 'landmine', 'plyo_box_high', 'open_space_long', 'barbell_bumpers_platform', 'belt_squat'], intake_option=2,
        maps_to={'lib_athletic_core': 'P4_commercial_gym (minus hex bar, high box)', 'lib_resistance': 'commercial_basic (minus bands)'},
        typical_client='most gym members; apartment/corporate gyms with a cable stack'),
    'HOME_BARBELL': dict(
        label='Home/garage gym: barbell + rack + plates + bench + dumbbells (pull-up bar on the rack)',
        kit=HOUSEHOLD | {'open_space_long', 'barbell', 'rack', 'weight_plate', 'plate_low_target', 'weight_bench', 'dumbbell', 'pullup_bar'},
        ask=['kettlebell', 'medball', 'barbell_bumpers_platform', 'hex_bar', 'landmine', 'ez_bar', 'dip_bars',
             'cable', 'stability_ball', 'jump_rope'], intake_option=3,
        maps_to={'lib_athletic_core': 'between P3 and P4', 'lib_resistance': 'between home_plus_doorway_bar and commercial_basic'},
        typical_client='strength/hybrid trainees with a garage set-up'),
    'HOME_DB_BENCH': dict(
        label="Home: dumbbells + adjustable bench (the coach's ideal home kit adds a pull-up bar and an 8-10 lb medball, EQ-02)",
        kit=HOUSEHOLD | {'open_space_long', 'dumbbell', 'weight_bench'},
        ask=['pullup_bar', 'medball', 'kettlebell', 'stability_ball', 'trx', 'jump_rope'], intake_option=4,
        maps_to={'lib_athletic_core': 'P2_home_db_band minus bands', 'lib_resistance': 'home_db_bench_bands minus bands'},
        typical_client='home general-fitness / hypertrophy clients'),
    'KB_ONLY': dict(
        label='Kettlebells only (1-2 bells) + household',
        kit=HOUSEHOLD | {'open_space_long', 'kettlebell'},
        ask=['pullup_bar', 'medball', 'jump_rope'], intake_option=5,
        maps_to={'lib_athletic_core': 'P1 + kettlebell', 'lib_resistance': 'no direct tier'},
        typical_client='minimal home kit, travel, fat-loss'),
    'BODYWEIGHT': dict(
        label='Bodyweight only / no access (floor, wall, stairs, chair, towel, outdoor space)',
        kit=HOUSEHOLD | {'open_space_long'},
        ask=['pullup_bar', 'medball', 'jump_rope'], intake_option=6,
        maps_to={'lib_athletic_core': 'P1_no_gym_bodyweight', 'lib_resistance': 'bodyweight_only'},
        typical_client="'no access' clients; travel; outdoor"),
    'HOTEL_GYM': dict(
        label='Hotel gym: light-moderate dumbbells, adjustable bench, stability ball, treadmill/bike',
        kit=HOUSEHOLD | {'dumbbell', 'weight_bench', 'stability_ball', 'treadmill', 'cardio_machine_cal'},
        ask=['cable', 'cable_attachments', 'machine_selectorized', 'smith', 'trx', 'open_space_long', 'jump_rope'], intake_option=7,
        maps_to={'lib_athletic_core': 'P2 minus bands, plus treadmill/bike', 'lib_resistance': 'no direct tier'},
        typical_client='travelling clients (short blocks)'),
    'FIELD_TRACK_KIT': dict(
        label='Field / track / outdoor kit: medballs, slam balls, cones, mini hurdles, boxes, field or track (EQ-01 wording)',
        kit=HOUSEHOLD | {'open_space_long', 'medball', 'slam_ball', 'hurdles', 'plate_low_target', 'two_boxes', 'jump_rope'},
        ask=['kettlebell', 'dumbbell', 'trx', 'sandbag', 'plyo_box_high', 'pullup_bar'], intake_option=8,
        maps_to={'lib_athletic_core': 'P3_home_athlete minus DB/KB/bar, plus hurdles/runway', 'lib_resistance': 'bodyweight_only (+ medball)'},
        typical_client='group bootcamps, field-sport team sessions, outdoor athletes'),
    'FIELD_TRACK_NO_KIT': dict(
        label='Field / track with nothing carried (runway, bleacher steps, turf)',
        kit=(HOUSEHOLD - {'household'}) | {'open_space_long'},
        ask=['hurdles', 'pullup_bar', 'dip_bars', 'medball'], intake_option=None,
        derived_from='FIELD_TRACK_KIT with every kit add-on answered no (no table or door either)',
        maps_to={'lib_athletic_core': 'P1 + runway', 'lib_resistance': 'bodyweight_only (no table)'},
        typical_client='sprint/field athletes, outdoor sessions'),
}
PROFILE_ORDER = list(PROFILES)
# v0 -> v1 profile ids (for anyone reading generator_spec_v0 or the other synthesis files)
PROFILE_ID_CHANGES = {
    'HOME_DB_BENCH_BANDS': 'HOME_DB_BENCH (bands removed, COACH-ANSWER EQ-01/EQ-02)',
    'BANDS_ONLY': 'REMOVED (COACH-ANSWER EQ-01: "I don\'t program anything with bands"); a client who owns only bands is a BODYWEIGHT client',
    'BOOTCAMP_OUTDOOR': 'FIELD_TRACK_KIT (bands removed; renamed to the coach-approved option "field/track/outdoor kit", EQ-01)',
    'TRACK_FIELD': 'FIELD_TRACK_NO_KIT (derived: the field/track option with no kit carried)',
    'FULL_FACILITY': 'FULL_FACILITY (kept as a derived profile = FULL_GYM + every performance add-on; chains removed, EQ-12)',
}

# ---------------------------------------------------------------------------------------------
# 2. Bucket map (05_session_architecture bucket IDs) and slot metadata
# ---------------------------------------------------------------------------------------------
RES_CAT2BUCKET = {'VERTICAL PULL': 'RP_VPULL', 'HORIZONTAL PULL': 'RP_HPULL', 'VERTICAL PUSH': 'RP_VPUSH', 'HORIZONTAL PUSH': 'RP_HPUSH',
                  'SIDE RAISES': 'ISO_SIDE_REAR_DELT', 'BILATERAL KNEE DOMINANT': 'RP_BKD', 'UNILATERAL KNEE DOMINANT': 'RP_UKD',
                  'LEG EXTENSIONS': 'ISO_QUAD', 'BILATERAL HIP DOMNANT': 'RP_BHD', 'UNILATERAL HIP DOMINANT': 'RP_UHD',
                  'LEG CURLS': 'ISO_LEG_FLEXION', 'BICEP': 'ISO_BICEP', 'TRICEP': 'ISO_TRICEP', 'CALVES': 'ISO_CALF',
                  'FUNCTIONAL BIOMECHANICS SYSTEM': 'FBS_CHOP_ANTIROT'}
# COACH-ANSWER CAT-09: knee flexion (leg curls, nordics, slider curls) is NOT hip dominant; it is its own flexion-of-the-leg
# segment, 'kind of like bicep curls'.  The coach already wrote the segment: MM 'Sheet25'!H11 'LEG FLEXION' -> H13 'ham curls',
# next to B11 'BILATERAL HIP DOMINANT' -> 'rdl', 'hip thrust'.  The library files 9 knee-flexion items under
# 'BILATERAL HIP DOMNANT' (AN); they are moved to ISO_LEG_FLEXION here (sheet disagreement flagged per item).
KNEE_FLEXION_CELLS = {'AN15', 'AN17', 'AN18', 'AN19', 'AN50', 'AN54', 'AN91', 'AN100', 'AN101'}
FOCUS_SUB2BUCKET = {'QUADS': ['RP_BKD', 'RP_UKD', 'ISO_QUAD'], 'HAMSTRINGS': ['ISO_LEG_FLEXION', 'RP_BHD'], 'GLUTES': ['RP_BHD', 'RP_UHD'],
                    'BACK': ['RP_HPULL', 'RP_VPULL'], 'CHEST': ['RP_HPUSH'], 'SHOULDERS/TRAPS': ['RP_VPUSH', 'ISO_SIDE_REAR_DELT'],
                    'BICEP': ['ISO_BICEP'], 'TRICEP': ['ISO_TRICEP'], 'CALVES': ['ISO_CALF'], 'CORE': ['CORE_ANY']}


def ath_bucket(cat):
    seg = cat.split(' > ')[0]
    return {'CARDIO': 'COND_AEROBIC', 'TRIPPLE EXTENSION': 'AP_TRIPLE_EXT', 'PLYOS': 'AP_PLYO', 'THROWING': 'AP_THROW',
            'CHANGE OF DIRECTION': 'AP_COD', 'CORE THORAX': 'CORE_ANY', 'CORE PELVIS': 'CORE_ANY'}[seg]


SLOT_META = {
    'AP_PLYO': dict(coach_labels=["'Plyo'"], library="'MASTER EXERCISE LIBRARY'!G7:G162 (PLYOS)", tier=1, purpose_row6='SPEED/POWER'),
    'AP_THROW': dict(coach_labels=["'Throwing'"], library='K7:K87 (THROWING)', tier=2, purpose_row6='SPEED/POWER'),
    'AP_COD': dict(coach_labels=["'COD'"], library='L7:L242 (CHANGE OF DIRECTION)', tier=3, purpose_row6='CHANGE OF DIRECTION'),
    'AP_TRIPLE_EXT': dict(coach_labels=["'Tripple Extension'"], library='C7:C242 (TRIPPLE EXTENSION incl. JUMPING ANKLE C126:C136)',
                          tier=4, purpose_row6='SPEED/POWER'),
    'CORE_ANY': dict(coach_labels=["'Core'", "'LATERAL CORE'", "'Transverse core'", "'Sagital core'"],
                     library='O7:O283 (CORE THORAX + CORE PELVIS stacked)', tier='4b (athletes) / 8 (aesthetics)', purpose_row6='CORE'),
    'COND_AEROBIC': dict(coach_labels=["'Cardio'", "'Aerobic Capacity'", "'Buy out'"],
                         library='B7:B122 (8 tabs, running only) / B7:B335 (BOOTCAMP - OPTION 2: + DISTANCE + CALORIES)', tier=9,
                         purpose_row6='CARDIO'),
    'RP_BKD': dict(coach_labels=["'Bilateral KD'", "'bkd'"], library='AI7:AI122 (BILATERAL KNEE DOMINANT)', tier=5),
    'RP_BHD': dict(coach_labels=["'Bilateral HD'", "'bhd'"], library='AN7:AN122 (BILATERAL HIP DOMNANT)', tier=5),
    'RP_UKD': dict(coach_labels=["'Unilateral KD'", "'ukd'"], library='AL7:AL42 (UNILATERAL KNEE DOMINANT)', tier=6),
    'RP_UHD': dict(coach_labels=["'Unilateral HD'", "'uhd'"], library='AQ7:AQ42 (UNILATERAL HIP DOMINANT)', tier=6),
    'RP_HPULL': dict(coach_labels=["'Horizontal Pull'", "'horiz pull'"], library='X7:X162 (HORIZONTAL PULL)', tier='5-6'),
    'RP_VPULL': dict(coach_labels=["'Vertical Pull'", "'vert pull'"], library='U7:U122 (VERTICAL PULL)', tier='5-6'),
    'RP_HPUSH': dict(coach_labels=["'Horizontal Push'", "'Incline'", "'Flies'", "'Dips'", "'horiz push'"],
                     library='AD7:AD162 (HORIZONTAL PUSH)', tier='5-6'),
    'RP_VPUSH': dict(coach_labels=["'Vertical Push'", "'vert push'"], library='AA7:AA122 (VERTICAL PUSH)', tier='5-6'),
    'ISO_QUAD': dict(coach_labels=["'Leg Extensions'"], library='AM7:AM9 (LEG EXTENSIONS, 1 option)', tier=7),
    'ISO_LEG_FLEXION': dict(coach_labels=["'Leg Curls' (BYOP slot)", "'LEG FLEXION' (MM Sheet25!H11)", "'ham curls' (Sheet25!H13)"],
                            library='AR7:AR10 (LEG CURLS, the only range the BYOP slot reaches: 2 machines) + 9 knee-flexion items the library files '
                                    'under BILATERAL HIP DOMNANT (AN15, AN17, AN18, AN19, AN50, AN54, AN91, AN100, AN101)',
                            tier=7, alias_of_05_bucket='ISO_HAM',
                            segment_basis="COACH-ANSWER CAT-09: knee flexion is its own flexion-of-the-leg segment, 'kind of like bicep curls', not hip dominant"),
    'ISO_SIDE_REAR_DELT': dict(coach_labels=["'ABdution'", "'Side raises'", "'shoulders'"], library='AH7:AH42 (SIDE RAISES)', tier=7),
    'ISO_BICEP': dict(coach_labels=["'Bicep'", "'bicep'"], library='AS7:AS42 (BICEP)', tier=7),
    'ISO_TRICEP': dict(coach_labels=["'Tricep'", "'tricep'"], library='AT7:AT42 (TRICEP)', tier=7),
    'ISO_CALF': dict(coach_labels=["'Calves'", "'calfs'"], library='AU7:AU13 (CALVES)', tier='7 (or 1st on BYOP aesthetics A-days)'),
    'FBS_CHOP_ANTIROT': dict(coach_labels=['(not wired to any program dropdown)'], library='BC (FUNCTIONAL BIOMECHANICS SYSTEM)',
                             tier='core/accessory'),
    'FUNCTIONAL_CARRY': dict(coach_labels=['(stub, no exercises)'], library="BA 'CARRY' (labels only)", tier='accessory/finisher'),
    'FUNCTIONAL_DRAG': dict(coach_labels=['(stub, no exercises)'], library="BB 'DRAGS' (labels only)", tier='accessory/finisher'),
}
for sub in FOCUS_SUB2BUCKET:
    SLOT_META['FOCUS_' + sub.replace('/', '_')] = dict(coach_labels=["'Focus 1'", "'Focus 2'"],
                                                      library="AZ7:AZ335 (FULL FOCUS LIST, group '%s 👇')" % sub, tier=7,
                                                      fallback_buckets=FOCUS_SUB2BUCKET[sub])

LVL = {'foundational': 'F', 'intermediate': 'I', 'advanced': 'A', 'any': 'any'}
LVL_RANK = {'F': 0, 'I': 1, 'any': 1, 'A': 2}
# OBSERVED sheet opinions (ALL ABOUT SQUATS!G35:I41).  v1: informational only - COACH-ANSWER EQ-11 "I don't want to rank them because
# they have different brands, angles": no machine is promoted or demoted in any list or pick because of these words.
PREF = {'AI99': ('LOVE IT', 0), 'AI98': ('LOVE IT', 0), 'AZ10': ('LOVE IT', 0), 'AI52': ("I PERSONALLY DON'T LIKE IT", 2),
        'AI97': ("I PERSONALLY DON'T LIKE IT", 2)}
LOVE_RANK = {}  # v1: retired (EQ-11 - machines are not ranked)
# LIB-07: the full lifts are squat lifts; the generator shows the name with 'Squat' added (the sheet cell keeps the coach's text)
DISPLAY_NAME = {'C94': 'Squat Snatch', 'C95': 'Squat Clean', 'C96': 'Squat Clean & Jerk'}
# LIB-09 / LIB-02 / EQ-11: the coach's own description of items whose set-up was unclear
COACH_DESCRIPTION = {
    'AQ13': "COACH-ANSWER LIB-09: DBs in the hands, one half step back, deadlift on the front leg in a staggered stance, switch legs and keep alternating (alternating single-leg / staggered-stance deadlifts; saves time)",
    'AQ15': "COACH-ANSWER LIB-09: as AQ13 with a barbell (alternating staggered-stance single-leg deadlifts)",
    'AL14': "COACH-ANSWER LIB-09: sit on a box/bench/chair, one foot forward, stand up on that leg; the other foot only touches for balance or stays off the floor - a box (assisted) pistol",
    'AI15': "COACH-ANSWER LIB-09: both DBs hanging at the sides, arms straight down (not goblet, not racked) - zone 1 suitcase load",
    'G12': "COACH-ANSWER LIB-02: hands start on a box and land on the floor (stick the landing)",
    'C46': "COACH-ANSWER LIB-07: 'weighted squat to calf raise can be done with any tool'",
    'G9': "COACH-ANSWER LIB-03: the second 'Low Depth Drop' in the column is the single-leg or weighted variant",
}
ITEM_FLAGS = {
    'AA11': "COACH-ANSWER LIB-13: 'push press is easier' -> operative level = library FOUNDATIONAL (v0 had moved it to ADVANCED by the CAT-04 overhead rule; reverted)",
    'AA12': "COACH-ANSWER LIB-13: 'push press is easier' -> operative level = library FOUNDATIONAL (v0 ADVANCED reverted)",
    'AA13': "COACH-ANSWER LIB-13: 'push jerk is more technical ... more intermediate/advance' -> operative level INTERMEDIATE (eligible from intermediate; levels add options, CAT-05)",
    'AA14': "COACH-ANSWER LIB-13: push jerk = intermediate/advanced -> operative level INTERMEDIATE",
    'AI49': "SHEET vs COACH: filed MODERATE, but the coach names 'barbell back squat' as ADVANCED (load behind the body, CAT-04) -> operative level ADVANCED",
    'AI50': "SHEET vs COACH: filed MODERATE, but back-loaded (CAT-04: behind the body = advanced) -> operative level ADVANCED; never for older/injured/high-volume clients (EQ-03 'low-bar squat')",
    'AI47': "SHEET vs COACH: filed MODERATE, but the coach names 'front-loaded zercher' as FOUNDATIONAL (CAT-04) -> operative level FOUNDATIONAL",
    'AI48': "SHEET vs COACH: filed MODERATE, but front-loaded zercher = FOUNDATIONAL (CAT-04) -> operative level FOUNDATIONAL (barbell: coach first)",
    'X50': 'SHEET vs COACH (soft): filed ADVANCED although chest-supported (more reference points = easier; RP G62 \'Chest suported row\' sits at the easy end of the row ladder); kept ADVANCED (needs a seal bench), still open',
    'X51': 'see X50', 'X52': 'see X50', 'X53': 'see X50',
    'U20': "'KB Face Pulls ' is probably misfiled (face pull = cable rear-delt; RP K19 'Face pulls' sits under SHOULDERS); LIB-10 not answered yet",
    'AA50': "COACH-ANSWER LIB-11: 'Standing DB Press' is written twice (AA50/AA51); the second one is the barbell version ('Standing Barbell press', RP E15)",
    'AF11': "'Bench Push ups' is filed FOUNDATIONAL (AD13) and ADVANCED (AF11): read AD13 as hands-on-bench (easier) and AF11 as feet-on-bench (harder); LIB-12 not answered yet",
    'AN48': "COACH-ANSWER LIB-08: 'no levels on this' (GHD) -> operative level 'any'; use only if available and the client feels the right muscles (EQ-11)",
    'AN93': "COACH-ANSWER LIB-08: GHD has no levels -> operative level 'any' (merged with AN48)",
    'AN11': "COACH-ANSWER EQ-11: reverse hyper 'if they're available and if they feel good doing them ... I want them to feel the right muscles'",
    'AN55': "COACH-ANSWER EQ-11: back-extension machines only if available and the client feels the target muscles",
    'AD96': "COACH-ANSWER LIB-16: dips are 'more tricep than chest but still .5 and .5', done on a push day (credit belongs to 03_volume_dosing)",
    'AD97': "COACH-ANSWER LIB-16: dips credit 0.5 triceps / 0.5 chest (03_volume_dosing)",
    'AZ128': "COACH-ANSWER LIB-16: dips credit 0.5 triceps / 0.5 chest",
    'AI101': "COACH-ANSWER LIB-15: the '...KNEE DOMINANT - ADVANCED' label on leg extensions is a typo; leg extensions are available at every level",
    'B33': "COACH-ANSWER LIB-18: the coach calls this a marathon ('dont know when/where we need that'); a marathon is 26.2 mi, not 21.6 mi - data flag; not used by default",
    'C94': "COACH-ANSWER LIB-07: full squat version - shown as 'Squat Snatch'; needs bumpers + a place to drop the bar",
    'C95': "COACH-ANSWER LIB-07: full squat version - shown as 'Squat Clean'; without bumpers lower under control",
    'C96': "COACH-ANSWER LIB-07: full squat version - shown as 'Squat Clean & Jerk'; needs bumpers + a place to drop the bar",
    'AI20': 'single-joint machine filed in a compound column; do not use it to fill the Bilateral KD slot (it belongs to ISO_QUAD)',
    'AI55': 'single-joint machine filed in a compound column; do not use it to fill the Bilateral KD slot (it belongs to ISO_QUAD)',
    'AI101': 'single-joint machine filed in a compound column; do not use it to fill the Bilateral KD slot (it belongs to ISO_QUAD)',
    'AN15': "SHEET vs COACH: knee flexion filed under 'BILATERAL HIP DOMNANT'; moved to the LEG FLEXION segment (CAT-09)",
    'AN17': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'AN18': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'AN19': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'AN50': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'AN54': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'AN91': "SHEET vs COACH: 'Nordic Curl' is eccentric knee flexion; moved to LEG FLEXION (CAT-09 names nordics explicitly)",
    'AN100': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'AN101': 'SHEET vs COACH: knee flexion filed under hip dominant; moved to LEG FLEXION (CAT-09)',
    'C91': 'needs bumpers + a place to drop the bar; never for older/injured/high-volume clients (EQ-03 snatch)',
    'C93': 'needs bumpers + a place to drop the bar',
    'C92': 'without bumpers: lower under control',
    # v1 exclusions (also in EXCLUDED below)
    'U15': "OUT OF SCOPE v1: band-assisted (COACH-ANSWER EQ-01/EQ-02). Non-band route: 'Assisted Pull-Up Machine' U16:U18, negatives / flexed-arm hang, foot-assisted pull-ups",
    'AQ16': "OUT OF SCOPE v1: COACH-ANSWER LIB-09 'For the Camporini deadlift, you can ignore that one'",
}
for _c in ('AI92', 'AI93', 'AI95', 'AI96'):
    ITEM_FLAGS[_c] = ("OUT OF SCOPE v1: banded / reverse-banded variable resistance (COACH-ANSWER EQ-12 'No variable resistance should be "
                      "available in this for now'). Non-band route: 'Box. Any Squat Touch and Go fast' AI91 / 'Box. Any Squat Deload' AI94 "
                      "with straight weight at 'FAST RPE6 or about 60-70%' (MM 4 TRACKS!N17)")
for _c in ('BC11', 'BC12', 'BC15', 'BC16', 'BC19', 'BC20', 'BC48', 'BC49'):
    ITEM_FLAGS[_c] = ("OUT OF SCOPE v1: a band round the knees (COACH-ANSWER EQ-01 'I don't do bands'). Non-band twin: the 'Hold object "
                      "Adducted between knees' version of the same chop/hold (ball, pad or pillow squeezed between the knees)")
# [v1 adversarial check 2026-10-08] ATH-10 operative level of the full lifts; LIB-17 merges
for _c in ('C91', 'C92', 'C93', 'C94', 'C95', 'C96'):
    ITEM_FLAGS[_c] = (ITEM_FLAGS.get(_c, '') + ('; ' if ITEM_FLAGS.get(_c) else '') +
                      "COACH-ANSWER ATH-10: full Olympic lifts for 'intermediate plus and advanced and pros' -> operative level INTERMEDIATE "
                      "(library ADVANCED); beginners and beginning intermediates use hang cleans / pulls, DB/KB snatches and cleans, hex-bar jumps")
ITEM_FLAGS['AS16'] = "COACH-ANSWER LIB-17: near-duplicate of 'Seated Db Bicep Curls' AS14 - merged into one option in the lists"
ITEM_FLAGS['AS14'] = "COACH-ANSWER LIB-17: merged with the near-duplicate 'Seated DB Curls' AS16 (one option in the lists)"
ITEM_FLAGS['O164'] = "COACH-ANSWER LIB-17: 'Side Planks' (pelvis) is a near-duplicate of 'Side Plank' O47 (thorax) - merged into one option in the lists"
ITEM_FLAGS['O47'] = "COACH-ANSWER LIB-17: merged with the near-duplicate 'Side Planks' O164 (one option in the lists)"
# v1: cells removed from every list and count (they stay in exercise_index with the reason)
EXCLUDED = {
    'U15': dict(reason='band-assisted pull-up', basis='COACH-ANSWER EQ-01, EQ-02', replace_with="'Assisted Pull-Up Machine' U16:U18; pull-up negatives / flexed-arm hang; foot-assisted pull-ups (substitutes)"),
    'AQ16': dict(reason='Camporini Deadlifts - coach: ignore', basis='COACH-ANSWER LIB-09', replace_with="'Staggered Stance DL w/ DB' AQ12, 'Alternating DB Deadlifts' AQ13"),
}
for _c in ('AI92', 'AI93', 'AI95', 'AI96'):
    EXCLUDED[_c] = dict(reason='banded / reverse-banded box squat (variable resistance)', basis='COACH-ANSWER EQ-12',
                        replace_with="'Box. Any Squat Touch and Go fast' AI91 or 'Box. Any Squat Deload' AI94, straight weight 'FAST RPE6 or about 60-70%'")
_BC_TWIN = {'BC11': 'BC10', 'BC12': 'BC9', 'BC15': 'BC14', 'BC16': 'BC13', 'BC19': 'BC18', 'BC20': 'BC17', 'BC48': 'BC47', 'BC49': 'BC47'}
for _c, _t in _BC_TWIN.items():
    EXCLUDED[_c] = dict(reason='band round the knees for adduction', basis='COACH-ANSWER EQ-01',
                        replace_with="the 'Hold object Adducted between knees' twin (%s)" % _t)


def row_of(cell):
    m = re.match(r'([A-Z]+)(\d+)', cell or '')
    return (m.group(1), int(m.group(2))) if m else ('', 0)


def res_needs(rec):
    out = []
    for g in rec.get('implement_requirement_groups') or []:
        if 'bodyweight' in g:
            continue
        out.append(sorted({RES_TOKMAP[t] for t in g}))
    return out  # AND of OR-groups


def ath_needs(rec):
    return [sorted({ATH_TOKMAP[t] for t in k}) for k in (rec.get('requires_any_of') or [])]  # OR of AND-kits


def avail_and_of_or(groups, kit):
    return all(any(t in kit for t in g) for g in groups)


def avail_or_of_and(kits, kit):
    return (not kits) or any(all(t in kit for t in k) for k in kits)


# ---------------------------------------------------------------------------------------------
# 3. Library items -> uniform records
# ---------------------------------------------------------------------------------------------
LVL_NUM = {'F': 0, 'I': 1, 'A': 2}
NUM_LVL = {0: 'F', 1: 'I', 2: 'A'}
# Operative-level overrides: applied ONLY where the coach's CAT-04 answer is explicit (everything else keeps the library level,
# because the coach also says 'the levels are still very theoretical' (CAT-05) and skill/stability are part of his rule).
EXPLICIT_ANCHOR_OVERRIDES = {
    'AI47': ('F', "CAT-04 anchor: 'front-loaded zercher' = foundational"),
    'AI48': ('F', "CAT-04 anchor: 'front-loaded zercher' = foundational"),
    'AI49': ('A', "CAT-04 anchor: 'barbell back squat' (load behind the body) = advanced"),
    'AI50': ('A', "CAT-04 anchor: load behind the body = advanced"),
    # v1: LIB-13 replaces the v0 CAT-04 overrides of AA11:AA14 ('push press is easier, push jerk is more technical but its more
    # intermediate/advance'): push press AA11/AA12 keep the library level (FOUNDATIONAL); push jerk AA13/AA14 -> INTERMEDIATE.
    'AA13': ('I', "LIB-13: 'push jerk is more technical but its more intermediate/advance' (eligible from intermediate; levels add options, CAT-05)"),
    'AA14': ('I', "LIB-13: push jerk = intermediate/advanced"),
    # LIB-08: 'no levels on this' (GHD AN48 MODERATE / AN93 ADVANCED)
    'AN48': ('any', "LIB-08: 'no levels on this' (GHD)"),
    'AN93': ('any', "LIB-08: 'no levels on this' (GHD)"),
}
# [v1 adversarial check 2026-10-08] ATH-10: 'the beginners and beginning intermediates are going to be more like hang cleans ...
# The more intermediate plus and advanced and pros are going to be doing the full scope of it.'  The library files the full
# lifts C91:C96 ADVANCED, which made them ineligible for the intermediate athlete that CR-16 and load_velocity.olympic say gets
# them.  Operative level INTERMEDIATE (eligible from L2; levels add options, CAT-05); early intermediates still start on the
# hang variations by ranking, and the EQ-03 never-list (snatch) still applies to older / injured / high-volume clients.
ATH_LEVEL_OVERRIDES = {c: ('I', "ATH-10: 'The more intermediate plus and advanced and pros are going to be doing the full scope of it' "
                                "(full Olympic lifts eligible from intermediate; beginners and beginning intermediates start on hang cleans / pulls)")
                       for c in ('C91', 'C92', 'C93', 'C94', 'C95', 'C96')}
# [v1 adversarial check] LIB-07: 'weighted squats to calf raise can be done with any tool'
C46_ANY_TOOL = [['dumbbell'], ['kettlebell'], ['barbell'], ['hex_bar'], ['medball'], ['weight_plate'], ['sandbag']]
# [v1 adversarial check] LIB-17 RIGHT ('Near-duplicates ... several seated DB curl entries; Side Plank in thorax and Side Planks
# in pelvis: merge?' -> merge them): the lists show one option per merged pair (both cells stay in exercise_index).
LIB17_MERGE = {'seated db bicep curls': 'seated db curls', 'side planks': 'side plank'}
MACHINE_ROLE = {}  # cell -> ON_RAMP / VOLUME_TOOL / ISOLATION (filled below)
UNILATERAL_WORDS = ('single arm', 'single leg', ' sl ', 'unilateral', 'alternating', 'staggered', 'one hand', '1 hand', 'pistol',
                    'lunge', 'step up', 'step ups', 'get ups', 'split', 'renegade', 'sesaw', 'camporini', ' ul ', 'right ', 'left ',
                    'rear foot', 'front foot', 'curtsy', 'bulgarian', '(uni', 'sl ')


def laterality_of(name, rec_lat=None, category=''):
    n = ' ' + name.lower() + ' '
    if rec_lat in ('bilateral', 'unilateral'):
        lat = rec_lat
    else:
        lat = 'unilateral' if any(w in n for w in UNILATERAL_WORDS) else 'bilateral'
    if 'UNILATERAL' in (category or '').upper():
        lat = 'unilateral'
    return lat


def machine_role(r, bucket, lvl_lib):
    if r['implement_class'] != 'machine' and 'assisted' not in r['name_raw'].lower():
        return None
    if bucket.startswith('ISO_') or r.get('exercise_class') == 'isolation':
        return 'ISOLATION'
    if bucket in ('RP_VPULL', 'RP_HPULL', 'RP_HPUSH') and lvl_lib in ('F', 'any'):
        return 'ON_RAMP'
    return 'VOLUME_TOOL'


LOWER_BUCKETS = {'RP_BKD', 'RP_BHD', 'RP_UKD', 'RP_UHD', 'ISO_CALF', 'AP_TRIPLE_EXT', 'FOCUS_QUADS', 'FOCUS_HAMSTRINGS', 'FOCUS_GLUTES',
                 'FOCUS_CALVES'}


def axial_load(name, impl, bucket):
    """v1 (COACH-ANSWER PER-04 + EQ-11): how much the exercise compresses the spine.  PER-04: 'I don't want to always load the lower
    back and the spine twice per week ... load it once per week and load it correctly ... with the squat, and ... with the deadlifts';
    EQ-11: 'Belt squats are for people that you don't need to load them axially'.  INFERRED tags from the name, lower body only:
      high      = barbell on the back/front/overhead or a barbell pulled from the floor/hang (squats, deadlifts, good mornings, Olympic lifts)
      moderate  = hex bar, heavy DB/KB/sandbag held in the hands or hugged, landmine, Smith squat
      supported = back-padded machine that still loads through the shoulders (hack squat, pendulum)
      none      = leg press, belt squat, hip thrust/bridge, leg extension/curl, back extension/GHD/reverse hyper, bodyweight"""
    if bucket not in LOWER_BUCKETS:
        return None
    n = name.lower()
    i = (impl or '').lower()
    if any(w in n for w in ('leg press', 'belt squat', 'hip thrust', 'bridge', 'leg ext', 'leg curl', 'hyper', 'ghd', 'pull through',
                            'machine calf', 'nordic', 'curl')):
        return 'none'
    if any(w in n for w in ('hack', 'pendulum')) or ('machine' in n and ('good morning' in n or 'goodmorning' in n)):
        return 'supported'
    if 'smith' in n or 'hex' in n or 'landmine' in n:
        return 'moderate'
    if 'barbell' in i or 'barbell' in n:
        return 'high'
    if any(w in i for w in ('db', 'kb', 'dumbbell', 'kettlebell')) or any(w in n.split() for w in ('db', 'kb')) or \
            any(w in n for w in ('dumbbell', 'kettlebell', 'goblet', 'zercher', 'sandbag', 'weighted')):
        return 'moderate'
    if any(w in n for w in ('back squat', 'front squat', 'bar squat', 'good morning', 'goodmorning', 'clean', 'snatch', 'jerk', 'thruster', 'box. any')):
        return 'high'
    return 'none'


def strip_band(name):
    """v1 (COACH-ANSWER EQ-01): library names written 'cable or band(ed)' keep only the cable route in what the client sees."""
    n2 = re.sub(r'\s+or\s+band(ed)?\b', '', name)
    n2 = re.sub(r'\bband(ed)?\s+or\s+', '', n2)
    return n2 if n2 != name else None


ROTATION_BIAS = {1: 'external-rotation bias (vertical: arms down / standing)',
                 2: 'internal-rotation bias (horizontal: hands in front, knee at hip height / half squat; compressive)',
                 3: 'external-rotation bias (vertical: arms overhead / deep squat)'}


items = []
for r in RES:
    if r.get('record_type') != 'exercise' or not r.get('is_primary'):
        continue
    cat = r['category']
    if cat == 'CORE PELVIS':
        continue  # S-T level-view copies of R; covered by the athletic/core library (O7:O283)
    if cat == 'FULL FOCUS LIST':
        bucket = 'FOCUS_' + (r.get('subgroup') or 'OTHER').replace('/', '_')
    elif r['cell'] in KNEE_FLEXION_CELLS:
        bucket = 'ISO_LEG_FLEXION'
    else:
        bucket = RES_CAT2BUCKET[cat]
    u = (r['exact_text_matches_elsewhere'].get('BYOP_program_tabs_00_08') or 0) + (
        r['exact_text_matches_elsewhere'].get('MASTER_MODEL_tabs_excl_copy') or 0)
    needs = res_needs(r)
    name = r['name_raw'].strip()
    z = load_zone(name, cat, r['implement_class'])
    est, g, gwhy = coach_level_estimate(name, z['zone'], r['skill_demand'], r['implement_class'], r['constraint_level'])
    lvl_lib = LVL[r['level']['normalized']]
    lvl_op, override = lvl_lib, None
    if r['cell'] in EXPLICIT_ANCHOR_OVERRIDES:
        lvl_op = EXPLICIT_ANCHOR_OVERRIDES[r['cell']][0]
        override = dict(frm=lvl_lib, to=lvl_op, basis='COACH-ANSWER ' + EXPLICIT_ANCHOR_OVERRIDES[r['cell']][1])
    elif (r['implement_class'] == 'machine' and r['skill_demand'] == 'low' and lvl_lib in ('I', 'A')):
        lvl_op = 'F'
        override = dict(frm=lvl_lib, to='F', basis="COACH-ANSWER CAT-04: 'Machines or cables change this: easier, because the machine/cable does "
                                                    "the stabilizing work' (library files it higher as a volume tool; CAT-05 levels add options)")
    role = machine_role(r, bucket, lvl_lib)
    items.append(dict(lib='resistance', cell=r['cell'], name=name, bucket=bucket, category=cat,
                      sub=r.get('subgroup'), lvl=lvl_op, lvl_library=lvl_lib, level_override=override,
                      c=r['constraint_level'], skill=r['skill_demand'],
                      stab=r['stability_demand'], vel=r['velocity_intent'], fv=r['force_velocity_zone'], impl=r['implement_class'],
                      zone=z['zone'], zone_path=z['path'], behind_body=z['behind_body'], zone_basis=z['basis'],
                      rotation_bias=ROTATION_BIAS.get(z['zone']),
                      coach_rule_level=NUM_LVL[est], guidance=g, guidance_basis=gwhy,
                      laterality=laterality_of(name, r.get('laterality'), cat), machine_role=role,
                      muscle_size=r.get('muscle_size_class'), ex_class=r.get('exercise_class'),
                      axial_load=axial_load(name, r['implement_class'], bucket),
                      needs_and_of_or=needs, usage=u, suitable_for=r.get('suitable_for') or [],
                      excluded=EXCLUDED.get(r['cell']), display_name=DISPLAY_NAME.get(r['cell']) or (None if r['cell'] in EXCLUDED else strip_band(name)),
                      coach_description=COACH_DESCRIPTION.get(r['cell']),
                      avail={p: (r['cell'] not in EXCLUDED) and avail_and_of_or(needs, PROFILES[p]['kit']) for p in PROFILES}))
for r in ATH:
    if not r.get('is_primary'):
        continue
    needs = ath_needs(r)
    name = r['name_raw'].strip()
    if r['cell'] == 'L92':
        name = '5-10-5 (cell stored as date 2005-05-10)'
    z = load_zone(name, r['category'], '')
    est, g, gwhy = coach_level_estimate(name, z['zone'], r.get('skill_demand'), '', r['constraint_level'])
    lvl = LVL[r['level']['normalized']]
    _b = ath_bucket(r['category'])
    if _b == 'AP_PLYO':
        # v1 COACH-ANSWER CAT-10: 'It doesn't apply to the plyos. The plyos are different.'
        z = dict(zone=None, path=None, behind_body=False,
                 basis="COACH-ANSWER CAT-10: Davidson zones do not apply to plyos (the plyo 'ZONE 1/2/3' key in Sheet23 is a method progression, CAT-11)")
    _lvl_op, _ovr = lvl, None
    if r['cell'] in ATH_LEVEL_OVERRIDES:
        _lvl_op = ATH_LEVEL_OVERRIDES[r['cell']][0]
        _ovr = dict(frm=lvl, to=_lvl_op, basis='COACH-ANSWER ' + ATH_LEVEL_OVERRIDES[r['cell']][1])
    if r['cell'] == 'C46':
        needs = C46_ANY_TOOL
    items.append(dict(lib='athletic_core', cell=r['cell'], name=name, bucket=_b, category=r['category'],
                      sub=r['category'].split(' > ')[1], lvl=_lvl_op, lvl_library=lvl, level_override=_ovr, c=r['constraint_level'],
                      skill=r.get('skill_demand'), stab=r.get('stability_demand'), vel=r.get('velocity_intent'),
                      fv=r.get('force_velocity_zone'), impl='/'.join(r.get('implements') or []),
                      zone=z['zone'], zone_path=z['path'], behind_body=z['behind_body'], zone_basis=z['basis'],
                      rotation_bias=ROTATION_BIAS.get(z['zone']),
                      coach_rule_level=NUM_LVL[est], guidance=g, guidance_basis=gwhy,
                      laterality=laterality_of(name, None, r['category']), machine_role=None,
                      muscle_size=None, ex_class=None, axial_load=axial_load(name, '/'.join(r.get('implements') or []), _b),
                      needs_or_of_and=needs,
                      usage=len(r.get('observed_usage_exact') or []), suitable_for=r.get('suitable_for') or [],
                      excluded=EXCLUDED.get(r['cell']), display_name=DISPLAY_NAME.get(r['cell']) or (None if r['cell'] in EXCLUDED else strip_band(name)),
                      coach_description=COACH_DESCRIPTION.get(r['cell']),
                      avail={p: (r['cell'] not in EXCLUDED) and avail_or_of_and(needs, PROFILES[p]['kit']) for p in PROFILES}))

# v1: options the coach approved or named that are not in his library (counted as as-written options of their slot)
ADDITIONS = [
    dict(cell='ADD-EQ05', name='Seated Machine Shoulder Press', bucket='RP_VPUSH', category='VERTICAL PUSH (coach-approved addition)',
         source="COACH-ANSWER EQ-05 - RIGHT to our question 'VERTICAL PUSH has no machine or cable option. Add a seated machine shoulder press?' (our assumption, now his rule: yes, for older and injured clients)",
         lvl='F', c=5, skill='low', stab='low', vel='controlled', fv='accelerative_strength', impl='machine', zone=3,
         zone_basis='INFERRED: press finishes overhead; the machine does the stabilising (CAT-04) so it is FOUNDATIONAL',
         laterality='bilateral', machine_role='ON_RAMP', muscle_size='big', ex_class='compound',
         needs=[['machine_plate_loaded', 'machine_selectorized']], suitable_for=['high_volume', 'injured/pain', 'older_adult', 'beginner']),
    dict(cell='ADD-EQ11', name='Belt Squat', bucket='RP_BKD', category='BILATERAL KNEE DOMINANT (coach-named addition)',
         source="COACH-ANSWER EQ-11: 'Belt squats are for people that you don't need to load them axially ... If you have an athlete that already has been loaded on their back that week ... switch over to the belt squat'",
         lvl='F', c=4, skill='low', stab='low', vel='controlled', fv='accelerative_strength', impl='machine', zone=1,
         zone_basis='INFERRED: load hangs low from a hip belt (zone 1); machine path', laterality='bilateral', machine_role='VOLUME_TOOL',
         muscle_size='big', ex_class='compound', needs=[['belt_squat']],
         suitable_for=['high_volume', 'injured/pain', 'older_adult', 'beginner', 'athlete_power']),
]
for a in ADDITIONS:
    est, g, gwhy = coach_level_estimate(a['name'], a['zone'], a['skill'], a['impl'], a['c'])
    items.append(dict(lib='coach_addition', cell=a['cell'], name=a['name'], bucket=a['bucket'], category=a['category'], sub=None,
                      lvl=a['lvl'], lvl_library=a['lvl'], level_override=None, not_in_library=True, source=a['source'],
                      c=a['c'], skill=a['skill'], stab=a['stab'], vel=a['vel'], fv=a['fv'], impl=a['impl'],
                      zone=a['zone'], zone_path=None, behind_body=False, zone_basis=a['zone_basis'], rotation_bias=ROTATION_BIAS.get(a['zone']),
                      coach_rule_level=NUM_LVL[est], guidance=g, guidance_basis=gwhy, laterality=a['laterality'],
                      machine_role=a['machine_role'], muscle_size=a['muscle_size'], ex_class=a['ex_class'],
                      axial_load=axial_load(a['name'], a['impl'], a['bucket']), needs_and_of_or=a['needs'], usage=0,
                      suitable_for=a['suitable_for'], excluded=None, display_name=None, coach_description=None,
                      avail={p: avail_and_of_or(a['needs'], PROFILES[p]['kit']) for p in PROFILES}))

# ---------------------------------------------------------------------------------------------
# 3b. Test the coach's CAT-04 level rule against his own library levels (levelled columns only)
# ---------------------------------------------------------------------------------------------
LEVEL_TEST_BUCKETS = {'RP_VPULL', 'RP_HPULL', 'RP_VPUSH', 'RP_HPUSH', 'RP_BKD', 'RP_BHD', 'RP_UHD', 'ISO_LEG_FLEXION', 'AP_TRIPLE_EXT'}
level_test = dict(rows=[], counts=collections.Counter(), by_class=collections.Counter())
for it in items:
    if it['lib'] == 'coach_addition':
        continue  # not a library level: the test is about the coach's own library (band items included, as written)
    is_fbs_chop = it['bucket'] == 'FBS_CHOP_ANTIROT' and any(w in it['name'].lower() for w in ('chop', 'crunch'))
    if it['lvl_library'] == 'any' or not (it['bucket'] in LEVEL_TEST_BUCKETS or is_fbs_chop):
        continue
    if it['bucket'] == 'AP_TRIPLE_EXT' and it['sub'] == 'JUMPING ANKLE':
        continue
    if it['cell'] in ('AF11',):
        continue  # duplicate with opposite meaning (data-quality)
    if it['cell'] in ('AI20', 'AI55', 'AI101'):
        continue  # leg-extension copies filed in a compound column
    d = LVL_NUM[it['coach_rule_level']] - LVL_NUM[it['lvl_library']]
    # position-only test for the FBS chops (all cable-or-band by design, so guidance is constant across the column)
    if is_fbs_chop and it['zone'] is not None:
        d = (it['zone'] - 1) - LVL_NUM[it['lvl_library']]
    if d == 0:
        cls = 'agrees'
    elif d < 0:
        if it['impl'] == 'machine':
            cls = 'library_harder: machine filed as a volume tool'
        elif it['skill'] == 'high' or it['stab'] == 'high' or ('barbell' in (it['impl'] or '') and it['skill'] != 'low'):
            cls = 'library_harder: explained by skill/stability (barbell, high skill)'
        else:
            cls = 'library_harder: other variables (ROM, body angle, support, implement size)'
    else:
        if it['zone'] == 3 and it['guidance'] == 0:
            cls = 'library_easier: zone-3 unguided lift filed low (conflicts with CAT-04)'
        else:
            cls = 'library_easier: guided/supported or unloaded item'
    level_test['counts'][d] += 1
    level_test['by_class'][cls] += 1
    level_test['rows'].append(dict(cell=it['cell'], name=it['name'], bucket=it['bucket'], library_level=it['lvl_library'],
                                   coach_rule_level=it['coach_rule_level'] if not is_fbs_chop else NUM_LVL[it['zone'] - 1],
                                   zone=it['zone'], behind_body=it['behind_body'], guidance=it['guidance_basis'], delta=d, cls=cls,
                                   operative_level=it['lvl']))
level_test['counts'] = {str(k): v for k, v in sorted(level_test['counts'].items())}
level_test['by_class'] = dict(level_test['by_class'])
level_test['n'] = len(level_test['rows'])
level_test['exact'] = sum(1 for r in level_test['rows'] if r['delta'] == 0)
level_test['within_one'] = sum(1 for r in level_test['rows'] if abs(r['delta']) <= 1)
# per-bucket agreement
_pb = collections.defaultdict(lambda: [0, 0])
for r in level_test['rows']:
    # [verify 2026-10-08] keep the real bucket id (was relabelled 'FBS_CHOPS', which is not a bucket id anywhere else)
    _pb[r['bucket']][0] += 1
    _pb[r['bucket']][1] += r['delta'] == 0
level_test['by_bucket'] = {k: dict(n=v[0], exact=v[1]) for k, v in _pb.items()}

# zone distribution by operative level (resistance, levelled buckets)
zone_by_level = collections.defaultdict(collections.Counter)
for it in items:
    if it['lib'] == 'resistance' and it['lvl_library'] != 'any':
        zone_by_level[it['lvl_library']][str(it['zone']) + ('b' if it['behind_body'] else '')] += 1
zone_by_level = {k: dict(v) for k, v in zone_by_level.items()}

# cross-check vs the decode teams' own tiers
xcheck = collections.Counter()
# v1: the decode teams' tiers still contain bands (and chains at full_gym).  A disagreement is EXPECTED only where the decode tier
# reaches the exercise through a band/chain route; xcheck_diff lists every disagreeing cell so this can be verified.
xcheck_diff = collections.defaultdict(list)
for r in RES:
    if r.get('record_type') != 'exercise' or not r.get('is_primary') or r['category'] == 'CORE PELVIS':
        continue
    needs = res_needs(r)
    for mine, theirs in [('FULL_FACILITY', 'full_gym'), ('BASIC_GYM', 'commercial_basic'),
                         ('HOME_DB_BENCH', 'home_db_bench_bands'), ('BODYWEIGHT', 'bodyweight_only')]:
        a = avail_and_of_or(needs, PROFILES[mine]['kit'])
        b = r['available_at_tier'][theirs]
        k = 'agree' if a == b else ('mine_only' if a else 'theirs_only')
        xcheck[(mine, theirs, k)] += 1
        if k != 'agree':
            xcheck_diff['|'.join((mine, theirs, k))].append(dict(cell=r['cell'], name=r['name_raw'].strip(), needs=needs,
                                                                band_or_chain_route=any(t in g for g in needs for t in EXCLUDED_TOKENS)))
for r in ATH:
    if not r.get('is_primary'):
        continue
    needs = ath_needs(r)
    for mine, theirs in [('BODYWEIGHT', 'P1_no_gym_bodyweight'), ('HOME_DB_BENCH', 'P2_home_db_band'),
                         ('FULL_FACILITY', 'P5_performance_facility'), ('BASIC_GYM', 'P4_commercial_gym')]:
        a = avail_or_of_and(needs, PROFILES[mine]['kit'])
        b = theirs in (r.get('available_in_profiles') or [])
        k = 'agree' if a == b else ('mine_only' if a else 'theirs_only')
        xcheck[(mine, theirs, k)] += 1
        if k != 'agree':
            xcheck_diff['|'.join((mine, theirs, k))].append(dict(cell=r['cell'], name=r['name_raw'].strip(), needs=needs,
                                                                band_or_chain_route=any(t in kk for kk in needs for t in EXCLUDED_TOKENS)))

# ---------------------------------------------------------------------------------------------
# 4. Hand-curated substitutes (applied when a slot is empty/thin for a profile).  needs = OR of AND-kits ([[]] = no kit).
#    flag: same_pattern | partial | zone_shift | pattern_gap | rule
# ---------------------------------------------------------------------------------------------
UNI_SUBS = {'Pistol Squats (load moves to one leg)', 'slow eccentric deficit Lunges (no weigths)', 'heavy rear foot on wall db deadlift',
            'Bodyweight single-leg RDL with reach', 'SL glute bridges (heel on bench)', 'Single arm Db Row', 'one dumbbell half kneeling single arm db press',
            'Half-kneeling single-arm KB press', 'HEAVY Single arm rotational half kneeling cable row',
            '... or Bird Dog Row (DB/KB, hand and knee on a bench)', 'Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB)',
            'Staggered stance DB snatch', 'staggered stance db deadlift', 'Rear foot on wall DB RDL',
            'Staggered-stance KB deadlift (contralateral)', 'SL hip thurts march', 'SL hops to plate',
            'Single-leg slider curl (towel)', 'Single Leg Get Ups (box pistol)'}


def S(name, src, basis, needs, flag, c=None, note=None):
    return dict(name=name, src=src, basis=basis, needs=needs, flag=flag, c=c, note=note,
                laterality='unilateral' if name in UNI_SUBS else 'bilateral')


# v1 (COACH-ANSWER EQ-01, EQ-02, EQ-07, EQ-08, EQ-12): every band, chain and reverse-band substitute of v0 is gone.  Each one is
# either replaced by a non-band option (named in the src) or simply dropped when the slot already had one.  The v0 band items are
# listed in REMOVED_V0_SUBS below so the change can be audited.
SUBS = {
    'RP_VPULL': [
        S('Eccentric (negative) pull-ups / flexed-arm hang', 'standard regression; no coach cell', 'INFERRED', [['pullup_bar']],
          'same_pattern', 1, 'foundational stand-in when there is a bar but no pulldown or assisted machine (no band assistance, EQ-01)'),
        S('Foot-assisted pull-up / chin-up (feet on a box or chair under the bar)',
          "standard regression; replaces 'pull ups or banded assisted pull ups' (MM BASEBALL!CG53) and U15 'Assisted  Pull-Up w bands' (EQ-01)",
          'INFERRED', [['pullup_bar', 'box']], 'same_pattern', 2, 'the legs take as much of the load as needed: the non-band assistance'),
        S('Cable lat pull over', "MM BASEBALL!AA34 (in the vert-pull slot); COACH-ANSWER LIB-09: 'The pull under is really called a pull over ... "
          "on a cable machine with your lats, you're doing a lat pull over'", 'OBSERVED', [['cable']], 'same_pattern', 3),
        S('DB pullover on a bench', 'lib_resistance substitutes_by_equipment.db_only; the free-weight form of the lat pull-over (LIB-09)', 'INFERRED',
          [['dumbbell', 'weight_bench']], 'partial', 3, 'shoulder-extension (lat) work without a vertical line of pull'),
        S('KB pullover on the floor', 'by analogy with the DB pullover', 'INFERRED', [['kettlebell']], 'partial', 3),
        S("Inverted row under a sturdy table (a horizontal pull)", 'X13 Inverted Rows, adapted', 'INFERRED', [['household']],
          'pattern_gap', 3, "no vertical pull without a bar or a cable (no bands, EQ-01): flag pattern_gap and recommend a doorway pull-up bar "
                            "(part of the coach's ideal home kit, EQ-02)"),
        S('Add 1-2 sets to the session\'s horizontal pull', 'by analogy with 4 TRACKS!W42 (extra sets replace a missing option)',
          'INFERRED', [[]], 'pattern_gap', None),
    ],
    'RP_HPULL': [
        S('Bent over db or kb row', 'RP!G66', 'OBSERVED', [['dumbbell'], ['kettlebell']], 'same_pattern', 2),
        S('Single arm Db Row', 'RP!G76', 'OBSERVED', [['dumbbell']], 'same_pattern', 2),
        S('Chest-supported DB row on an incline bench (seal-row stand-in)', 'X52/X53 Seal DB Rows, adapted', 'INFERRED',
          [['dumbbell', 'weight_bench']], 'same_pattern', 4),
        S('HEAVY Single arm rotational half kneeling cable row',
          "MM EXAMPLE ATHLETIC FULL BODY SPLI!C16 - the cable route of the coach's 'cable row or band row or Bird Dog Row' cell (the band route is out, EQ-01)",
          'OBSERVED', [['cable']], 'same_pattern', 3),
        S('... or Bird Dog Row (DB/KB, hand and knee on a bench)', 'MM EXAMPLE ATHLETIC FULL BODY SPLI!C16', 'OBSERVED',
          [['dumbbell', 'bench'], ['kettlebell', 'bench']], 'same_pattern', 2),
        S('Kong row (double-KB row from the floor)',
          "RP!G77 'Kong Rows'; COACH-ANSWER LIB-09: two kettlebells on the ground, hinge down, row them off the ground and put them back - "
          "'for people that have some type of shoulder pain or back pain ... It doesn't really create a lot of stimulus'",
          'OBSERVED', [['kettlebell']], 'same_pattern', 2, 'pain option (shoulder/back) and hinge-position strength; low stimulus, so not the main row'),
        S('Incline reverse pushup (rings/trx/barbell/smith machine)', 'RP!G64 (Paralell version G65)', 'OBSERVED',
          [['trx'], ['rings'], ['barbell', 'rack'], ['smith']], 'same_pattern', 3),
        S('Inverted row under a sturdy table', 'X13 Inverted Rows, adapted', 'INFERRED', [['household']], 'partial', 3,
          'check the table is stable; load is fixed at bodyweight'),
        S('Towel row on a door frame (door closed, towel round the handles)', 'none', 'INFERRED', [['household']], 'partial', 2),
    ],
    'RP_VPUSH': [
        S('one dumbbell half kneeling single arm db press', 'MM BASEBALL!CG34', 'OBSERVED', [['dumbbell']], 'same_pattern', 2),
        S('Half-kneeling single-arm KB press', 'KB version of MM BASEBALL!CG34; RP!C30 "Double kb or Db"', 'INFERRED', [['kettlebell']],
          'same_pattern', 2),
        S('LAndmine half kneeling press', 'MM BASEBALL!M34', 'OBSERVED', [['landmine', 'barbell']], 'same_pattern', 2),
        S('Seated Smith machine shoulder press', "Smith form of the EQ-05 seated machine press (ADD-EQ05)", 'INFERRED',
          [['smith', 'weight_bench']], 'same_pattern', 4, 'when there is no shoulder-press machine; constraint 4 for older/injured/high-volume clients (EQ-03/EQ-05)'),
        S('medball press', 'MM BASEBALL!BO34 (in the vert-push slot)', 'OBSERVED', [['medball']], 'zone_shift', 1,
          'ballistic version: moves the slot from controlled to speed-strength'),
        S('Pike push-up, feet on a bench (progression of AA53)', 'AA53 Pike Push Ups + RP I23 feet-on-bench idea', 'INFERRED',
          [['bench']], 'same_pattern', 1),
    ],
    'RP_HPUSH': [
        S('KB floor press', "mirrors 'DB Press on floor' AD10", 'INFERRED', [['kettlebell']], 'same_pattern', 3),
        S('offset pushups', 'MM BASEBALL!AW37', 'OBSERVED', [[]], 'same_pattern', 2),
        S('medball floor catch & release push', 'MM BASEBALL!CC28', 'OBSERVED', [['medball']], 'zone_shift', 1),
        S('Push ups/chest pass', 'MM BASEBALL!BG47', 'OBSERVED', [['medball', 'partner_or_wall']], 'zone_shift', 1),
    ],
    'ISO_SIDE_REAR_DELT': [
        S('Cable or DB side raises', 'MM 4 TRACKS!W35', 'OBSERVED', [['cable'], ['dumbbell']], 'same_pattern', 3),
        S('KB upright row', 'RP!K14', 'OBSERVED', [['kettlebell']], 'same_pattern', 2),
        S('Bench incline DB ys / Bench incline DB Ts', 'RP!K21/K22', 'OBSERVED', [['dumbbell', 'weight_bench']], 'same_pattern', 4),
        S('Face pulls (cable)', "RP!K19 'Face pulls' (a cable exercise in the sheet; the v0 band version is out, EQ-01)", 'OBSERVED', [['cable']],
          'same_pattern', 3, "rear delts get their own sets (COACH-ANSWER VOL-17)"),
        S('Prone floor Y / T raises', 'bodyweight form of RP!K21/K22', 'INFERRED', [[]], 'partial', 3, 'rear/lower trap only'),
        S('Backpack or water-jug lateral raise', 'none', 'INFERRED', [['household']], 'partial', 2,
          'no true lateral/front raise exists at bodyweight: flag pattern_gap if no household load'),
    ],
    'ISO_BICEP': [
        S('Curls (any kind)', 'MM EXAMPLE UPPERLOWER SPLIT!C32', 'OBSERVED', [['dumbbell'], ['kettlebell'], ['cable'], ['ez_bar'],
                                                                                ['barbell'], ['trx']], 'same_pattern', 2,
          'the coach treats the implement as free choice for curls (bands excluded, EQ-01)'),
        S('KB curl (hammer / bottoms-up)', 'none', 'INFERRED', [['kettlebell']], 'same_pattern', 2),
        S('Chin Ups', 'U50 (VERTICAL PULL column)', 'OBSERVED-lib', [['pullup_bar']], 'partial', 1,
          'compound: biceps are a helper (0.25 set per set, COACH-ANSWER VOL-09)'),
        S('Backpack curl / towel-and-door isometric curl', 'none', 'INFERRED', [['household']], 'pattern_gap', 3),
    ],
    'ISO_TRICEP': [
        S('Tricep (any kind)', 'MM EXAMPLE UPPERLOWER SPLIT!C33', 'OBSERVED', [['dumbbell'], ['kettlebell'], ['cable'], ['ez_bar'],
                                                                                 ['barbell']], 'same_pattern', 2, 'bands excluded (EQ-01)'),
        S('KB overhead tricep extension', "KB version of RP!K42 'Db overhead tricep ext (bi or uni)'", 'INFERRED', [['kettlebell']],
          'same_pattern', 2),
        S('Diamond Push ups', 'AD93 (HORIZONTAL PUSH column)', 'OBSERVED-lib', [[]], 'partial', 2),
        S('Bench dips (hands on a chair/bench)', 'none; dips are more triceps than chest (COACH-ANSWER LIB-16)', 'INFERRED', [['bench']], 'partial', 3),
        S('Bodyweight skull crusher on a table edge', 'none', 'INFERRED', [['household']], 'partial', 2),
    ],
    'ISO_CALF': [
        S('weighted calf raises', 'MM BASEBALL!J38', 'OBSERVED', [['dumbbell', 'step_low'], ['kettlebell', 'step_low']], 'same_pattern', 2),
        S('Single-leg deficit calf raise on a plate/ramp/step (bodyweight or DB)',
          "COACH-ANSWER VOL-17: 'single-leg resistance, like on a ramp or on a plate or something like deficit calves'; bodyweight form of AU9",
          'COACH-ANSWER', [['step_low']], 'same_pattern', 2, '3 sets every leg day (VOL-17)'),
        S('Seated DB calf raise (DB on the knees)', 'replaces the v0 seated band calf raise (EQ-01); seated (bent-knee) version', 'INFERRED',
          [['dumbbell', 'bench']], 'same_pattern', 4),
        S('Ankle Hops (as a calf accessory)', "G15; BASEBALL puts ankle hops in the 'calfs' slot ('DB ankle hops', 'DB heavy ankle hops' MM BASEBALL!E56, 'High ankle hops')", 'OBSERVED', [[]],
          'zone_shift', 1, 'athletic contacts do not count as calf sets (COACH-ANSWER VOL-10)'),
    ],
    'ISO_QUAD': [
        S('DB leg extensions on box', 'RP!A41 (video B41); COACH-ANSWER EQ-08 (swap approved, "just no bands")', 'OBSERVED', [['dumbbell', 'box']],
          'same_pattern', 3),
        S('Sissy Squats', 'AI100 (filed under BILATERAL KNEE DOMINANT ADVANCED); COACH-ANSWER EQ-08 (swap approved)', 'OBSERVED-lib', [[]],
          'same_pattern', 1, 'high skill; door-frame assisted for non-advanced clients'),
        S('Reverse Nordic (kneeling lean-back)', "standard bodyweight knee-extension isolation; replaces v0 'banded leg extensions on bench' "
          "(RP!A40) and 'Band Spanish squat' for clients without a DB (EQ-08 'no bands')", 'INFERRED', [[]], 'same_pattern', 3,
          'scale by how far the client leans back; pain-free knees only'),
        S('Goblet squats heels elevated (quad bias)', "AZ9 'Goblet squats heels elevated' (FULL FOCUS QUADS)", 'OBSERVED-lib',
          [['dumbbell'], ['kettlebell']], 'partial', 2, 'a quad-biased compound, not isolation'),
        S('leg press or just add 2 more rounds to front squats -> add +2 sets to the preceding knee-dominant lift',
          'MM 4 TRACKS!W42:Z42', 'OBSERVED', [[]], 'rule', None, 'fallback only: COACH-ANSWER EQ-08 approves the swap first'),
    ],
    'ISO_LEG_FLEXION': [
        S('Glidder hamstring runners', "MM BASEBALL!AK36 '20 on each side - FAST ' (slot label AH36 'uhd')", 'OBSERVED', [['slider']], 'same_pattern', 3,
          "the coach programs it in the 'uhd' slot (MM BASEBALL!AH36); filed here because CAT-09 moves knee flexion out of hip dominant; EQ-08 names slider curls as the no-machine swap"),
        S('Swiss ball leg curls', "MM BASEBALL!AS36 (slot label AP36 'uhd')", 'OBSERVED', [['stability_ball']], 'same_pattern', 2,
          "the coach programs it in the 'uhd' slot (MM BASEBALL!AP36); filed here per CAT-09; EQ-08 names swiss-ball curls"),
        S('Single-leg slider curl (towel)', "unilateral progression of 'Supine Glidder hamstring curls' AN18", 'INFERRED', [['slider']],
          'same_pattern', 3),
        S('Nordic curl, eccentric-only / hands-assisted (push off the floor at the bottom)',
          "regression of 'Nordic Curl' AN91; replaces the v0 band-assisted Nordic (EQ-01); EQ-08 names nordics as the no-machine swap", 'INFERRED',
          [['anchor_point']], 'same_pattern', 3),
        S('Add +2 sets to the session\'s hinge (hamstrings still get hip-extension volume)',
          "by analogy with 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42)", 'INFERRED', [[]], 'rule', None,
          'keeps hamstring volume but not knee flexion: CAT-09 makes knee flexion a separate segment, so prefer any same_pattern option first'),
    ],
    'AP_THROW': [
        # COACH-ANSWER EQ-07 order: plyo push-ups (pressing), fast cable rotations, the no-ball 'fake medball slam'; 'Band chops are, to me, worthless'
        S('Plyo pushups (push throws)', 'G141; COACH-ANSWER EQ-07 (approved substitute for pressing throws)', 'OBSERVED-lib', [[]], 'zone_shift', 1,
          'upper-body reactive instead of thrown'),
        S('Fast cable rotations (Cable rotational oblique twist, powerful turns)',
          "MM BASEBALL!W30 'Cable rotational oblique twist' '12/12 powerful turns'; COACH-ANSWER EQ-07 (fast cable rotations approved, band chops rejected)",
          'OBSERVED', [['cable']], 'partial', 3, 'max intent; replaces rotational throws only (no release)'),
        S('FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE', "ALL ABOUT BALLISTICS!C46; COACH-ANSWER EQ-07: the 'fake medball slam' with no ball", 'OBSERVED', [[]],
          'zone_shift', 1, 'slam action at max speed with no ball'),
        S('Kb rotation swings no hip thrust', 'CONTROL PATTERNSCORE!B16', 'OBSERVED', [['kettlebell']], 'same_pattern', 2),
        S('Fast KB swings', 'MM BASEBALL!AI51', 'OBSERVED', [['kettlebell']], 'pattern_gap', 1, 'hinge ballistic; keeps speed-strength'),
        S('Staggered stance DB snatch', 'MM EXAMPLE ATHLETIC FULL BODY SPLI!C28', 'OBSERVED', [['dumbbell']], 'pattern_gap', 1),
        S('cross connect rolls/rocking', 'CONTROL PATTERNSCORE!B32', 'OBSERVED', [[]], 'zone_shift', 3, 'rotational control, not speed'),
        S('Buy an 8-10 lb medball (the coach\'s weight for passes and rotations; part of his ideal home kit)', 'COACH-CHAT + COACH-ANSWER EQ-02/EQ-06',
          'COACH-ANSWER', [[]], 'pattern_gap', None),
    ],
    'AP_TRIPLE_EXT': [
        # ATH-10 beginner Olympic options that are in the coach's programs are ADDITIONS (ADD-ATH10-*), not substitutes
        S('Fast KB swings', 'MM BASEBALL!AI51; KB swing AN20', 'OBSERVED', [['kettlebell']], 'same_pattern', 1),
        S('Staggered stance DB snatch', 'MM EXAMPLE ATHLETIC FULL BODY SPLI!C28', 'OBSERVED', [['dumbbell']], 'same_pattern', 1),
        S('DB Squat Jumps', 'MM BASEBALL!D33', 'OBSERVED', [['dumbbell']], 'same_pattern', 1, 'loaded jumps at 10-20% of body weight (COACH-ANSWER EQ-15)'),
        S('Squat Jumps w/ Medicine Ball', 'Sheet23!G35', 'OBSERVED', [['medball']], 'same_pattern', 1),
        S('broad jumps', 'MM BASEBALL!AW33', 'OBSERVED', [[]], 'zone_shift', 1, 'strength-speed -> starting strength / reactive'),
        S('Tuck Jumps', 'G129', 'OBSERVED-lib', [[]], 'zone_shift', 1),
    ],
    'AP_PLYO': [
        S('Line or cone hops in place of hurdle hops', 'G91-G96, G134 adapted', 'INFERRED', [['cones']], 'same_pattern', 1,
          'lower amplitude; progress by single-leg and lateral variants'),
        S('SL hops to plate', 'MM BASEBALL!EL44', 'OBSERVED', [['plate_low_target'], ['step_low']], 'same_pattern', 1),
        S('Quick feet toe tap on step', 'MM BASEBALL!DC47', 'OBSERVED', [['step_low']], 'same_pattern', 1),
        S('10 meter acceleration from pushup position', 'MM BASEBALL!CG28', 'OBSERVED', [['open_space_short']], 'same_pattern', 1,
          "short-space stand-in for 'Max velocity running (top speed)' / 'Bounding'"),
        S('Falling start accelerations', 'AEROBIC CAPACITY CHEAT SHEET!F32', 'OBSERVED', [['open_space_short']], 'same_pattern', 1),
    ],
    'AP_COD': [
        S('Shuffles / lateral bilateral ankle hops in place', 'L13, C127', 'OBSERVED-lib', [[]], 'partial', 1,
          'only when there is no 10-20 m space'),
    ],
    'COND_AEROBIC': [
        S('Any Cardio Equipment', 'MM EXAMPLE UPPERLOWER SPLIT!C13 (x15 cells); COACH-ANSWER EQ-14 (Blue/Green/Orange on any erg)', 'OBSERVED',
          [['treadmill'], ['cardio_machine_cal'], ['open_space_long']], 'same_pattern', None, 'every cardio item is modality-free'),
        S('20 sec fast/ 40 sec slow (cardio of choice)', 'MM EXAMPLE BOXING 8 WEEK BUILD UP!D7', 'OBSERVED',
          [['treadmill'], ['cardio_machine_cal'], ['open_space_long'], ['jump_rope']], 'same_pattern', None),
        S('3x 10 cal row sprint or ski', 'MM BASEBALL!AA39', 'OBSERVED', [['cardio_machine_cal']], 'same_pattern', 4),
        S("Same block on another erg, tracked by calories, time or distance",
          "COACH-ANSWER EQ-14: 'some things are easier to manage with calories or time, but you can also ... track them with distance. "
          "I wouldn't completely throw away distance'", 'COACH-ANSWER', [[]], 'rule', None,
          'keep one unit for the whole block so week-to-week changes are visible (EQ-14); 10 cal ~ 30-45 s hard (INFERRED)'),
        S('3 min Jump Rope', "MM EXAMPLE BOXING 8 WEEK BUILD UP!L12 ('DEADLIFTS (1-2RIR) + 3 min Jump Rope')", 'OBSERVED',
          [['jump_rope']], 'same_pattern', 1),
        S('Fast run/ walk back or 3 min walk/rest', 'MM BASEBALL!DI29', 'OBSERVED', [['open_space_short'], ['open_space_long']],
          'same_pattern', 1),
        S('Marching / stair intervals indoors', 'none', 'INFERRED', [['step_low']], 'partial', 1),
    ],
    'CORE_ANY': [
        S('windshield wipers', 'CONTROL PATTERNSCORE!B20', 'OBSERVED', [[]], 'same_pattern', 3,
          "stand-in for 'Hanging rotational knees to chest' (O209)"),
        S('Hip turns', 'CONTROL PATTERNSCORE!B18', 'OBSERVED', [[]], 'same_pattern', 3),
        S('floor windshield whipers', "MM BASEBALL!AO30 '12/12 powerful turns'", 'OBSERVED', [[]], 'same_pattern', 3),
        S('Cable rotational oblique twist', "MM BASEBALL!W30 '12/12 powerful turns'", 'OBSERVED', [['cable']], 'same_pattern', 3),
        S('Cable anti-rotational pallof hold', 'BC (FUNCTIONAL BIOMECHANICS SYSTEM), cable route (the band route is out, EQ-01)', 'OBSERVED-lib',
          [['cable']], 'same_pattern', 3),
        S('heavy plate russian twists', 'MM BASEBALL!I48', 'OBSERVED', [['weight_plate'], ['dumbbell'], ['kettlebell'], ['medball']],
          'same_pattern', 2),
        S('Weighted leg raises medball', 'MM BASEBALL!BK30', 'OBSERVED', [['medball']], 'same_pattern', 3),
        S("Captain's-chair knee raise", 'not in the sheets (open question)', 'INFERRED', [['dip_bars']], 'same_pattern', 4),
    ],
    'RP_BKD': [
        S('Double front rack kb squat', 'RP!A18 (yellow)', 'OBSERVED', [['kettlebell']], 'same_pattern', 2),
        S('Medball hug goblet squat', 'ALL ABOUT BALLISTICS!B7', 'OBSERVED', [['medball']], 'same_pattern', 2),
        S('Plate reach forward squat', 'RP!A10 (green)', 'OBSERVED', [['weight_plate']], 'same_pattern', 2),
        S('Goblet squat slow', "MM BASEBALL!AA33 (tempo as the intensifier)", 'OBSERVED', [['dumbbell'], ['kettlebell']], 'same_pattern', 2),
        S('KB Squat cleans', 'MM BASEBALL!BC33 (used in the bkd slot)', 'OBSERVED', [['kettlebell']], 'zone_shift', 2),
        S('Single Leg Get Ups (box pistol)', "AL14; COACH-ANSWER LIB-09 ('almost like an assisted pistol or a box pistol')", 'OBSERVED-lib',
          [['box']], 'partial', 2, 'unilateral overload with bodyweight; easier than a free pistol'),
        S('Pistol Squats (load moves to one leg)', 'AL13', 'OBSERVED-lib', [[]], 'partial', 1, 'advanced bodyweight overload'),
        S('slow eccentric deficit Lunges (no weigths)', 'MM BASEBALL!EL52', 'OBSERVED', [['step_low']], 'partial', 2),
    ],
    'RP_BHD': [
        S('KB swing', 'AN20', 'OBSERVED-lib', [['kettlebell']], 'same_pattern', 1),
        S('heavy rear foot on wall db deadlift', 'MM BASEBALL!DM37', 'OBSERVED', [['dumbbell']], 'partial', 2, 'unilateral bias'),
        S('Backpack or water-jug deadlift / hip thrust', 'none', 'INFERRED', [['household']], 'partial', 2,
          'household load; load position zone 1 (hugged or hanging)'),
        S('SL glute bridges (heel on bench)', 'MM BASEBALL!AW54', 'OBSERVED', [['bench']], 'partial', 3),
        S('Bodyweight single-leg RDL with reach', 'none', 'INFERRED', [[]], 'partial', 1, 'no loaded hinge at bodyweight'),
    ],
    'RP_UKD': [
        S("Load any lunge through the LOADING list ('Contralateral Suitcase', 'Ipsilateral Suitcase', 'Duble suitcase', ... "
          "'Back racked barbell')", 'ALL ABOUT LUNGES!C22:C33; RP!C19:C36; COACH-ANSWER CAT-13 (contralateral = into the hip, ipsilateral = out of the hip)',
          'OBSERVED', [[]], 'rule', None, 'one DB, KB or medball is enough for contra/ipsilateral loading (CR-32)'),
    ],
    'RP_UHD': [
        S('staggered stance db deadlift', 'MM BASEBALL!DP54', 'OBSERVED', [['dumbbell']], 'same_pattern', 2),
        S('Rear foot on wall DB RDL', 'MM BASEBALL!D36', 'OBSERVED', [['dumbbell']], 'same_pattern', 2),
        S('Staggered-stance KB deadlift (contralateral)', "KB version of AQ12; 'Split stance ALWAYS contralateral' RP!G83", 'INFERRED',
          [['kettlebell']], 'same_pattern', 2),
        S('SL hip thurts march', 'MM BASEBALL!EH52', 'OBSERVED', [['bench']], 'same_pattern', 3),
        S('Bodyweight single-leg RDL with reach', 'none', 'INFERRED', [[]], 'partial', 1),
    ],
    'FBS_CHOP_ANTIROT': [
        S('Dead bug or crunch with a ball/pillow squeezed between the knees', "the coach's 'Hold object Adducted between knees' cue (BC9:BC47) without a "
          "line of pull; the no-cable, no-band stand-in for the chops (EQ-01)", 'INFERRED', [['household']], 'partial', 3,
          'adduction squeeze kept, rotation/line of pull lost'),
        S('dead bugs', 'CONTROL PATTERNSCORE!B29', 'OBSERVED', [[]], 'partial', 3, 'no line of pull: anti-extension stand-in'),
        S('bird dogs', 'CONTROL PATTERNSCORE!B30', 'OBSERVED', [[]], 'partial', 3),
        S('offset planks', 'CONTROL PATTERNSCORE!E11', 'OBSERVED', [[]], 'partial', 3, 'anti-rotation stand-in'),
        S('Medball chop (Med ball from hands)', 'CONTROL PATTERNSCORE!B8', 'OBSERVED', [['medball']], 'partial', 2),
    ],
    'FUNCTIONAL_CARRY': [
        S('Farmer carry (2 DB/KB) / suitcase carry (1 DB/KB) / front-rack carry', "BA 'PROPULSIVE'/'STATIONARY' x 'BILATERAL'/'UNILARTERAL' labels; COACH-ANSWER LIB-19 (build out carries)",
          'INFERRED', [['dumbbell'], ['kettlebell']], 'same_pattern', 2),
        S('Farmer-handle carry', 'COACH-ANSWER LIB-19 (implements: farmer handles, trap bar, KB, sandbag, sled)', 'COACH-ANSWER', [['farmer_handles']], 'same_pattern', 2),
        S('Trap-bar carry', 'COACH-ANSWER LIB-19', 'COACH-ANSWER', [['hex_bar']], 'same_pattern', 2),
        S('Sandbag bear-hug carry', 'COACH-ANSWER LIB-19', 'COACH-ANSWER', [['sandbag']], 'same_pattern', 2),
        S('Medball hug carry', 'none', 'INFERRED', [['medball']], 'partial', 2),
        S('Loaded backpack / water-jug carry', 'none', 'INFERRED', [['household']], 'partial', 2),
    ],
    'FUNCTIONAL_DRAG': [
        S('Sled push/drag forwards-backwards (SAGITAL) and lateral (FRONTAL)', "BB 'SAGITAL'/'FRONTAL' labels; COACH-ANSWER LIB-19 (sled)", 'INFERRED', [['sled']],
          'same_pattern', 2),
        S('Plate on a towel push', 'none', 'INFERRED', [['weight_plate', 'slider']], 'partial', 2),
    ],
}
# v0 substitutes removed in v1 (all band / chain / reverse-band routes): name -> (slot, why, what replaces it)
REMOVED_V0_SUBS = [
    ('pull ups or banded assisted pull ups', 'RP_VPULL', 'EQ-01', "foot-assisted pull-up / negatives"),
    ('Banded fast LAT PULL DOWNS Single Arm', 'RP_VPULL', 'EQ-01', "cable lat pull-over; pull-up bar (buy list)"),
    ('Max speed banded lat pull downs half kneeling ipsilateral', 'RP_VPULL', 'EQ-01', "cable lat pull-over; pull-up bar (buy list)"),
    ('Half-kneeling band lat pulldown (controlled, high anchor)', 'RP_VPULL', 'EQ-01', "DB/KB pullover (partial) + pattern_gap"),
    ('HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row (band version)', 'RP_HPULL', 'EQ-01',
     "the cable route of the same cell; Bird Dog DB/KB row; Kong row (LIB-09)"),
    ('Half-kneeling band overhead press (band under the knee)', 'RP_VPUSH', 'EQ-01', 'DB/KB half-kneeling press; pike push-up'),
    ('Seated machine/Smith shoulder press (not in the library)', 'RP_VPUSH', 'EQ-05', "now the coach-approved addition 'Seated Machine Shoulder Press' (ADD-EQ05) + a Smith substitute"),
    ('Split-stance band chest press (anchor behind)', 'RP_HPUSH', 'EQ-01', 'push-up / DB / KB press options already in the list'),
    ('Band fly', 'RP_HPUSH', 'EQ-01', 'DB flies where there are DBs; dropped otherwise'),
    ('Face pulls (band)', 'ISO_SIDE_REAR_DELT', 'EQ-01', "'Face pulls (cable)'"),
    ('Band lateral raise / band front raise (stand on the band)', 'ISO_SIDE_REAR_DELT', 'EQ-01', 'KB upright row, household-load raise'),
    ('Band pull-apart', 'ISO_SIDE_REAR_DELT', 'EQ-01', 'prone floor Y/T raises'),
    ('Band curl (stand on the band)', 'ISO_BICEP', 'EQ-01', 'KB curl; backpack curl'),
    ('overhead band tricep ext', 'ISO_TRICEP', 'EQ-01', 'KB overhead extension; diamond push-ups; bench dips'),
    ('Band pushdown (high anchor)', 'ISO_TRICEP', 'EQ-01', 'same as above'),
    ('Seated band calf raise', 'ISO_CALF', 'EQ-01', 'seated DB calf raise'),
    ('banded leg extensions on bench', 'ISO_QUAD', 'EQ-08', 'DB leg extensions on box; reverse Nordic'),
    ('Band Spanish squat (band behind the knees)', 'ISO_QUAD', 'EQ-08', 'heels-elevated goblet squat; reverse Nordic'),
    ('Banded rolling hamstring curls', 'ISO_LEG_FLEXION', 'EQ-01/EQ-08', 'slider / swiss-ball curls'),
    ('Band-assisted Nordic curl (band from a high anchor to the chest)', 'ISO_LEG_FLEXION', 'EQ-01', 'eccentric-only / hands-assisted Nordic'),
    ('Fast band chest press / band punch', 'AP_THROW', 'EQ-07', 'plyo push-ups'),
    ('Fast band rotational chop', 'AP_THROW', "EQ-07 ('Band chops are, to me, worthless')", 'fast cable rotations; fake medball slam'),
    ('BILATERAL REVERSE BANDED JUMPS', 'AP_TRIPLE_EXT', 'EQ-12', 'bodyweight jumps (tuck / broad)'),
    ('Band front squat (band under the feet)', 'RP_BKD', 'EQ-01', 'box pistol / pistol / slow deficit lunges'),
    ('reverse banded squat jumps', 'RP_BKD', 'EQ-12', 'dropped (bodyweight squat jumps sit in the plyo slot)'),
    ('Band pull-through (low anchor)', 'RP_BHD', 'EQ-01', 'KB swing; cable pull-through AN12 where there is a cable'),
    ('Band good morning / band deadlift', 'RP_BHD', 'EQ-01', 'backpack / water-jug deadlift'),
    ('Band staggered-stance RDL', 'RP_UHD', 'EQ-01', 'bodyweight single-leg RDL'),
    ('cable or band anti-rotational pallof hold', 'CORE_ANY', 'EQ-01', "'Cable anti-rotational pallof hold' (cable only)"),
    ('Band-resisted walk (partner or post) / lateral band walk', 'FUNCTIONAL_DRAG', 'EQ-01', 'sled or plate-on-towel push; otherwise skip'),
]
# coach-named options for the triple-extension slot (ATH-10: 'everyone gets Olympic lifts ... even if you're a beginner, you can do a lot of
# the dumbbell, kettlebell, snatches, hex bar jumps, and hang pulls ... beginners and beginning intermediates ... hang cleans ... without
# bumpers').  The names are the coach's own program cells (OBSERVED); the FOUNDATIONAL level comes from ATH-10.
ATH10_ADDITIONS = [
    ('ADD-ATH10-1', 'Hang cleans (high/mid hang, lowered under control - no bumpers)',
     "MM BASEBALL 'OPTIONAL PIECE' rows 'Hang cleans @ 75%' -> '@ 90%' (e.g. CM33)", [['barbell']], 2, 2, 'strength_speed', 'bilateral'),
    ('ADD-ATH10-2', 'Single Arm DB snatch from floor', 'MM BASEBALL!BG38', [['dumbbell', 'kettlebell']], 1, 3, 'strength_speed', 'unilateral'),
    ('ADD-ATH10-3', 'KB Squat cleans', 'MM BASEBALL!BC33', [['kettlebell', 'dumbbell']], 2, 2, 'strength_speed', 'bilateral'),
    ('ADD-ATH10-4', 'Hex bar squat jumps', 'MM BASEBALL!S33', [['hex_bar']], 2, 1, 'speed_strength', 'bilateral'),
]

for _id, _nm, _src, _needs, _c, _z, _fv, _lat in ATH10_ADDITIONS:
    _est, _g, _gwhy = coach_level_estimate(_nm, _z, 'moderate', '', _c)
    items.append(dict(lib='coach_addition', cell=_id, name=_nm, bucket='AP_TRIPLE_EXT', category='TRIPPLE EXTENSION (coach-named, ATH-10)',
                      sub='ATH-10 beginner Olympic option', lvl='F', lvl_library='F', level_override=None, not_in_library=True,
                      source="COACH-ANSWER ATH-10 ('everyone gets Olympic lifts'; beginners: DB/KB snatches, hex bar jumps, hang pulls, hang cleans without bumpers); OBSERVED " + _src,
                      c=_c, skill='moderate', stab='moderate', vel='fast', fv=_fv, impl='free weight', zone=_z, zone_path=None, behind_body=False,
                      zone_basis='INFERRED from name', rotation_bias=ROTATION_BIAS.get(_z), coach_rule_level=NUM_LVL[_est], guidance=_g,
                      guidance_basis=_gwhy, laterality=_lat, machine_role=None, muscle_size=None, ex_class=None,
                      axial_load=axial_load(_nm, 'barbell' if 'barbell' in str(_needs) else 'db', 'AP_TRIPLE_EXT'), needs_and_of_or=_needs, usage=1,
                      suitable_for=['beginner', 'athlete_power', 'no_gym'] if 'barbell' not in str(_needs) and 'hex' not in str(_needs) else ['beginner', 'athlete_power'],
                      excluded=None, display_name=None, coach_description=None,
                      avail={p: avail_and_of_or(_needs, PROFILES[p]['kit']) for p in PROFILES}))


def sub_applies(s, kit):
    return any(all(t in kit for t in k) for k in s['needs'])


# ---------------------------------------------------------------------------------------------
# 5. Build substitution_by_category and gap_matrix
# ---------------------------------------------------------------------------------------------
by_bucket = collections.defaultdict(list)
for it in items:
    if it['cell'] in EXCLUDED:
        continue  # v1: out-of-scope cells (bands / variable resistance / 'ignore') never enter a list, a count or a level check
    by_bucket[it['bucket']].append(it)

ALL_BUCKETS = ['AP_PLYO', 'AP_THROW', 'AP_COD', 'AP_TRIPLE_EXT', 'CORE_ANY', 'COND_AEROBIC', 'RP_BKD', 'RP_BHD', 'RP_UKD', 'RP_UHD',
               'RP_HPULL', 'RP_VPULL', 'RP_HPUSH', 'RP_VPUSH', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP',
               'ISO_CALF', 'FBS_CHOP_ANTIROT', 'FUNCTIONAL_CARRY', 'FUNCTIONAL_DRAG'] + ['FOCUS_' + s.replace('/', '_') for s in
                                                                                           FOCUS_SUB2BUCKET]


def dedupe(lst):
    seen = {}
    for it in lst:
        k = re.sub(r'\s+', ' ', it['name'].lower())
        k = LIB17_MERGE.get(k.strip(), k)  # [v1 adversarial check] COACH-ANSWER LIB-17: merge the near-duplicates
        if k not in seen:
            seen[k] = dict(it, levels=[it['lvl']], cells=[it['cell']])
        else:
            seen[k]['levels'].append(it['lvl']); seen[k]['cells'].append(it['cell'])
            seen[k]['usage'] = max(seen[k]['usage'], it['usage'])
            if LVL_RANK[it['lvl']] < LVL_RANK[seen[k]['lvl']]:
                seen[k]['lvl'] = it['lvl']
    return list(seen.values())


NOT_COUNTED = {'U20'}  # 'KB Face Pulls ' is listed but does not count as a vertical pull (misfiled)
# v1: the hack squat is no longer demoted (COACH-ANSWER EQ-11: machines are not ranked); only filing problems are demoted
DEMOTE = {'AI20': 2, 'AI55': 2, 'AI101': 2, 'U20': 3}
BILATERAL_BUCKETS = {'RP_BKD', 'RP_BHD'}
UNILATERAL_BUCKETS = {'RP_UKD', 'RP_UHD'}


def sort_key(it):
    """Default (progression) order of a slot's options for one access profile:
    1. operative level F -> I/any -> A (CAT-05: levels ADD options, so a client sees every level up to his own);
    2. demoted items last within a level (leg-extension copies filed in a compound column; the misfiled 'KB Face Pulls ');
       v1: no machine is promoted or demoted for the coach's sheet opinions (COACH-ANSWER EQ-11: 'I don't want to rank them');
    3. easiest first by the coach's own rule (CAT-04 estimate), then most reference points first (constraint high -> low),
       i.e. Davidson's remove-one-reference progression;
    4. coach usage count, then library row order; coach-approved additions follow the library items of their level in athletic slots.
    client_rules re-rank this list by the client's target constraint band (athletes low, older/injured/volume high) and the
    client's own preference (EQ-10)."""
    love = LOVE_RANK.get(it['cell'], 2)
    col, rown = row_of(it['cell'])
    if it['lib'] == 'coach_addition' and it['bucket'] in ('AP_PLYO', 'AP_THROW', 'AP_COD', 'AP_TRIPLE_EXT', 'CORE_ANY', 'COND_AEROBIC'):
        return (LVL_RANK[it['lvl']], 0, 2, 1, 0, 0, 'ZZ', int(it['cell'].split('-')[-1]))
    if it['lib'] == 'athletic_core':
        # athletic/core/cardio columns: keep the coach's own row order inside a level (they are written as progressions,
        # e.g. 'Low Depth Drop' G9 -> 'Medium Depth Drop' G11 -> ... -> 'Ankle Hops ' G15)
        return (LVL_RANK[it['lvl']], 0, 2, 0, 0, 0, col, rown)
    return (LVL_RANK[it['lvl']], DEMOTE.get(it['cell'], 0), love, LVL_NUM.get(it.get('coach_rule_level'), 1), -(it['c'] or 0),
            -it['usage'], col, rown)


def item_out(it, bucket):
    o = dict(name=it['name'], cell=it['cell'], lvl=it['lvl'], c=it['c'], skill=it['skill'], vel=it['vel'], fv=it['fv'],
             zone=it['zone'], laterality=it['laterality'], src='library' if it['lib'] != 'coach_addition' else 'coach_addition')
    if it.get('display_name'):
        o['display_name'] = it['display_name']
    if it['lib'] == 'coach_addition':
        o['not_in_library'] = True
        o['source'] = it['source']
    if it.get('axial_load'):
        o['axial_load'] = it['axial_load']
    if it.get('coach_description'):
        o['coach_description'] = it['coach_description']
    if it.get('zone_path'):
        o['zone_path'] = it['zone_path']
    if it.get('behind_body'):
        o['behind_body'] = True
    if it['lvl_library'] != it['lvl']:
        o['lvl_library'] = it['lvl_library']
    if it.get('machine_role'):
        o['machine_role'] = it['machine_role']
    if len(it.get('cells', [])) > 1:
        o['also_cells'] = it['cells'][1:]
        o['levels'] = sorted(set(it['levels']), key=lambda x: LVL_RANK[x])
    if it['cell'] in PREF:
        o['coach_pref'] = PREF[it['cell']][0]
    if it['cell'] in ITEM_FLAGS:
        o['flag'] = ITEM_FLAGS[it['cell']]
    if bucket in BILATERAL_BUCKETS and it['laterality'] == 'unilateral':
        o['laterality_shift'] = 'bilateral slot filled with a unilateral exercise: count its sets as UNILATERAL volume'
    if it['bucket'] == 'AP_TRIPLE_EXT' and it['sub'] == 'JUMPING ANKLE':
        o['sub'] = 'JUMPING ANKLE (reactive; bodyweight track of the TE dropdown)'
    return o


substitution_by_category, gap_matrix = {}, {}
for b in ALL_BUCKETS:
    lib = dedupe(by_bucket.get(b, []))
    _lv = {it['lvl'] for it in by_bucket.get(b, []) if it['lib'] != 'coach_addition'}
    levels_present = sorted(_lv - ({'any'} if len(_lv) > 1 else set()), key=lambda x: LVL_RANK[x])
    subs = SUBS.get(b, [])
    if b.startswith('FOCUS_'):
        subs = [s for fb in SLOT_META[b]['fallback_buckets'] for s in SUBS.get(fb, [])]
    substitution_by_category[b] = {}
    gap_matrix[b] = {}
    for p in PROFILE_ORDER:
        kit = PROFILES[p]['kit']
        av = sorted([it for it in lib if it['avail'][p]], key=sort_key)
        cnt_lvl = collections.Counter()
        for it in by_bucket.get(b, []):
            if it['avail'][p] and it['cell'] not in NOT_COUNTED:
                cnt_lvl[it['lvl']] += 1
        missing = [l for l in levels_present if cnt_lvl.get(l, 0) == 0 and l != 'any']
        n = len([it for it in av if it['cell'] not in NOT_COUNTED])
        appl = [s for s in subs if sub_applies(s, kit)]
        need_subs = (n == 0) or (n < 3) or bool(missing)
        # [verify 2026-10-08] misfiled library items (NOT_COUNTED, e.g. 'KB Face Pulls ' U20 = a horizontal pull / rear-delt
        # exercise filed under VERTICAL PULL) go AFTER the substitutes, so a generator that takes the first option never gets a
        # different movement pattern (before the fix it was option 1 of KB_ONLY RP_VPULL).
        out = [item_out(it, b) for it in av if it['cell'] not in NOT_COUNTED]
        _seen_names = {re.sub(r'\s+', ' ', o['name'].lower()).strip() for o in out}
        if need_subs:
            for s in appl:
                # [verify 2026-10-08] skip a substitute that repeats an option already in the list (e.g. 'KB swing' AN20 is both
                # a library item and a curated RP_BHD substitute; FOCUS lists merge two fallback buckets that share substitutes)
                _k = re.sub(r'\s+', ' ', s['name'].lower()).strip()
                if _k in _seen_names:
                    continue
                _seen_names.add(_k)
                o = dict(name=s['name'], src=s['src'], basis=s['basis'], substitute=True, flag=s['flag'], c=s['c'],
                         laterality=s['laterality'])
                if s['note']:
                    o['note'] = s['note']
                if b in BILATERAL_BUCKETS and s['laterality'] == 'unilateral':
                    o['laterality_shift'] = 'bilateral slot filled with a unilateral substitute: count its sets as UNILATERAL volume (coach: the bilateral/unilateral volume relationship is very important)'
                out.append(o)
        out += [dict(item_out(it, b), misfiled_not_this_pattern=True) for it in av if it['cell'] in NOT_COUNTED]
        if n == 0:
            real = [s for s in appl if s['flag'] in ('same_pattern', 'partial', 'zone_shift')]
            status = 'substitute_only' if real else ('gap' if subs or b.startswith('FUNCTIONAL') else 'gap')
            if b == 'RP_UKD':
                status = 'gap'
        elif missing:
            status = 'level_gap'
        elif n == len([it for it in lib if it['cell'] not in NOT_COUNTED]):
            status = 'full'
        elif n < 3:
            status = 'thin'
        else:
            status = 'full'
        gap_matrix[b][p] = dict(status=status, as_written=n, by_level={k: cnt_lvl[k] for k in sorted(cnt_lvl, key=lambda x: LVL_RANK[x])},
                                missing_levels=missing,
                                best_substitute_flag=(min([s['flag'] for s in appl],
                                                          key=['same_pattern', 'partial', 'zone_shift', 'rule', 'pattern_gap'].index)
                                                      if (n == 0 and appl) else None))
        substitution_by_category[b][p] = out

# ---------------------------------------------------------------------------------------------
# 6. Intake value of each add-on (marginal unlock vs a base profile)
# ---------------------------------------------------------------------------------------------
def coverage(kit):
    """per bucket: (as-written count, quality) where quality 3 = as written, 2 = same-pattern substitute,
    1 = partial/zone-shift substitute, 0 = nothing or only pattern-gap/rule."""
    cov = {}
    for b in ALL_BUCKETS:
        lib = dedupe(by_bucket.get(b, []))
        n = 0
        for it in lib:
            if it['cell'] in NOT_COUNTED:
                continue
            if 'needs_and_of_or' in it:  # resistance library items and coach-approved additions
                ok = avail_and_of_or(it['needs_and_of_or'], kit)
            else:
                ok = avail_or_of_and(it['needs_or_of_and'], kit)
            n += ok
        subs = SUBS.get(b, []) if not b.startswith('FOCUS_') else [s for fb in SLOT_META[b]['fallback_buckets'] for s in SUBS.get(fb, [])]
        flags = {s['flag'] for s in subs if sub_applies(s, kit)}
        q = 3 if n else (2 if 'same_pattern' in flags else (1 if flags & {'partial', 'zone_shift'} else 0))
        cov[b] = (n, q)
    return cov


main_buckets = [b for b in ALL_BUCKETS if not b.startswith('FOCUS_') and not b.startswith('FUNCTIONAL') and b != 'FBS_CHOP_ANTIROT']
# Candidate add-ons are restricted to what a client in that setting can realistically get (no cable stack for a hotel room).
# v1: no bands or chains among the candidates (COACH-ANSWER EQ-01/EQ-12); belt squat and farmer handles added (EQ-11, LIB-19)
HOME_CANDS = ['dumbbell', 'pullup_bar', 'kettlebell', 'medball', 'weight_bench', 'trx', 'stability_ball', 'jump_rope',
              'slider', 'hurdles', 'plyo_box_high', 'dip_bars', 'barbell']
GYM_CANDS = ['hex_bar', 'landmine', 'barbell_bumpers_platform', 'trx', 'machine_specialty', 'belt_squat', 'plyo_box_high', 'hurdles',
             'open_space_long', 'sled', 'farmer_handles', 'ghd', 'rings', 'sandbag']
HOME_BASES = {'BODYWEIGHT', 'FIELD_TRACK_NO_KIT', 'KB_ONLY', 'HOME_DB_BENCH', 'HOTEL_GYM', 'FIELD_TRACK_KIT', 'HOME_BARBELL'}
unlock = {}
for base in ['BODYWEIGHT', 'FIELD_TRACK_NO_KIT', 'KB_ONLY', 'HOME_DB_BENCH', 'HOTEL_GYM', 'FIELD_TRACK_KIT',
             'HOME_BARBELL', 'BASIC_GYM', 'FULL_GYM']:
    kit0 = PROFILES[base]['kit']
    c0 = coverage(kit0)
    pool = HOME_CANDS if base in HOME_BASES else GYM_CANDS
    cands = [t for t in dict.fromkeys(PROFILES[base]['ask'] + pool)
             if not (base in HOME_BASES and t in ('cable', 'cable_attachments', 'machine_selectorized', 'smith'))]
    rows = []
    for t in cands:
        if t in kit0 or t in EXCLUDED_TOKENS:
            continue
        add = {t}
        if t == 'barbell':
            add |= {'rack', 'weight_plate', 'plate_low_target'}
        c1 = coverage(kit0 | add)
        gained = sum(c1[b][0] - c0[b][0] for b in ALL_BUCKETS)
        filled = [b for b in main_buckets if c0[b][0] == 0 and c1[b][0] > 0]
        improved = [b for b in main_buckets if c1[b][1] > c0[b][1]]
        rows.append(dict(add=sorted(add), new_as_written_options=gained, empty_slots_filled_as_written=filled,
                         slots_improved_incl_substitutes=improved,
                         quality_gain=sum(c1[b][1] - c0[b][1] for b in main_buckets)))
    rows.sort(key=lambda r: (-r['quality_gain'], -len(r['empty_slots_filled_as_written']), -r['new_as_written_options']))
    unlock[base] = rows

# ---------------------------------------------------------------------------------------------
# 7. Library statistics per implement class (for the implements table)
# ---------------------------------------------------------------------------------------------
impl_stats = collections.defaultdict(lambda: dict(n=0, c=[], high_skill=0, high_stab=0))
for r in RES:
    if r.get('record_type') != 'exercise' or not r.get('is_primary') or r['category'] == 'CORE PELVIS':
        continue
    s = impl_stats['res:' + r['implement_class']]
    s['n'] += 1; s['c'].append(r['constraint_level']); s['high_skill'] += r['skill_demand'] == 'high'
    s['high_stab'] += r['stability_demand'] == 'high'
for r in ATH:
    if not r.get('is_primary'):
        continue
    for imp in r.get('implements') or []:
        s = impl_stats['ath:' + imp]
        s['n'] += 1; s['c'].append(r['constraint_level']); s['high_skill'] += r.get('skill_demand') == 'high'
        s['high_stab'] += r.get('stability_demand') == 'high'
impl_stats_out = {k: dict(n=v['n'], mean_constraint=round(statistics.mean(v['c']), 2), min_c=min(v['c']), max_c=max(v['c']),
                          pct_high_skill=round(100 * v['high_skill'] / v['n']), pct_high_stability=round(100 * v['high_stab'] / v['n']))
                  for k, v in impl_stats.items()}

# MM population stats on the canonical scale (crosswalk measured on 410 name-matched items)
XW = {1: 1.27, 2: 1.95, 3: 2.19, 4: 3.19, 5: 5.0}
pop_stats = {}
for popname in ['gen_pop', 'strength_powerlifting', 'athlete', 'athlete_hybrid', 'boxing', 'crossfit']:
    its = [it for s in MM['sessions'] if s['population'] == popname for it in s['items'] if it.get('constraint_level') is not None]
    pop_stats[popname] = dict(items=len(its), mean_constraint_MM_scale=round(statistics.mean(i['constraint_level'] for i in its), 2),
                              mean_constraint_canonical=round(statistics.mean(XW[i['constraint_level']] for i in its), 2),
                              pct_constraint_4_5_MM=round(100 * sum(i['constraint_level'] >= 4 for i in its) / len(its)),
                              pct_fast_or_ballistic=round(100 * sum((i.get('velocity_intent') or 0) >= 4 for i in its) / len(its)),
                              pct_medball=round(100 * sum(i.get('primary_implement') == 'medball' for i in its) / len(its), 1))

# Coach-written alternates (equipment swaps) straight from the MM decode
coach_alternates = [dict(text=a['text_verbatim'], kind=a['kind'], options=a['options'], implements=a['option_primary_implements'],
                         cells=['MM ' + c for c in a['cells']], n=a['n_occurrences']) for a in MM['alternates']]

# Zone mix by implement class (resistance library; INFERRED tags): which zones each implement can reach
impl_zone = collections.defaultdict(collections.Counter)
for it in items:
    if it['lib'] == 'resistance':
        impl_zone[it['impl']][str(it['zone']) + ('b' if it['behind_body'] else '')] += 1
impl_zone = {k: dict(v) for k, v in impl_zone.items()}

json.dump(dict(items=items, substitution_by_category=substitution_by_category, gap_matrix=gap_matrix, unlock=unlock,
               impl_stats=impl_stats_out, pop_stats=pop_stats, xcheck={'|'.join(k): v for k, v in xcheck.items()},
               xcheck_diff=xcheck_diff, excluded=EXCLUDED, removed_v0_subs=REMOVED_V0_SUBS,
               coach_alternates=coach_alternates, level_test=level_test, zone_by_level=zone_by_level, impl_zone=impl_zone),
          open(os.path.join(os.path.dirname(__file__), '_computed.json'), 'w'), indent=1, ensure_ascii=False)
print('computed OK', len(items), 'items')
