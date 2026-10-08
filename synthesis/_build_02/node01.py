# -*- coding: utf-8 -*-
"""INFERRED crosswalk from catalog pattern codes to the node ids of synthesis/01_taxonomy.json (parallel deliverable)."""
import re

def _cellrow(rec, col):
    for a in rec.get('aliases', []):
        if a.get('role') == 'byop_master_stack' and re.match(col + r'\d+$', a['cell'] or ''):
            return int(re.sub(r'\D', '', a['cell']))
    return None

def node_for(rec):
    t = rec['taxonomy']
    pat = t.get('pattern_code')
    n = rec['name'].lower()
    rt = rec['record_type']
    if rt == 'modifier':
        return None
    if pat == 'TX':
        if 'calf raise' in n or 'high-knee reach' in n:
            return 'AP.TEX.DRILL'
        if 'pull' in n and 'high pull' not in n:
            return 'AP.TEX.PULL'
        if 'jerk' in n and 'clean' not in n:
            return 'AP.TEX.JERK'
        if 'squat clean' in n or 'squat snatch' in n or 'clean & jerk (full)' in n or 'overhead squat' in n or 'overhead box squat' in n:
            return 'AP.TEX.SQ'
        if 'power' in n:
            return 'AP.TEX.PWR'
        return 'AP.TEX'
    if pat == 'ANKLE':
        return 'AP.JMP.LK'
    if pat == 'PLYO':
        if 'push-up' in n or 'push up' in n or 'pushup' in n:
            return 'AP.UBP'
        if 'max-velocity' in n:
            return 'AP.SPD.MAXV'
        r = _cellrow(rec, 'G')
        if r:
            if r == 15 or 46 <= r <= 57:
                return 'AP.JMP.LK'
            if r <= 15 or 91 <= r <= 96:
                return 'AP.JMP.PLY'
            return 'AP.JMP.FULL'
        if re.search(r'plate|ankle|pogo|hop on', n):
            return 'AP.JMP.LK'
        if re.search(r'depth drop|stick the landing|box jump|hurdle|jump on to|snap down', n):
            return 'AP.JMP.PLY'
        return 'AP.JMP.FULL'
    if pat == 'THROW':
        if 'half-kneeling rotational scoop' in n or 'in/out-of-hip' in n:
            return 'AP.THR.HIP'
        if rec['status'] in ('reference_only', 'program_only') and 'cheat-sheet' not in n:
            return 'AP.THR.SPEC'
        if 'sit-up' in n or 'back-to-wall' in n:
            return 'AP.THR.TRUNK'
        if 'squat to' in n or 'step-forward' in n:
            return 'AP.THR.INT'
        if 'rotational' in n:
            return 'AP.THR.ROT'
        if 'chest pass' in n or 'overhead throw' in n:
            return 'AP.THR.BS'
        return 'AP.THR'
    if pat == 'COD':
        return 'AP.COD'
    if pat == 'SPRINT':
        if re.search(r'a-march|a-skip|a-runs|mach|high-knee', n):
            return 'AP.SPD.MECH'
        if 'acceleration' in n or 'tantrum' in n:
            return 'AP.SPD.ACC'
        if 'max-velocity' in n:
            return 'AP.SPD.MAXV'
        return 'AP.SPD'
    if pat == 'WARMUP' or pat == 'ARMCARE':
        return 'X.PREP'
    if pat == 'BKD':
        return 'RP.KD.BS'
    if pat == 'UKD':
        return 'RP.KD.UL'
    if pat == 'KEXT':
        return 'RP.KD.ISO'
    if pat == 'BHD':
        if re.search(r'leg curl|hamstring curl|nordic', n):
            return 'RP.HD.ISO'
        return 'RP.HD.BS'
    if pat == 'UHD':
        return 'RP.HD.UL'
    if pat == 'KFLEX':
        return 'RP.HD.ISO'
    if pat == 'VPUSH':
        return 'RP.PU.V.UL' if rec.get('laterality') in ('unilateral', 'alternating') else 'RP.PU.V.BS'
    if pat == 'MRPUSH':
        return 'RP.PU.M'
    if pat == 'HPUSH':
        if re.search(r'\bfly\b|flies|pec deck', n):
            return 'RP.PU.H.ISO'
        if 'incline' in n and 'push-up' not in n:
            return 'RP.PU.M'
        return 'RP.PU.H.UL' if rec.get('laterality') in ('unilateral', 'alternating') else 'RP.PU.H.BS'
    if pat == 'VPULL':
        if 'pullover' in n or 'pull-under' in n:
            return 'RP.PL.V.ISO'
        return 'RP.PL.V.UL' if rec.get('laterality') in ('unilateral', 'alternating') else 'RP.PL.V.BS'
    if pat == 'HPULL':
        return 'RP.PL.H.UL' if rec.get('laterality') in ('unilateral', 'alternating') else 'RP.PL.H.BS'
    if pat == 'SHLD':
        if 'upright row' in n:
            return 'RP.SM.TRAP'
        if re.search(r'reverse fly|face pull|rear-delt|t-raise|y-raise', n):
            return 'RP.SM.DELT.REAR'
        if 'front raise' in n:
            return 'RP.SM.DELT.FRONT'
        return 'RP.SM.DELT.SIDE'
    if pat == 'BIC':
        return 'RP.SM.BI'
    if pat == 'TRI':
        return 'RP.SM.TRI'
    if pat == 'CALF':
        return 'RP.SM.CALF'
    if pat == 'CT':
        return 'CO.CT'
    if pat == 'CP':
        return 'CO.CP'
    if pat == 'CB':
        return 'CO.CB'
    if pat == 'CORE':
        return 'CO'
    if pat == 'POS':
        return 'FN.POS'
    if pat == 'LSS':
        return 'FN.LSS'
    if pat == 'AOS':
        if rt == 'taxonomy_placeholder':
            if 'posterior' in n:
                return 'FN.POS'
            if 'lateral subsystem' in n:
                return 'FN.LSS'
            if 'crunches' in n:
                return 'FN.AOS.CRUNCH'
            return 'FN.AOS'
        if 'chop' in n:
            return 'FN.AOS.CHOP'
        if 'pallof' in n:
            return 'FN.AOS.AROT'
        if 'plank' in n:
            return 'FN.AOS.PLANK'
        return 'FN.AOS'
    if pat == 'CARRY':
        return 'FN.CARRY'
    if pat == 'DRAG':
        return 'FN.DRAG'
    if pat == 'CARDIO':
        if rt == 'test':
            return 'X.TEST'
        if n.startswith('aerobic a'):
            return 'CA.A'
        if n.startswith('aerobic b'):
            return 'CA.B'
        if n.startswith('aerobic c') or 'steady-state' in n:
            return 'CA.C'
        if n.startswith('lactate'):
            return 'CA.LC'
        if re.search(r'calorie sprint|buy-out', n):
            return 'CA.BUY'
        if re.search(r'jumping jacks|burpees', n):
            return 'CA.CIRC'
        return 'CA'
    return None

FACET_FOR_VAR = {'rom': 'F.ROM', 'end_range_behaviour': 'F.END', 'accommodating_or_special_loading': 'F.ACCOM', 'load_position': 'F.LOADPOS',
                 'load_laterality': 'F.LOADLAT', 'hand_placement': 'F.GRIP', 'feet_position': 'F.BODYPOS', 'stance': 'F.STANCE',
                 'load_laterality x load_position': 'F.LOADLAT + F.LOADPOS'}

LEVEL01 = {'foundational': 'L1', 'intermediate': 'L2', 'advanced': 'L3', 'any': 'L0'}
