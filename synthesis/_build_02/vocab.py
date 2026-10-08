# -*- coding: utf-8 -*-
"""Controlled vocabularies: pattern codes, muscles, equipment tiers (definitions are INFERRED unless noted)."""
import re

# pattern code -> taxonomy defaults. slot/col = the BYOP program slot + MASTER EXERCISE LIBRARY column that serves this pattern (OBSERVED wiring)
PAT = {
 'BKD':   dict(family='RESISTANCE', region='LOWER', category='bilateral_knee_dominant', label='BILATERAL KNEE DOMINANT', slot='Quads / Bilateral KD', col='AI', primary=['quads', 'glutes'], secondary=['adductors', 'lower_back', 'abs'], ex_class='compound', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'UKD':   dict(family='RESISTANCE', region='LOWER', category='unilateral_knee_dominant', label='UNILATERAL KNEE DOMINANT', slot='Quads/Glutes / Unilateral KD', col='AL', primary=['quads', 'glutes'], secondary=['adductors', 'glute_med', 'abs'], ex_class='compound', lat='unilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps per side'),
 'KEXT':  dict(family='RESISTANCE', region='LOWER', category='knee_extension_isolation', label='LEG EXTENSIONS', slot='Quads / Leg Extensions', col='AM', primary=['quads'], secondary=[], ex_class='isolation', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'BHD':   dict(family='RESISTANCE', region='LOWER', category='bilateral_hip_dominant', label='BILATERAL HIP DOMINANT', slot='Hamstring / Bilateral HD', col='AN', primary=['hamstrings', 'glutes'], secondary=['lower_back', 'adductors', 'forearms_grip'], ex_class='compound', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'UHD':   dict(family='RESISTANCE', region='LOWER', category='unilateral_hip_dominant', label='UNILATERAL HIP DOMINANT', slot='Hamstring/Glutes / Unilateral HD', col='AQ', primary=['hamstrings', 'glutes'], secondary=['glute_med', 'adductors', 'lower_back'], ex_class='compound', lat='unilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps per side'),
 'KFLEX': dict(family='RESISTANCE', region='LOWER', category='knee_flexion_isolation', label='LEG CURLS', slot='Hamstrings / Leg Curls', col='AR', primary=['hamstrings'], secondary=['calves'], ex_class='isolation', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'HPULL': dict(family='RESISTANCE', region='UPPER', category='horizontal_pull', label='HORIZONTAL PULL', slot='Back / Horizontal Pull', col='X', primary=['upper_back', 'lats'], secondary=['rear_delts', 'biceps', 'forearms_grip'], ex_class='compound', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'VPULL': dict(family='RESISTANCE', region='UPPER', category='vertical_pull', label='VERTICAL PULL', slot='Back / Vertical Pull', col='U', primary=['lats'], secondary=['upper_back', 'biceps', 'forearms_grip'], ex_class='compound', lat='bilateral', plane='frontal', vc='hypertrophy_sets', unit='reps'),
 'HPUSH': dict(family='RESISTANCE', region='UPPER', category='horizontal_push', label='HORIZONTAL PUSH', slot='Chest / Horizontal Push', col='AD', primary=['chest', 'front_delts', 'triceps'], secondary=['serratus'], ex_class='compound', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'MRPUSH':dict(family='RESISTANCE', region='UPPER', category='mid_range_push', label='MID RANGE PUSH', slot='Chest / Incline', col='AD', primary=['chest', 'front_delts'], secondary=['triceps', 'side_delts'], ex_class='compound', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'VPUSH': dict(family='RESISTANCE', region='UPPER', category='vertical_push', label='VERTICAL PUSH', slot='Chest/Shoulders / Vertical Push', col='AA', primary=['front_delts', 'side_delts', 'triceps'], secondary=['upper_back', 'abs'], ex_class='compound', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'SHLD':  dict(family='RESISTANCE', region='UPPER', category='shoulder_isolation', label='SIDE RAISES', slot='Shoulders/Traps / ABdution', col='AH', primary=['side_delts'], secondary=['traps'], ex_class='isolation', lat='bilateral', plane='frontal', vc='hypertrophy_sets', unit='reps'),
 'BIC':   dict(family='RESISTANCE', region='UPPER', category='biceps', label='BICEP', slot='Bicep / Bicep', col='AS', primary=['biceps'], secondary=['forearms_grip'], ex_class='isolation', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'TRI':   dict(family='RESISTANCE', region='UPPER', category='triceps', label='TRICEP', slot='Tricep', col='AT', primary=['triceps'], secondary=[], ex_class='isolation', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'CALF':  dict(family='RESISTANCE', region='LOWER', category='calves', label='CALVES', slot='Calves', col='AU', primary=['calves'], secondary=[], ex_class='isolation', lat='bilateral', plane='sagittal', vc='hypertrophy_sets', unit='reps'),
 'CT':    dict(family='CONTROL', region='CORE', category='core_thorax', label='CORE THORAX', slot='Core', col='O', primary=['abs', 'obliques'], secondary=[], ex_class='control', lat='bilateral', plane='sagittal', vc='control_sets', unit='reps or seconds'),
 'CP':    dict(family='CONTROL', region='CORE', category='core_pelvis', label='CORE PELVIS', slot='Core', col='O', primary=['abs', 'hip_flexors'], secondary=['obliques'], ex_class='control', lat='bilateral', plane='sagittal', vc='control_sets', unit='reps or seconds'),
 'CB':    dict(family='CONTROL', region='CORE', category='core_both', label="CORE (THORAX + PELVIS 'BOTH')", slot='Core', col='O', primary=['abs', 'obliques'], secondary=['glutes'], ex_class='control', lat='bilateral', plane='sagittal', vc='control_sets', unit='reps or seconds'),
 'CORE':  dict(family='CONTROL', region='CORE', category='core', label='CORE', slot='Core', col='O', primary=['abs', 'obliques'], secondary=[], ex_class='control', lat='bilateral', plane='multi', vc='control_sets', unit='reps or seconds'),
 'PLYO':  dict(family='ATHLETIC', region='ATHLETIC', category='plyometrics', label='PLYOS', slot='Plyo', col='G', primary=['quads', 'glutes', 'calves'], secondary=['hamstrings'], ex_class='athletic', lat='bilateral', plane='sagittal', vc='contacts', unit='contacts'),
 'ANKLE': dict(family='ATHLETIC', region='ATHLETIC', category='jumping_ankle', label='JUMPING ANKLE / LIMITED KNEE', slot='Tripple Extension', col='C', primary=['calves'], secondary=['quads'], ex_class='athletic', lat='bilateral', plane='sagittal', vc='contacts', unit='contacts'),
 'TX':    dict(family='ATHLETIC', region='ATHLETIC', category='triple_extension', label='TRIPLE EXTENSION', slot='Tripple Extension', col='C', primary=['glutes', 'quads', 'hamstrings', 'traps'], secondary=['calves', 'upper_back', 'front_delts'], ex_class='athletic', lat='bilateral', plane='sagittal', vc='power_reps', unit='reps'),
 'THROW': dict(family='ATHLETIC', region='ATHLETIC', category='throwing', label='THROWING', slot='Throwing', col='K', primary=['obliques', 'abs'], secondary=['chest', 'lats', 'glutes'], ex_class='athletic', lat='bilateral', plane='transverse', vc='throws', unit='throws'),
 'COD':   dict(family='ATHLETIC', region='ATHLETIC', category='change_of_direction', label='CHANGE OF DIRECTION', slot='COD', col='L', primary=['quads', 'glutes', 'adductors'], secondary=['hamstrings', 'calves'], ex_class='athletic', lat='n/a', plane='frontal', vc='reps_or_distance', unit='reps'),
 'SPRINT':dict(family='ATHLETIC', region='ATHLETIC', category='speed_sprint', label='SPEED / SPRINT (SSC ladder)', slot=None, col=None, primary=['hamstrings', 'glutes', 'quads', 'calves'], secondary=['hip_flexors'], ex_class='athletic', lat='alternating', plane='sagittal', vc='reps_or_distance', unit='reps or meters'),
 'WARMUP':dict(family='ATHLETIC', region='ATHLETIC', category='medball_dynamic_warmup', label='DYNAMIC MEDBALL WARM-UP', slot=None, col=None, primary=['quads', 'glutes'], secondary=['obliques', 'lats'], ex_class='warmup', lat='unilateral', plane='multi', vc='warmup_not_counted', unit='reps per side'),
 'CARDIO':dict(family='CARDIO', region='CARDIO', category='cardio', label='CARDIO', slot='Cardio / Aerobic Capacity', col='B', primary=['cardiorespiratory'], secondary=[], ex_class='conditioning', lat='n/a', plane='sagittal', vc='conditioning_bouts', unit='time / distance / calories'),
 'AOS':   dict(family='FUNCTIONAL', region='FUNCTIONAL', category='anterior_oblique_system', label='FUNCTIONAL BIOMECHANICS SYSTEM > ANTERIOR OBLIQUE SYSTEM', slot=None, col='BC', primary=['obliques', 'adductors'], secondary=['chest', 'serratus', 'hip_flexors'], ex_class='control', lat='bilateral', plane='transverse', vc='control_sets', unit='reps or seconds'),
 'POS':   dict(family='FUNCTIONAL', region='FUNCTIONAL', category='posterior_oblique_system', label='FUNCTIONAL BIOMECHANICS SYSTEM > POSTERIOR OBLIQUE SYSTEM', slot=None, col='BD', primary=['glutes', 'lats'], secondary=['lower_back', 'obliques'], ex_class='control', lat='bilateral', plane='transverse', vc='control_sets', unit='reps or seconds'),
 'LSS':   dict(family='FUNCTIONAL', region='FUNCTIONAL', category='lateral_subsystem', label='FUNCTIONAL BIOMECHANICS SYSTEM > LATERAL SUBSYSTEM', slot=None, col='BE', primary=['glute_med', 'adductors'], secondary=['obliques'], ex_class='control', lat='unilateral', plane='frontal', vc='control_sets', unit='reps or seconds'),
 'DRAG':  dict(family='FUNCTIONAL', region='FUNCTIONAL', category='drag', label='DRAGS', slot=None, col='BB', primary=['quads', 'glutes'], secondary=['calves'], ex_class='athletic', lat='bilateral', plane='sagittal', vc='reps_or_distance', unit='distance'),
 'CARRY': dict(family='FUNCTIONAL', region='FUNCTIONAL', category='carry', label='CARRY', slot=None, col='BA', primary=['obliques', 'forearms_grip'], secondary=['traps', 'glute_med'], ex_class='control', lat='unilateral', plane='frontal', vc='control_sets', unit='distance or seconds'),
 'ARMCARE':dict(family='FUNCTIONAL', region='FUNCTIONAL', category='arm_care_mobility', label='ARM CARE / MOBILITY', slot=None, col=None, primary=['rotator_cuff'], secondary=['upper_back'], ex_class='mobility', lat='unilateral', plane='multi', vc='not_counted', unit='reps or seconds'),
}

# [verification 2026-10-08] verbatim coach label(s) behind each pattern code. 'label' above is OUR canonical spelling;
# a pattern with no coach heading of its own is marked INFERRED bucket.
PAT_VERBATIM = {
 'BKD': "'BILATERAL KNEE DOMINANT' (BYOP AI1)", 'UKD': "'UNILATERAL KNEE DOMINANT' (BYOP AL1)", 'KEXT': "'LEG EXTENSIONS' (BYOP AM1)",
 'BHD': "'BILATERAL HIP DOMNANT' (BYOP AN1); 'BILATERAL HIP DOMINANT' (Sheet25 B11)", 'UHD': "'UNILATERAL HIP DOMINANT' (BYOP AQ1)",
 'KFLEX': "'LEG CURLS' (BYOP AR1)", 'HPULL': "'HORIZONTAL PULL' (BYOP X1)", 'VPULL': "'VERTICAL PULL' (BYOP U1)",
 'HPUSH': "'HORIZONTAL PUSH' (BYOP AD1)", 'MRPUSH': "'MID RANGE PUSH' (RESISTANCE PATTERNS G6; no BYOP column)",
 'VPUSH': "'VERTICAL PUSH' (BYOP AA1)", 'SHLD': "'SIDE RAISES' (BYOP AH1); slot 'ABdution'", 'BIC': "'BICEP' (BYOP AS1)",
 'TRI': "'TRICEP' (BYOP AT1)", 'CALF': "'CALVES' (BYOP AU1)", 'CT': "'CORE THORAX' (BYOP O1)", 'CP': "'CORE PELVIS' (BYOP R1)",
 'CB': "'BOTH' (CONTROL PATTERNSCORE A29/H28/O28 = thorax + pelvis together)", 'CORE': "'CORE' (BYOP row 6 PURPOSE)",
 'PLYO': "'PLYOS' (BYOP G1)", 'ANKLE': "'JUMPING ANKLE' (BYOP F5); 'JUMPING LIMITED KNEE' (Sheet23 E1/G1)",
 'TX': "'TRIPPLE EXTENSION' (BYOP C1/C5)", 'THROW': "'THROWING' (BYOP K1)", 'COD': "'CHANGE OF DIRECTION' (BYOP L1)",
 'SPRINT': "none - INFERRED bucket (Sheet23 footers '*FASTEST SSC*' B43, '*FAST BALLISTIC/WARMUP/SSC* (prior to sprint)' B47, '*SPRINT*' B51)",
 'WARMUP': "'DYNAMIC MEDBALL WARMUP DRILLS' ((NOT DONE) ALL ABOUT BALLISTICS A4)", 'CARDIO': "'CARDIO' (BYOP B1)",
 'AOS': "'ANTERIOR OBLIQUE SYSTEM' (BYOP BC6, under 'FUNCTIONAL BIOMECHANICS SYSTEM' BC1)",
 'POS': "'POSTERIOR OBLIQUE SYSTEM' (BYOP BD6)", 'LSS': "'LATERAL SUBSYSTEM' (BYOP BE6)",
 'DRAG': "'DRAGS' (BYOP BB1) / 'DRAG' (BB6)", 'CARRY': "'CARRY' (BYOP BA1)", 'ARMCARE': 'none - INFERRED bucket (program-only arm-care drills)',
}

# coach FOCUS LIST groups (OBSERVED headers AZ8..AZ331) and the coach's big/small split (INFERRED from L4 notes)
COACH_GROUP = {
 'quads': 'QUADS', 'glutes': 'GLUTES', 'glute_med': 'GLUTES', 'hamstrings': 'HAMSTRINGS', 'adductors': None, 'hip_flexors': None,
 'calves': 'CALVES', 'lower_leg_foot': 'CALVES', 'lats': 'BACK', 'upper_back': 'BACK', 'lower_back': 'BACK', 'traps': 'SHOULDERS/TRAPS',
 'chest': 'CHEST', 'front_delts': 'SHOULDERS/TRAPS', 'side_delts': 'SHOULDERS/TRAPS', 'rear_delts': 'SHOULDERS/TRAPS', 'delts': 'SHOULDERS/TRAPS',
 'rotator_cuff': 'SHOULDERS/TRAPS', 'serratus': None, 'biceps': 'BICEP', 'forearms_grip': None, 'triceps': 'TRICEP', 'abs': 'CORE', 'obliques': 'CORE',
 'cardiorespiratory': None, 'arms': None,
}
BIG = {'QUADS', 'GLUTES', 'HAMSTRINGS', 'BACK', 'CHEST'}
SMALL = {'SHOULDERS/TRAPS', 'BICEP', 'TRICEP', 'CALVES', 'CORE'}

MUSCLE_RULES = [
 (r'cardio', 'cardiorespiratory'), (r'glute med|gluteus medius|glute medius|abductor', 'glute_med'), (r'hip adductor|adductor', 'adductors'),
 (r'quadratus lumborum|erector|lower back|spinal', 'lower_back'), (r'hamstring', 'hamstrings'), (r'glute|gluteus', 'glutes'),
 (r'quad|rectus femoris', 'quads'), (r'gastrocnemius|soleus|calf|calves', 'calves'), (r'tibialis|foot intrinsic', 'lower_leg_foot'),
 (r'hip flexor|iliopsoas', 'hip_flexors'), (r'latissimus|\blats?\b|teres major', 'lats'),
 (r'upper trap|traps\b|trapezius$|^traps|upper trapezius', 'traps'),
 (r'rhomboid|middle trap|mid trap|lower/mid|lower/middle|middle/lower|upper back', 'upper_back'),
 (r'rear delt|posterior delt|rear deltoid', 'rear_delts'), (r'lateral delt|side delt|lateral deltoid', 'side_delts'),
 (r'anterior delt|front delt|anterior deltoid', 'front_delts'), (r'rotator|supraspinatus|infraspinatus|external rotator|shoulder stabil', 'rotator_cuff'),
 (r'deltoid|delts|shoulders', 'delts'), (r'serratus', 'serratus'), (r'pector|chest|pecs', 'chest'),
 (r'brachioradialis|forearm|grip', 'forearms_grip'), (r'tricep', 'triceps'), (r'bicep|brachialis', 'biceps'),
 (r'oblique', 'obliques'), (r'rectus abdominis|transvers|\babs\b|anterior core|core|trunk', 'abs'), (r'arms \(rower', 'arms'),
]

def norm_muscle(m):
    t = str(m).lower()
    for pat, tok in MUSCLE_RULES:
        if re.search(pat, t):
            return tok
    return None

def norm_muscles(lst):
    out = []
    for m in lst or []:
        t = norm_muscle(m)
        if t and t not in out:
            out.append(t)
    return out

# ------------- equipment -------------
EQ_TOKEN = {
 # lib_athletic_core requires_any_of
 'floor': 'none', 'open_space_long': 'open_space_long', 'open_space_short': 'open_space_short', 'step_low': 'step', 'treadmill': 'cardio_treadmill',
 'barbell': 'barbell', 'medball': 'medball', 'cardio_machine_cal': 'cardio_machine', 'plate_low_target': 'plate_low_target', 'partner_or_wall': 'wall',
 'dumbbell': 'dumbbell', 'barbell_bumpers_platform': 'barbell', 'hurdles': 'hurdles', 'pullup_bar': 'pullup_bar', 'kettlebell': 'kettlebell',
 'bench': 'bench', 'cones': 'cones', 'cable': 'cable', 'band': 'band', 'hex_bar': 'hex_bar', 'slam_ball': 'medball', 'two_boxes': 'box',
 'plyo_box_high': 'box_high', 'wall': 'wall',
 # lib_resistance implement_requirement_groups
 'bodyweight': 'none', 'machine_sel': 'machine', 'bench_press': 'weight_bench', 'box': 'box', 'rack': 'squat_rack', 'machine_pl': 'machine',
 'hex': 'hex_bar', 'plate': 'plate', 'seal_bench': 'seal_bench', 'household_object': 'household_object', 'dip_bars': 'dip_station',
 'machine_pl_specialty': 'machine', 'step': 'step', 'landmine': 'landmine', 'EZ': 'ez_bar', 'TRX': 'suspension_trainer', 'dip_belt': 'dip_belt',
 'stability_ball': 'stability_ball', 'GHD': 'ghd', 'hyper_bench': 'hyper_bench', 'rings': 'suspension_trainer', 'anchor': 'anchor',
 'other_attachment': 'cable', 'smith': 'smith', 'foam_roller': 'foam_roller', 'reverse_hyper': 'reverse_hyper', 'sandbag': 'sandbag',
 'slider': 'slider', 'decline_bench': 'weight_bench',
 # NEW / decoder vocab
 'none': 'none', 'DB': 'dumbbell', 'KB': 'kettlebell', 'TRX/rings': 'suspension_trainer', 'bike/rower/ski': 'cardio_machine', 'machine': 'machine',
 'cardio_bike': 'cardio_machine', 'cardio_rower': 'cardio_machine', 'cardio_ski': 'cardio_machine', 'any_cardio_mode': 'any_cardio_mode',
 'squat_rack': 'squat_rack', 'chains': 'chains', 'jump_rope': 'jump_rope', 'machine_dip': 'machine', 'weight_bench': 'weight_bench',
}

# Access tiers (INFERRED definitions used for the NO ACCESS subset):
#  0 = bodyweight + household (floor, wall, stairs/sturdy chair or bench, open space, towel as slider, plate-sized object/line)
#  1 = minimal kit (resistance bands/mini-bands + door anchor, doorway pull-up bar, jump rope, suspension trainer, low hurdles/cones, foam roller)
#  2 = home light weights (dumbbells, kettlebells, medball/slam ball, stability ball, sandbag, weight plate, adjustable weight bench, dip station, plyo box)
#  3 = gym (barbell & rack, EZ/hex bar, landmine, cable stack, machines, Smith, GHD/hyper/reverse-hyper, seal bench, chains, cardio machines)
TIER = {
 'none': 0, 'open_space_short': 0, 'open_space_long': 0, 'wall': 0, 'step': 0, 'bench': 0, 'box': 0, 'plate_low_target': 0, 'household_object': 0,
 'slider': 0, 'anchor': 0, 'cones': 0, 'any_cardio_mode': 0,
 'band': 1, 'pullup_bar': 1, 'jump_rope': 1, 'suspension_trainer': 1, 'hurdles': 1, 'foam_roller': 1,
 'dumbbell': 2, 'kettlebell': 2, 'medball': 2, 'stability_ball': 2, 'sandbag': 2, 'plate': 2, 'weight_bench': 2, 'dip_station': 2, 'box_high': 2,
 'barbell': 3, 'squat_rack': 3, 'ez_bar': 3, 'hex_bar': 3, 'landmine': 3, 'cable': 3, 'machine': 3, 'smith': 3, 'ghd': 3, 'hyper_bench': 3,
 'reverse_hyper': 3, 'seal_bench': 3, 'dip_belt': 3, 'chains': 3, 'cardio_machine': 3, 'cardio_treadmill': 3, 'weight_releasers': 3, 'ssb': 3,
}
TIER_NAME = {0: 'T0 bodyweight + household', 1: 'T1 minimal kit (bands, doorway bar, rope)', 2: 'T2 home light weights (DB/KB/medball)', 3: 'T3 gym'}
HOUSEHOLD_NOTE = {
 'bench': 'sturdy chair / couch / bench', 'box': 'stairs / sturdy step or bench (low heights only)', 'step': 'stair step / curb',
 'plate_low_target': 'tape line, book or towel as the target', 'slider': 'towel or paper plate on a smooth floor', 'anchor': 'couch, door or partner',
 'household_object': 'pillow / ball / yoga block', 'wall': 'wall', 'open_space_long': 'road / park / track', 'open_space_short': '10-20 m of open floor or yard',
 'cones': 'any markers', 'any_cardio_mode': 'outdoor run/walk',
}

KEYWORD_EQ = [
 (r'\bsmith\b', 'smith'), (r'landmine|landline', 'landmine'), (r'hex\s*bar|trap bar', 'hex_bar'), (r'\bez\b|ez bar|ez-bar|\bz bar', 'ez_bar'),
 (r'\bssb\b', 'ssb'), (r'barbell|\bbb\b|\bclean|\bsnatch|\bjerk|back squat|front squat|high bar|low bar|good ?morning|zercher|deadlift', 'barbell'),
 (r'\bdb\b|dumbbell|dbs\b', 'dumbbell'), (r'\bkb\b|kettlebell|kbs\b', 'kettlebell'), (r'medball|med ball|medicine ball|\bmb\b', 'medball'),
 (r'cable|pulldown|pull down|pull-down|push ?down', 'cable'), (r'machine|leg press|leg extension|leg curl|hack squat|pendulum|v-squat', 'machine'),
 (r'band|banded|strap', 'band'), (r'trx|rings?\b|suspension', 'suspension_trainer'), (r'swiss|stability ball|yoga ball', 'stability_ball'),
 (r'slider|glider|glidder', 'slider'), (r'hurdle', 'hurdles'), (r'pull ?-?ups?|chin ?-?ups?|hanging|toes to bar|t2b|muscle', 'pullup_bar'),
 (r'(?<!no-)\bdips?\b', 'dip_station'), (r'\bghd\b', 'ghd'), (r'box', 'box'), (r'bench', 'bench'), (r'plate', 'plate'), (r'wall', 'wall'),
 (r'chain', 'chains'), (r'sandbag', 'sandbag'), (r'jump rope|double.?unders|dubs', 'jump_rope'), (r'\bbike\b|row(er)? sprint|\bski\b|skierg', 'cardio_machine'),
 (r'run|sprint|acceleration|shuttle|route|mile|\d+m\b', 'open_space_long'),
]
