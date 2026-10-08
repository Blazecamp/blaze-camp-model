# -*- coding: utf-8 -*-
"""Rule-based classification of one exercise line (coach text) into
implement(s), constraint level (1-5), velocity intent (1-5), sequencing tier, movement pattern.

The coach text is OBSERVED. Every derived field is INFERRED by these rules.
`implement_sources[x]` = 'explicit' (written in the name), 'coach_alternate' (offered after 'or'),
or 'inferred_default' (not written; analyst default).
"""
import re

URL = re.compile(r'\s*-?\s*https?://\S+')

def norm(name):
    s = URL.sub('', name or '').strip()
    s = re.sub(r'\s+', ' ', s)
    return s

def has(s, pat):
    return re.search(pat, s, re.I) is not None

TIER_ORDER = {'T1_POWER': 1, 'T2_POWER_STRENGTH': 2, 'T3_STRENGTH': 3, 'T4_RESISTANCE_PATTERN': 4, 'T5_ISOLATION': 5}

P_MEDBALL = (r"med ?ball|medicine ball|\bmb\b|\*medball|chest pass|overhead toss|oh toss|overhead throw|rotational toss|"
             r"scoops?\b|slams?\b|catch & release")
P_PLYO = (r"jump(?!ing jacks|ing pull| rope)|\bhops?\b|\bbounds?\b|depth drop|drop & stick|stick the landing|squirrel|skater|"
          r"snap downs?|hurdle|quick feet|toe tap")
P_SPRINT = r"acceleration|sprint|\ba march|\ba skip|\ba run|high knee run|tantrum|baseball starts|\bfast run\b"
P_UPPER_PLYO = r"plyo push|jumping push|stick the landing pushups|drop & catch|push ups/chest pass|catch & release push"
P_OLY = r"\bclean|snatch(?! grip)|jerk|high pull"
P_PUSHPRESS = r"push press|push presses|split jerk"
P_SQUAT = r"squat|sqat|sqaut|zercher|high bar|low bar|\bsqts\b"
P_HINGE = (r"deadlift|deadlfts|deaflits|dealifts|\bdl\b|\brdl|good morning|stiff leg|hyper-extension|glute bridge|"
           r"hip thru|hip thurts|camporini")
P_UNI_LOWER = (r"lunge|split sq|split stance|step ?ups?|single leg|\bsl\b|staggered|stagrd|\brfe\b|\bffe\b|\bfe contra|"
               r"bulgarian|camporini|rear foot|uni rdl|unilateral deadlift|unilateral dl|jefferson|lateral lunge|"
               r"side lunges|one leg at a time|\bipsi|\bcontra")
P_ISO = (r"curl|tricep|triceps|tríceps|kickback|kick backs|skull crusher|tate press|jm press|side raise|side rises|"
         r"(front|side)\W+(db )?(raises|rises)|front raise|lateral raise|reverse flies|\bflies\b|face pull|"
         r"upright (db )?rows?|leg ext|leg curl|hamstring curl|hamstring runner|calf raise|heel raises|nordic|pull over|"
         r"pull under|rear delt|hamstring sliders|swiss ball kicks|swiss ball leg curls")
P_CORE = (r"plank|copenhagen|oblique|crunch|sit ?ups?|situps|toes to bar|\bt2b\b|knees to chest|knee raise|knees side|"
          r"leg raises|hollow|hallow|v-ups|dead ?bugs|bear crawl|russian twist|windsh|winshield|windchield|hip turns|"
          r"mountain|mointain|flutter|chop|rotational oblique|oblique twist|plate rotations|knee tuck|carry|turkish|"
          r"hips raises|cross connect|rockers|med ball rolls|up downs|shoulder taps|shoulders taps|pull through|"
          r"shoulder roll|arm bars|book openers|\bcore\b|toe touches|slider runners")
IMPL_WORDS = r"(machine|cable|db|dbs|dumbbells?|ez bar|hex bar|kb|barbell|bodyweight|band|row machine)"

# ------------------------------------------------------------------ implements
def implements_of(s):
    L = s.lower()
    out = []
    def add(x, src='explicit'):
        if x not in [i for i, _ in out]:
            out.append((x, src))
    if has(L, r'\bhex\b'): add('hex_bar')
    if has(L, r'\bez\b|\bz bar'): add('ez_bar')
    if has(L, r'barbell|\bbb\b'): add('barbell')
    if has(L, r'\bdbs?\b|dumbbells?|dumbell|dumbel'): add('dumbbell')
    if has(L, r'\bkbs?\b|kettlebell'): add('kettlebell')
    if has(L, r'med ?ball|\bmb\b|medicine ball|\*medball') or (has(L, P_MEDBALL) and not has(L, r'\b(kb|db)\b')):
        add('medball', 'explicit' if has(L, r'med ?ball|\bmb\b|medicine') else 'inferred_default')
    if has(L, r'smith'): add('smith_machine')
    if has(L, r'machine|leg press|leg ext'):
        add('machine')
    if has(L, r'leg curl') and not has(L, r'swiss|slider|banded|rolling'): add('machine', 'inferred_default')
    if has(L, r'cable|rope tricep|rope ext|ropte|\brope\b(?! *$)') and not has(L, 'jump rope'): add('cable')
    if has(L, r'lat pull ?downs?|lat pulldown|pull ?downs?\b|lats pull down') and not has(L, r'band'):
        add('cable', 'explicit' if has(L, 'cable') else 'inferred_default')
    if has(L, r'face pull|high to low|low to high|^tricep ext\.?$|top down tricep|pull overs?\b') and not has(L, r'\bdb\b'):
        add('cable', 'inferred_default')
    if has(L, r'band|banded|ressisted'): add('band')
    if has(L, r'chain'): add('chains')
    if has(L, r'landmine'): add('landmine')
    if has(L, r'swiss ?ball|swissball'): add('swiss_ball')
    if has(L, r'slider|glider|glidder|hamstring runners|hamstring sliders'): add('slider')
    if has(L, r'plate'):
        if has(L, r'(on|to|onto|off of|from) plate|plate forward|jump on to plate|hops? to plate|on/off plate'):
            add('plate_as_target')
        else:
            add('plate')
    if has(L, r'\bbox\b|step ?ups?|on step|\(box\)|\(d\) ?box|\(t&g\) ?box|\(d\)box'): add('box_step')
    if has(L, r'hurdle'): add('hurdle')
    if has(L, r'pull ?ups?\b|pullups|\bchin|toes to bar|\bt2b\b|hanging|knees to chest'): add('pullup_bar')
    if has(L, r'\bdips?\b'): add('machine' if has(L, 'machine dips') else 'dip_station')
    if has(L, r'\bbench\b') and not has(L, r'bench press|bench dips|bb bench|incline bench|db bench|alt incline|^bench$'):
        add('bench_support')
    if has(L, r'bike'): add('bike_erg')
    if has(L, r'row sprint|row spring|\brow\b sprint'): add('rower')
    if has(L, r'\bski\b|skierg'): add('ski_erg')
    if has(L, r'cardio|cardo'): add('cardio_any')
    if has(L, r'jump rope'): add('jump_rope')
    if has(L, r'wall'): add('wall')
    if has(L, r'\(any kind\)'): add('any_implement')
    loadbearing = {'hex_bar', 'ez_bar', 'barbell', 'dumbbell', 'kettlebell', 'medball', 'smith_machine', 'machine', 'cable',
                   'landmine', 'plate', 'bike_erg', 'rower', 'ski_erg', 'cardio_any', 'any_implement'}
    names = [i for i, _ in out]
    nolo = has(L, r'bodyweight|no weight|no weigths')
    # barbell implied by accommodating resistance on a competition lift
    if ('band' in names or 'chains' in names) and has(L, r'deadlift|deadlfts|\bdl\b|squat|bench press') \
            and not any(n in names for n in ('dumbbell', 'kettlebell', 'hex_bar', 'barbell')):
        out.insert(0, ('barbell', 'inferred_default'))
        names = [i for i, _ in out]
    blocking = loadbearing | {'pullup_bar', 'dip_station', 'slider', 'swiss_ball', 'band'}
    if not any(n in blocking for n in names) and not nolo:
        plyo_like = has(L, P_PLYO + '|' + P_SPRINT + '|' + P_UPPER_PLYO)
        if plyo_like:
            if has(L, r'weight|weighted|load\b|load &'):
                add('load_unspecified', 'inferred_default')
            add('bodyweight', 'inferred_default')
        elif has(L, r'clean|snatch|jerk|good morning|jm press|snatch grip|deficit|chained|box squat|\(d\) ?box|\(t&g\) ?box|'
                    r'high bar|low bar|front squat|back squat|back sqaut|fron squats|zercher|^squats?$|heavy squat|^sqats|'
                    r'oh press|overhead press|^push press|bench press|^bench(?! glute)|incline bench|high incline|bent over rows?$|^bent over row|'
                    r'^(heavy |fast )?deadlifts?|^deaflits|^dealifts|^deadlifts? \(|^rdl|stiff leg|^heavy glute bridges$|power cleans|^def\. dl|'
                    r'^heavy power|^barbell'):
            add('barbell', 'inferred_default')
        elif has(L, r'seal rows?|side raises?|side rises|front raises|reverse flies|hammer curls|incline curls|kickback|skull|'
                    r'tate press|upright rows?|curl to press|arnold|sesaw|seesaw|camporini|\brdl|staggered stance dl|stagrd|'
                    r'staggered dl|single leg deadlift|unilateral|lunges?|split sq|step ups?|curls?$|curls \(|preacher|calf raises|'
                    r'suitcase|double rack|goblet|\brows?$|^rows|tricep extensions?$|tricep ext\.?$'):
            if has(L, r'weighted|with weight') and not has(L, r'calf|ankle|depth'):
                add('load_unspecified', 'inferred_default')
            else:
                add('dumbbell', 'inferred_default')
        elif has(L, r'weighted|with weight'):
            add('load_unspecified', 'inferred_default')
        elif has(L, P_CORE + r'|push ?ups|pushups|pull ?ups|squats|burpee|jumping jacks|nordic|bridge|hip thru|thurts|\bdips?\b'):
            add('bodyweight', 'inferred_default' if not has(L, r'pull ?ups|push ?ups|pushups|\bdips?\b|chin') else 'explicit')
    if has(L, r'nordic') and 'dumbbell' in [i for i, _ in out] and not has(L, r'\bdbs?\b|dumbbell'):
        out = [(i, sr) for i, sr in out if i != 'dumbbell']
        add('bodyweight', 'inferred_default')
    if nolo:
        add('bodyweight')
    return out

# ------------------------------------------------------------------ alternates
def split_options(s):
    """Coach-written alternates -> list of option strings (first = coach's first choice)."""
    L = s.strip()
    m = re.match(r'^(.*?)\((.+?)\s+or\s+(.+?)\)\s*$', L, re.I)       # 'Deadlifts (DB or Barbell)'
    if m:
        base = m.group(1).strip()
        return [f"{m.group(2)} {base}", f"{m.group(3)} {base}"]
    m = re.match(r'^' + IMPL_WORDS + r'\s+or\s+' + IMPL_WORDS + r'\s+(.+)$', L, re.I)   # 'machine or db flies'
    if m:
        return [f"{m.group(1)} {m.group(3)}", f"{m.group(2)} {m.group(3)}"]
    m = re.match(r'^(.*?)' + IMPL_WORDS + r'\s+(\w+)\s+or\s+' + IMPL_WORDS + r'\s*$', L, re.I)  # 'Ez bar curls or barbell'
    if m:
        return [f"{m.group(1)}{m.group(2)} {m.group(3)}", f"{m.group(1)}{m.group(4)} {m.group(3)}"]
    m = re.match(r'^(.*?)\s+or\s+' + IMPL_WORDS + r'\s*$', L, re.I)    # 'DB Reverse Flies or Machine'
    if m and not has(m.group(1), r'\bor\b'):
        head = m.group(1)
        mov = re.sub(r'^' + IMPL_WORDS + r'\s+', '', head, flags=re.I)
        return [head, f"{m.group(2)} {mov}"]
    m = re.match(r'^(hex bar|db|kb|barbell)\s+or\s+(hex bar|db|kb|barbell)\s+(.+)$', L, re.I)
    if m:
        return [f"{m.group(1)} {m.group(3)}", f"{m.group(2)} {m.group(3)}"]
    if re.search(r'\s+or\s+', L, re.I) and not re.search(r'\bor\b\s*(3 min|just add)', L, re.I):
        parts = re.split(r'\s+or\s+', L, flags=re.I)
        return [p.strip() for p in parts if p.strip()]
    if re.search(r'\s+or\s+just add', L, re.I):
        return [re.split(r'\s+or\s+', L, flags=re.I)[0], 'add 2 more rounds to front squats']
    return [L]

# ------------------------------------------------------------------ single movement
def classify_one(s, ctx):
    """Classify one movement string (no alternates, no '+' components)."""
    L = s.lower().strip()
    imps = implements_of(s)
    names = [i for i, _ in imps]
    R = lambda fam, tier, c, v, vl, up=None: {'family': fam, 'tier': tier, 'constraint_level': c, 'velocity_intent': v,
                                              'velocity_label': vl, 'upper_pattern': up, 'imps': imps}
    part = ctx.get('part') or ''
    load = (ctx.get('load_raw') or '') + ' ' + (ctx.get('reps_raw') or '')
    if L in ('accessories', 'upper accesory', 'lower accesory', 'deload', 'deload week', 'test', 'none', ''):
        return R('placeholder', 'PLACEHOLDER', None, None, None)
    if L.startswith('*medball'):
        return R('medball_list', 'T1_POWER', 1, 5, 'ballistic')
    if has(L, r'^any cardio equipment$'):
        return R('warmup_cardio', 'WARMUP', None, None, 'aerobic')
    if has(L, r'book openers'):
        return R('warmup_mobility', 'WARMUP', 4, 1, 'slow_control')
    if has(L, r'arm bars|shoulder roll'):
        return R('mobility_control', 'CORE', 4 if 'arm bars' in L else 3, 1, 'slow_control')
    # conditioning
    if part == 'Part E' or has(L, r'bike|row sprint|row spring|\bski\b|skierg|ski sprints|runner sprint|\bcal\b|calorie|sec fast run|sec run$'):
        c = 5 if 'bike' in L else 4 if has(L, r'\brow') else 3 if 'ski' in L else 1
        return R('buy_out_finisher', 'CONDITIONING', c, 5, 'sprint_finisher')
    if has(L, r'^\d+ ?x ?\d+ ?sec (sprint|fast)|sprint ?/ ?\d+ ?sec walk|sprint/ ?recover|sprint 20/|fast/ ?2 min walk|fastest/'):
        return R('sprint_intervals', 'CONDITIONING', 1, 5, 'sprint_repeat')
    if has(L, r'cardio|cardo'):
        if has(L, r'20 sec fast'):
            return R('cardio_intervals', 'CONDITIONING', None, 4, 'interval')
        return R('cardio_steady', 'CONDITIONING', None, None, 'aerobic')
    if has(L, r'jumping jacks|burpees|tabata|jump rope'):
        return R('metabolic', 'CONDITIONING', 1, 4, 'metabolic')
    if has(L, r'fast run/ walk back'):
        return R('tempo_run', 'T1_POWER', 1, 4, 'fast_submax_run')
    # Oly / loaded ballistics
    if has(L, P_PUSHPRESS):
        return R('push_press_jerk', 'T2_POWER_STRENGTH', 2, 5, 'ballistic_loaded', 'V_PUSH')
    if has(L, P_OLY):
        return R('olympic_lift', 'T2_POWER_STRENGTH', 2, 5, 'ballistic_loaded')
    if has(L, r'swing'):
        return R('kb_swing', 'T2_POWER_STRENGTH', 2, 5, 'ballistic_loaded')
    if has(L, r'(hex|\bdb\b|dumbbell|load|weight|suitcase)[^,]*jump|jump[^,]*(with weight|load)|weighted depth drops to jump'):
        return R('loaded_jump', 'T2_POWER_STRENGTH', 1, 5, 'ballistic_loaded')
    if has(L, r'(^fast |fast banded|fast barbell|fast high zercher|same speed|oscilating)') and has(L, r'squat|zercher|\bdl\b|deadl|bench|press|high bar'):
        up = 'H_PUSH' if 'bench' in L else 'V_PUSH' if 'press' in L else None
        return R('dynamic_effort', 'T2_POWER_STRENGTH', 3, 4, 'fast_concentric_loaded', up)
    if has(L, r'(banded fast|max speed banded).*lat pull'):
        return R('speed_strength_upper', 'T2_POWER_STRENGTH', 2, 4, 'fast_concentric_loaded', 'V_PULL')
    # medball
    if has(L, r'rockers|med ball rolls|leg raises medball|star supine|cross connect') and not has(L, r'hops'):
        if has(L, r'fast'):
            return R('core', 'CORE', 2, 4, 'fast_rotation')
        return R('core_medball' if 'medball' in names else 'core', 'CORE', 3, 2, 'controlled')
    if has(L, P_MEDBALL) and not has(L, r'alternating ffe reverse lunge'):
        up = 'V_PUSH' if has(L, r'^medball press') else None
        return R('medball_throw', 'T1_POWER', 1, 5, 'ballistic', up)
    if has(L, P_UPPER_PLYO):
        return R('upper_plyo', 'T1_POWER', 1, 5, 'ballistic', 'H_PUSH' if 'push' in L else None)
    if has(L, r'squat jumps|jump squats|split stance jump|lunge jumps|repeat jump squat|split stance squat jumps'):
        return R('jump_squat', 'T1_POWER', 1, 5, 'ballistic')
    if has(L, P_PLYO):
        if has(L, r'depth drop(?! to jump| & jump)|drop & stick|stick the landing|snap down'):
            return R('plyo_landing', 'T1_POWER', 1, 5, 'reactive_landing')
        return R('plyo_jump_hop', 'T1_POWER', 1, 5, 'ballistic')
    if has(L, P_SPRINT):
        if has(L, r'\ba march|\ba skip|\ba run') and not has(L, r'sprint|acceleration'):
            return R('sprint_drill', 'T1_POWER', 1, 3 if L.strip() == 'a march' else 4, 'sprint_technique_drill')
        return R('sprint_drill', 'T1_POWER', 1, 5, 'ballistic')
    # core
    if has(L, P_CORE) and not has(L, r'lunge|rdl|\bdl\b|deadlift|leg ext|db rows|raises \+|plate core & leg'):
        c = 3
        if has(L, r'crunch|sit ?ups?|situps|dead ?bugs|leg raises|hollow|hallow|v-ups|flutter|hips raises|bridge'): c = 4
        if has(L, r'toes to bar|knees to chest|knee raise|knees side|hanging|russian|windsh|winshield|windchield|mountain|'
                  r'mointain|hip turns|chop|twist|carry|turkish|up downs|taps|bear crawl|pull through|rotations|knee tuck|toe touches'):
            c = 2
        if has(L, r'cable'):
            c = 2 if has(L, 'chop|half kneeling') else 3
        if has(L, r'plank|copenhagen|oblique sit|carry|hold') and not has(L, r'up downs|taps|hip turns|pull through|mountain|raises|presses'):
            v, vl = 1, 'isometric'
        else:
            v, vl = 2, 'controlled'
        if has(L + load, r'powerful|fast'): v, vl = 4, 'fast_rotation'
        if has(L + load, r'slow'): v, vl = 1, 'slow_control'
        return R('core', 'CORE', c, v, vl)
    # isolation
    if has(L, P_ISO):
        c = 3
        if 'machine' in names: c = 5
        elif 'cable' in names: c = 4
        elif has(L, r'swiss|slider|glider|glidder|hamstring runners|hamstring sliders|banded rolling'): c = 2
        elif has(L, r'incline curls|inclined bench curls|incline bicep|preacher|skull|tate press|seated'): c = 4
        if has(L, r'nordic'): c = 3
        v, vl = 2, 'controlled'
        if has(L + ' ' + load, r'fast|runners'): v, vl = 4, 'fast_concentric'
        if has(L, r'heavy'): v, vl = 3, 'heavy'
        if has(L + ' ' + load, r'myo'): vl = 'controlled_myo'
        up = 'V_PULL' if has(L, r'pull over') else None
        return R('isolation', 'T5_ISOLATION', c, v, vl, up)
    heavy = has(L + ' ' + (ctx.get('load_raw') or '') + ' ' + (ctx.get('reps_raw') or ''), r'heavy|1rir|1-2rir|weighted pull|m\.e\.')
    slow = has(L, r'slow')
    vh = (3, 'heavy') if heavy else (2, 'controlled')
    if slow: vh = (1, 'slow_tempo')
    # unilateral / asymmetrical compounds
    if has(L, P_UNI_LOWER) and not has(L, r'^(lat pull|single arm lat|unilateral lat|single arm db|one dumbbell)'):
        if has(L, r'iso holds|slow eccentric'): vh = (1, 'slow_eccentric_or_iso')
        lower_like = has(L, r'lunge|step|rdl|\bdl\b|deadlift|bridge|split|ffe|rfe|contra|ipsi|staggered|camporini|single leg|hip thru|thurts|\bsl\b')
        if 'barbell' in names and has(L, r'staggered'):
            return R('staggered_barbell_hinge', 'T3_STRENGTH', 2, *vh)
        up = upper_of(L) if not lower_like else None
        return R('unilateral_lower' if lower_like else 'unilateral_upper', 'T4_RESISTANCE_PATTERN', 2, *vh, up)
    # bilateral lower
    if has(L, P_SQUAT + '|' + P_HINGE + r'|leg press|add 2 more rounds to front squats') and not has(L, r'\brows?\b'):
        if 'machine' in names and 'smith_machine' not in names and not has(L, 'hyper'):
            c = 5
        elif 'smith_machine' in names or has(L, 'hyper-extension'):
            c = 4
        else:
            c = 3
        bb = any(n in names for n in ('barbell', 'hex_bar'))
        tier = 'T3_STRENGTH' if (bb or heavy) else 'T4_RESISTANCE_PATTERN'
        if has(L, r'bodyweight squats'):
            tier = 'T4_RESISTANCE_PATTERN'
        if has(L + ' ' + load, r'myo'): vh = (vh[0], 'controlled_myo')
        return R('bilateral_lower', tier, c, *vh)
    up = upper_of(L)
    if up:
        c = 3
        if 'machine' in names: c = 5
        elif has(L, r'seal row|chest supported|machine supported'): c = 4
        elif 'cable' in names: c = 2 if has(L, r'half kneeling|single arm|\bsa\b|rotational') else 4
        elif has(L, r'single arm|unilateral|half kneeling|\bsa\b|one dumbbell|offset|bottoms? up|botton up|landmine|bird dog|sesaw|seesaw'):
            c = 2
        bb = any(n in names for n in ('barbell', 'hex_bar'))
        if has(L, r'\bdb rows?\b|dumbbell rows|db row\b') and not has(L, 'bent over db'):
            tier = 'T4_RESISTANCE_PATTERN'
        elif bb or (heavy and not has(L, r'single|unilateral|half kneeling')):
            tier = 'T3_STRENGTH'
        else:
            tier = 'T4_RESISTANCE_PATTERN'
        if 'pullup_bar' in names and not has(L, 'weighted'):
            tier = 'T4_RESISTANCE_PATTERN'
        v, vl = vh
        if has(L, r'fast'): v, vl = 4, 'fast_concentric'
        if has(L + ' ' + load, r'max reps|max pushup|\bmax\b'): vl = vl + '_to_max_reps'
        return R('upper_compound', tier, c, v, vl, up)
    return R('unclassified', 'UNCLASSIFIED', None, None, None)

def upper_of(L):
    L = L.lower()
    if has(L, r'curl to press'):
        return None
    if has(L, r'rear delt|upright|face pull|reverse flies|high pull'):
        return None
    if has(L, r'pull ?ups?|pullups|\bchin|lat pull|pull ?downs?|lats pull|pulldown|pull overs?'):
        return 'V_PULL'
    if has(L, r'\brows?\b|row machine|machine row|seal'):
        return 'H_PULL'
    if has(L, r'overhead press|oh press|\bohp\b|shoulder press|arnold|jerk|push press|single arm db press|landmine|db press$|'
              r'strict press|barbell press|medball press|sesaw|seesaw|overhead db press|dumbbell overhead press|db overhead press|'
              r'bb oh press|db oh press'):
        return 'V_PUSH'
    if has(L, r'bench|push ?ups|pushups|floor press|chest press|incline press'):
        return 'H_PUSH'
    if has(L, r'\bdips?\b'):
        return 'DIP'
    return None

# ------------------------------------------------------------------ public entry
ALIASES = {'unilateral': 'UNILATERAL LAT PULL DOWN', 'high bar': 'HIGH BAR SQUAT', 'low bar': 'LOW BAR SQUAT'}

def classify(raw_name, ctx=None):
    ctx = ctx or {}
    s0 = norm(raw_name)
    notes = []
    s = s0
    if s.lower() in ALIASES:
        notes.append(f"truncated label '{s0}' read as '{ALIASES[s.lower()]}' (INFERRED from neighbouring weeks)")
        s = ALIASES[s.lower()]
    s = re.sub(r'ropte', 'rope', s, flags=re.I)
    with_core = False
    if re.search(r'/\s*core\b', s, re.I):
        with_core = True
        s = re.sub(r'/\s*core\b', '', s, flags=re.I).strip(' /')
        notes.append("written as '<lift>/ core' -> core work paired with the lift")
    s = re.sub(r'^\d+x\d+\s*-\s*|^\d+x\d+\s+|^\d+x\d+/\s*', '', s)   # '3x6 - DB bench press' -> 'DB bench press'
    s = re.sub(r'^(superset|super set)\s*:\s*', '', s, flags=re.I)
    # alternates
    opts = split_options(s)
    is_alt = len(opts) > 1 or has(s, r'\(any kind\)|of choice|any choice|any cardio')
    # components (sequence inside one line)
    def comps_of(x):
        parts = re.split(r'\s\+\s|\bdirectly into\b|\bdireclty into\b', x, flags=re.I)
        p2 = []
        for p in parts:
            m = re.match(r'^(.*?)\s&\s(.*)$', p)
            if m and len(m.group(1).split()) >= 2 and len(m.group(2).split()) >= 2 and not re.match(r'(catch|step out|go\b)', m.group(2), re.I):
                p2 += [m.group(1), m.group(2)]
            else:
                p2.append(p)
        parts = p2
        if re.search(r'/', x) and re.search(r'(squats?|deadlifts?)\s*/', x, re.I):
            parts = re.split(r'/', x)
        elif re.search(r'[a-z]\s*/\s*[a-z]', x, re.I) and not re.search(r'chest pass|sec|recover|\d\s*/\s*\d|cardio|arm/leg|front/side|fast/', x, re.I) \
                and len(parts) == 1:
            cand = re.split(r'\s*/\s*', x)
            if all(len(c.split()) >= 2 or c.strip().lower() == 'core' for c in cand):
                parts = cand
        if re.search(r'^\d+ deadlifts - ', x, re.I):
            parts = re.split(r'\s-\s', x)
        parts = [p.strip() for p in parts if p and p.strip()]
        if len(parts) > 1:
            parts = [re.sub(r'^\d+\s+(?=[a-zA-Z])', '', p) for p in parts]
        return parts
    first = opts[0]
    comps = comps_of(first)
    ccls = [classify_one(c, ctx) for c in comps]
    tiers = [c['tier'] for c in ccls]
    heavyish = any(has(c, P_SQUAT + r'|deadlift|\bdl\b|lunge|iso holds') and not has(c, r'jump') for c in comps)
    jumpish = any(t in ('T1_POWER', 'T2_POWER_STRENGTH') and has(c, r'jump|hop|bound|swing|high knee run')
                  for c, t in zip(comps, tiers))
    if len(comps) > 1 and heavyish and jumpish:
        main = dict(ccls[0])
        main.update({'family': 'contrast_complex', 'tier': 'T2_POWER_STRENGTH', 'velocity_intent': 5, 'velocity_label': 'contrast'})
        main['constraint_level'] = min([c['constraint_level'] for c in ccls if c['constraint_level']] or [1])
        notes.append('contrast/complex: heavy lift paired with jump(s) in one line')
    else:
        non_core = [c for c in ccls if c['tier'] not in ('CORE',)]
        main = dict(non_core[0] if non_core else ccls[0])
        if len(comps) > 1:
            notes.append('multi-movement line: tier taken from first non-core component')
    # implements: union over options and components, keep sources
    imps, srcs = [], {}
    for k, o in enumerate(opts):
        for c in comps_of(o):
            for nm, src in implements_of(c):
                if nm not in imps:
                    imps.append(nm)
                    srcs[nm] = src if k == 0 else ('coach_alternate' if src == 'explicit' else src)
    if with_core and 'bodyweight' not in imps:
        imps.append('bodyweight'); srcs['bodyweight'] = 'explicit'
    # primary implement = first load-bearing implement of the coach's FIRST option / first component
    order = ['barbell', 'hex_bar', 'ez_bar', 'smith_machine', 'machine', 'cable', 'landmine', 'kettlebell', 'dumbbell', 'medball',
             'load_unspecified', 'plate', 'band', 'slider', 'swiss_ball', 'dip_station', 'pullup_bar', 'bike_erg', 'rower',
             'ski_erg', 'cardio_any', 'any_implement', 'jump_rope', 'bodyweight', 'box_step', 'hurdle', 'plate_as_target']
    main_idx = 0
    if len(comps) > 1 and main['family'] != 'contrast_complex':
        for k, c in enumerate(ccls):
            if c['tier'] != 'CORE':
                main_idx = k; break
    first_imps = [nm for nm, _ in implements_of(comps[main_idx])] if comps else []
    pri = None
    for o in order:
        if o in first_imps:
            pri = o; break
    if pri is None:
        for o in order:
            if o in imps:
                pri = o; break
    if main['family'] in ('plyo_jump_hop', 'plyo_landing', 'sprint_drill', 'jump_squat', 'upper_plyo', 'tempo_run') \
            and pri in (None, 'box_step', 'hurdle', 'plate_as_target'):
        pri = 'bodyweight'
    if main['family'] == 'sprint_drill' and 'band' in first_imps:
        pri = 'band'
    if main['family'] == 'plyo_jump_hop' and 'band' in first_imps:
        pri = 'band'
    if pri == 'band' and any(x in first_imps for x in ('barbell',)):
        pri = 'barbell'
    if pri == 'load_unspecified' and 'pullup_bar' in first_imps:
        pri = 'pullup_bar'
    out = {
        'name_norm': s0,
        'implements': imps,
        'implement_sources': srcs,
        'primary_implement': pri,
        'implement_category': category_of(pri, main['family']),
        'coach_alternate': is_alt,
        'options': opts if len(opts) > 1 else None,
        'components': comps if len(comps) > 1 else None,
        'family': main['family'],
        'tier': main['tier'],
        'constraint_level': main['constraint_level'],
        'velocity_intent': main['velocity_intent'],
        'velocity_label': main['velocity_label'],
        'notes': notes,
    }
    # row-level speed prescription (4 TRACKS 12-week N17/N21 'FAST RPE6 or about 60-70%') turns a main lift into dynamic effort
    if has(str(ctx.get('reps_raw') or '') + ' ' + str(ctx.get('load_raw') or ''), r'fast') and out['tier'] in ('T3_STRENGTH', 'T4_RESISTANCE_PATTERN') \
            and out['family'] in ('bilateral_lower', 'upper_compound'):
        out.update({'tier': 'T2_POWER_STRENGTH', 'family': 'dynamic_effort', 'velocity_intent': 4, 'velocity_label': 'fast_concentric_loaded'})
        out['notes'].append("row prescription contains 'FAST' -> dynamic-effort use of this lift/implement")
    # accessory-slot ballistics (Part D low-intensity plyo)
    if ctx.get('part') == 'Part D' and out['tier'] in ('T1_POWER', 'T2_POWER_STRENGTH'):
        out['accessory_slot_ballistic'] = True
    # upper / lower pattern
    up = main.get('upper_pattern')
    if up is None and main['tier'] in ('T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN') and main['family'] in ('upper_compound', 'unilateral_upper'):
        up = upper_of(first)
    out['upper_pattern'] = up
    L = first.lower()
    lp = None
    if out['tier'] in ('T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN') and main['family'] not in ('upper_compound', 'unilateral_upper', 'push_press_jerk', 'speed_strength_upper'):
        if has(L, P_UNI_LOWER) and not has(L, r'lat pull|single arm db|single arm lat|one dumbbell'):
            lp = 'UNILATERAL_HIP' if has(L, r'rdl|\bdl\b|deadlift|bridge|hip thru|hip thurts|camporini|good morning') else 'UNILATERAL_KNEE'
        elif has(L, r'deadlift|deadlfts|deaflits|dealifts|\bdl\b|rdl|good morning|swing|hyper-extension|glute bridge|clean|snatch|high pull'):
            lp = 'BILATERAL_HIP'
        elif has(L, P_SQUAT + r'|leg press|jumps?'):
            lp = 'BILATERAL_KNEE'
    out['lower_pattern'] = lp
    return out

def category_of(pri, fam):
    if pri in ('barbell', 'hex_bar', 'ez_bar', 'landmine'):
        return 'barbell/hex/ez/landmine'
    if pri in ('machine', 'smith_machine'):
        return 'machine (incl. smith)'
    if pri == 'cable':
        return 'cable'
    if pri == 'dumbbell':
        return 'dumbbell'
    if pri == 'kettlebell':
        return 'kettlebell'
    if pri == 'medball':
        return 'medball'
    if pri in ('band', 'chains'):
        return 'band'
    if pri == 'plate':
        return 'plate'
    if pri in ('slider', 'swiss_ball'):
        return 'slider/swiss ball'
    if pri in ('bike_erg', 'rower', 'ski_erg', 'cardio_any', 'jump_rope'):
        return 'cardio equipment'
    if pri == 'load_unspecified':
        return 'external load (unspecified)'
    if pri == 'any_implement':
        return 'any (coach: any kind)'
    if pri in ('bodyweight', 'pullup_bar', 'dip_station', 'box_step', 'hurdle', 'plate_as_target'):
        if fam in ('plyo_jump_hop', 'plyo_landing', 'sprint_drill', 'upper_plyo', 'jump_squat', 'tempo_run', 'metabolic',
                   'sprint_intervals', 'buy_out_finisher'):
            return 'bodyweight ballistic/sprint'
        return 'bodyweight'
    return 'unspecified'
