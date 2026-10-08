# -*- coding: utf-8 -*-
"""Merge every exercise-like record into ONE canonical catalog (read-only toward the sheets)."""
import re, sys, os, json, collections, datetime
from common import *
from load_sources import load_all, equipment_index
from manual_lib import MERGES, NAMES, GENERIC, FLAGS, COACH_PREF, GENERIC_IMPL
from manual_prog import PROG, NEW
from progclean import clean_prog
from vocab import *

sys.path.insert(0, AN + '/equipment')
os.chdir(ROOT)
import _extract_sessions as EXS

LEVEL_ORDER = {'foundational': 0, 'intermediate': 1, 'advanced': 2}
FLAGS_N = {}
for _k, _v in FLAGS.items():
    FLAGS_N.setdefault(nkey(_k), []).extend(_v)
PREF_N = {nkey(_k): _v for _k, _v in COACH_PREF.items()}
EXK = {'exercise', 'test', 'conditioning_prescription', 'drill'}
ROLE_RANK = {'byop_master_stack': 0, 'byop_unwired_column': 1, 'byop_level_view': 2, 'byop_copy_tab_only': 3, 'byop_focus_list': 4,
             'reference_resistance_patterns': 5, 'reference_specialty': 6, 'reference_sheet23': 7}

def _cell_verbatim(wbname, tab, cell):
    if wbname != 'MASTER_MODEL' or not cell:
        return None
    for ws in _wb.worksheets:
        if ws.title.strip() == (tab or '').strip() or ws.title.replace('/', '') == (tab or '').replace('/', ''):
            try:
                return ws[cell.split(':')[0]].value
            except Exception:
                return None
    return None

def col_row(cell):
    m = re.match(r'([A-Z]+)(\d+)', cell or '')
    return (m.group(1), int(m.group(2))) if m else (None, None)

# ------------------------------------------------------------------ load
S = load_all()
EQ = equipment_index()
SPEC_BY_SID = {s['sid']: s for s in S}

# ------------------------------------------------------------------ BYOP wiring (OBSERVED) from L4_slot_wiring.md section 6
WIRING = []   # rows of program tabs
cur_tab = None
for line in open(AN + '/library/L4_slot_wiring.md'):
    m = re.match(r'^#### (.+?)(?: \(HIDDEN tab\))?\s*$', line)
    if m:
        cur_tab = m.group(1).strip()
        continue
    if cur_tab and line.startswith('| ') and '->' in line:
        parts = [p.strip() for p in line.strip().strip('|').split('|')]
        if len(parts) < 10 or not parts[0].isdigit():
            continue
        ex = parts[4]
        mm = re.match(r'([A-Z]+\d+) -> `([A-Z]+)(\d+):([A-Z]+)(\d+)`', ex)
        if not mm:
            continue
        WIRING.append(dict(tab=cur_tab, row=int(parts[0]), day=parts[1], purpose=parts[2], category=parts[3], cell=mm.group(1),
                           col=mm.group(2), r0=int(mm.group(3)), r1=int(mm.group(5)), range=f"{mm.group(2)}{mm.group(3)}:{mm.group(4)}{mm.group(5)}",
                           value=parts[9] if len(parts) > 9 else None, flag=('TRUNCATED' in ex)))

def slots_for_cell(cell):
    c, r = col_row(cell)
    out = []
    for w in WIRING:
        if w['col'] == c and w['r0'] <= r <= w['r1']:
            out.append(w)
    return out

def summarize_slots(ws):
    agg = collections.OrderedDict()
    for w in ws:
        lab = f"{w['purpose'].strip()} / {w['category'].strip() or '(no category label)'}"
        a = agg.setdefault((lab, w['range']), dict(slot=lab, library_range=w['range'], tabs=collections.OrderedDict()))
        a['tabs'].setdefault(w['tab'], []).append(w['cell'])
    out = []
    for (lab, rng), a in agg.items():
        out.append(dict(slot=a['slot'], library_range=a['library_range'],
                        templates=[dict(tab=t, cells=cs) for t, cs in a['tabs'].items()]))
    return out

# BYOP program fills + doses (OBSERVED)
DOSE = {}
try:
    va = load(AN + '/programs/prog_byop_aesthetics.volume.json')
    for p in va['programs']:
        for s in p['slots']:
            if s.get('exercise_cell'):
                DOSE[(p['tab'], s['exercise_cell'])] = (s.get('sets'), s.get('reps'), None)
    vb = load(AN + '/programs/prog_byop_athletic.volume.json')
    for p in vb['programs']:
        for s in p['slots']:
            DOSE[(p['tab'], 'E%s' % s.get('row'))] = (s.get('sets'), s.get('reps'), s.get('note'))
except Exception as e:
    print('dose load warn', e)

# ------------------------------------------------------------------ cluster keys
parent = {}
def find(k):
    while parent.get(k, k) != k:
        k = parent[k]
    return k
def union(a, b):  # b -> a
    ra, rb = find(a), find(b)
    if ra != rb:
        parent[rb] = ra

NOTE_KEY = nkey('Bigger plates start at lateral bilateral plate hops')

def skey(s):
    k = s['kind']
    if nkey(s['raw']) == NOTE_KEY:
        return 'ph:note:' + NOTE_KEY
    if k in EXK:
        return 'ex:' + nkey(s['raw'])
    if k == 'modifier':
        return 'mod:' + str(s['category_canon']) + ':' + nkey(s['raw'])
    if k == 'taxonomy_placeholder':
        return 'ph:' + col_row(s['cell'])[0] + ':' + nkey(s['raw'])
    if k == 'progression_note':
        return 'ph:note:' + nkey(s['raw'])
    if k == 'variant_rule':
        return 'ph:rule:' + nkey(s['raw'])
    if k == 'program_session':
        return 'sess:' + str(s['extra'].get('session_type'))
    raise ValueError(k)

TARGET_RAW = {}
for s in S:
    key = skey(s)
    parent.setdefault(key, key)
merge_reason = {}
for tgt, others, why in MERGES:
    tk = 'ex:' + nkey(tgt)
    TARGET_RAW[tk] = tgt
    for o in others:
        ok = 'ex:' + nkey(o)
        union(tk, ok)
        merge_reason[ok] = why
union('ex:' + nkey('1 Mile run for time'), 'sess:max_effort_mile')
# modifier merges (INFERRED same concept in RP 'LOADING VARIABLES' and ALL ABOUT SQUATS loading variations)
_mk = {s['sid']: skey(s) for s in S if s['kind'] == 'modifier'}
def _sid(tab, cell):
    for k, v in _mk.items():
        if k.endswith(tab + '!' + cell):
            return v
    raise KeyError(tab + cell)
for (ta, ca), (tb, cb), why in [(('ALL ABOUT SQUATS', 'A41'), ('(NOT DONE) RESISTANCE PATTERNS', 'A91'), "same tool: RP 'LOADING VARIABLES' A91 and ALL ABOUT SQUATS A41 'WEIGHT RELEASERS'"),
                                (('ALL ABOUT SQUATS', 'A39'), ('(NOT DONE) RESISTANCE PATTERNS', 'A92'), "RP 'CHAINS' (A92) = chained loading; ALL ABOUT SQUATS A39 'BOTTOM CHAINS'"),
                                (('ALL ABOUT SQUATS', 'A35'), ('(NOT DONE) RESISTANCE PATTERNS', 'A93'), "RP 'BANDS' (A93) = bottom-anchored bands; ALL ABOUT SQUATS A35 'BOTTOM BANDED'")]:
    a, b = _sid(ta, ca), _sid(tb, cb)
    union(a, b)
    merge_reason[b] = why
merge_reason['sess:max_effort_mile'] = "Sheet24 '1-mile at max effort' = BYOP SPEED TEST '1 Mile run for time'"

clusters = collections.OrderedDict()
for s in S:
    k = find(skey(s))
    c = clusters.setdefault(k, dict(key=k, members=[], prog=[], byop_prog=[]))
    c['members'].append(s)

LIBKEYS = {k for k in clusters if k.startswith('ex:')}

def resolve_eq_ref(name):
    k = find('ex:' + nkey(name))
    assert k in clusters, name
    return k

# ------------------------------------------------------------------ program items (MASTER_MODEL)
SESS, _wb = EXS.extract_all()
ITEMS = []
for s in SESS:
    for it in s['items']:
        if it.get('name'):
            ITEMS.append(dict(program=s['program'], variant=s['variant'], tab=s['tab'], week=s.get('week'), day=s.get('day'), **it))

# [verification 2026-10-08] cell-reference corrections found by re-reading the dumps. BASEBALL BLOCK 3 Week 1 Part E:
# the buy-out text '1x 30 Sec Fast Run' sits in E75 and I75 (G75 is empty, J75 holds the label 'Buy out'); the
# extractor had shifted these two cells and copied the neighbouring text into sets/reps.
CELL_FIX = {('BASEBALL', 'G75'): 'E75', ('BASEBALL', 'J75'): 'I75'}
for it in ITEMS:
    fx = CELL_FIX.get((it['tab'], it['cell']))
    if fx:
        it['cell_as_extracted'] = it['cell']
        it['cell'] = fx
    for k in ('sets_raw', 'reps_raw'):
        v = it.get(k)
        if isinstance(v, str) and (v.strip().lower() == 'buy out' or nkey(v) == nkey(it['name'])):
            it[k] = None   # slot label / the exercise text itself picked up as a dose
    # 4 TRACKS AESTHETICS rows 32/33 hold the weekly SETS/REPS for the lifts; the extractor also stamped them on the
    # '30-40 mi slow/steady CARDIO' rows (E46:L46, E60:L60), which have no sets/reps in the sheet
    if 'TRACKS' in it['tab'] and re.search(r'slow/steady cardio', it['name'], re.I):
        it['sets_raw'] = it['reps_raw'] = None

def _verbatim(it):
    # the CrossFit extractor prefixes the row label ('POWER: CLEAN'); the cell itself only says 'CLEAN'
    return it.get('component_value') or it['name']

def _ctx(it):
    return it.get('component') if it.get('component_value') else None

NEWC = collections.OrderedDict()   # new_key -> cluster
CX = collections.OrderedDict()     # complex key -> dict
NONEX = []                         # non-exercise program cells
CROSS = []                         # crosswalk rows

def parse_ref(r):
    cue = None
    if '#' in r:
        r, cue = r.split('#', 1)
        r, cue = r.strip(), cue.strip()
    if r.startswith('='):
        return ('lib', resolve_eq_ref(r[1:]), cue)
    if r.startswith('+'):
        nk = r[1:].strip()
        assert nk in NEW, nk
        return ('new', 'new:' + nk, cue)
    raise ValueError(r)

def ensure_new(nk):
    return NEWC.setdefault(nk, dict(key=nk, members=[], prog=[], byop_prog=[]))

def alias_from_item(it, base, cues, extra_cue=None):
    allc = [c[1] for c in cues] + ([extra_cue] if extra_cue else [])
    return dict(raw=strip_urls(_verbatim(it)), context_label=_ctx(it), extracted_as=it['name'] if _ctx(it) else None,
                cell_corrected_from=it.get('cell_as_extracted'),
                raw_with_links=it['name'] if urls_in(it['name']) else None,
                workbook='MASTER_MODEL', tab=it['tab'], cell=it['cell'], role='program', program=it['program'], variant=it['variant'],
                week=it.get('week'), day=it.get('day'), slot=it.get('slot'), part=it.get('part'), sets_raw=it.get('sets_raw'),
                reps_raw=it.get('reps_raw'), cues=allc, video_urls=urls_in(it['name']))

for it in ITEMS:
    base, cues = clean_prog(it['name'])
    k = nkey(base)
    if 'ex:' + k in parent and find('ex:' + k) in clusters:
        ck = find('ex:' + k)
        clusters[ck]['prog'].append(alias_from_item(it, base, cues))
        CROSS.append(dict(source='MASTER_MODEL program', tab=it['tab'], cell=it['cell'], raw=_verbatim(it), **({'context_label': _ctx(it)} if _ctx(it) else {}), **({'cell_corrected_from': it['cell_as_extracted']} if it.get('cell_as_extracted') else {}), maps_to_key=ck, how='auto (normalised name)'))
        continue
    spec = PROG[k]
    if spec.startswith('!'):
        NONEX.append(dict(tab=it['tab'], cell=it['cell'], raw=_verbatim(it), **({'context_label': _ctx(it)} if _ctx(it) else {}), program=it['program'], reason=spec[1:]))
        CROSS.append(dict(source='MASTER_MODEL program', tab=it['tab'], cell=it['cell'], raw=_verbatim(it), **({'context_label': _ctx(it)} if _ctx(it) else {}), **({'cell_corrected_from': it['cell_as_extracted']} if it.get('cell_as_extracted') else {}), maps_to_key=None, how='not an exercise: ' + spec[1:]))
        continue
    if spec.startswith('&'):
        typ, body = spec[1:].split(':', 1)
        comps = [parse_ref(x) for x in body.split('|')]
        ck = 'cx:' + k
        cx = CX.setdefault(ck, dict(key=ck, type=typ, components=comps, prog=[], text=base))
        cx['prog'].append(alias_from_item(it, base, cues))
        for kind, ref, cue in comps:
            if kind == 'new':
                ensure_new(ref[4:])
        CROSS.append(dict(source='MASTER_MODEL program', tab=it['tab'], cell=it['cell'], raw=_verbatim(it), **({'context_label': _ctx(it)} if _ctx(it) else {}), **({'cell_corrected_from': it['cell_as_extracted']} if it.get('cell_as_extracted') else {}), maps_to_key=ck, how='complex/choice (manual)'))
        continue
    kind, ref, cue = parse_ref(spec)
    al = alias_from_item(it, base, cues, cue)
    if kind == 'lib':
        clusters[ref]['prog'].append(al)
    else:
        ensure_new(ref[4:])['prog'].append(al)
    CROSS.append(dict(source='MASTER_MODEL program', tab=it['tab'], cell=it['cell'], raw=_verbatim(it), **({'context_label': _ctx(it)} if _ctx(it) else {}), **({'cell_corrected_from': it['cell_as_extracted']} if it.get('cell_as_extracted') else {}), maps_to_key=ref, how='manual'))

# BYOP program fills (OBSERVED values in program tabs)
for w in WIRING:
    v = (w['value'] or '').strip()
    if not v or v.startswith('CHOOSE') or v.startswith('CHOSE') or v == 'OFF':
        continue
    k = find('ex:' + nkey(v))
    d = DOSE.get((w['tab'], w['cell']), (None, None, None))
    al = dict(raw=v, workbook='BYOP', tab=w['tab'], cell=w['cell'], role='byop_program_fill', program=w['tab'], day=w['day'],
              slot=f"{w['purpose']} / {w['category'] or '(no category label)'}", sets_raw=d[0], reps_raw=d[1], cues=[d[2]] if d[2] else [])
    if k in clusters:
        clusters[k]['byop_prog'].append(al)
        CROSS.append(dict(source='BYOP program fill', tab=w['tab'], cell=w['cell'], raw=v, maps_to_key=k, how='auto'))
    else:
        print('UNMATCHED BYOP FILL', w['tab'], w['cell'], v)

# ------------------------------------------------------------------ helpers for record assembly
def pattern_of(s):
    cc = str(s.get('category_canon') or '')
    cv = str(s.get('category_verbatim') or '')
    sp = str(s.get('sub_pattern') or '')
    raw = s['raw'].lower()
    role = s['role']
    if role.startswith('byop'):
        c, r = col_row(s['cell'])
        if s['tab'].startswith('Copy of Copy'):
            return 'HPUSH'
        m = {'B': 'CARDIO', 'D': 'TX', 'E': 'TX', 'F': 'ANKLE', 'G': 'PLYO', 'H': 'PLYO', 'I': 'PLYO', 'J': 'PLYO', 'K': 'THROW',
             'L': 'COD', 'M': 'COD', 'N': 'COD', 'P': 'CT', 'Q': 'CT', 'R': 'CP', 'S': 'CP', 'T': 'CP', 'U': 'VPULL', 'V': 'VPULL',
             'W': 'VPULL', 'X': 'HPULL', 'Y': 'HPULL', 'Z': 'HPULL', 'AA': 'VPUSH', 'AB': 'VPUSH', 'AC': 'VPUSH', 'AD': 'HPUSH',
             'AE': 'HPUSH', 'AF': 'HPUSH', 'AG': 'HPUSH', 'AH': 'SHLD', 'AI': 'BKD', 'AJ': 'BKD', 'AK': 'BKD', 'AL': 'UKD', 'AM': 'KEXT',
             'AN': 'BHD', 'AO': 'BHD', 'AP': 'BHD', 'AQ': 'UHD', 'AR': 'KFLEX', 'AS': 'BIC', 'AT': 'TRI', 'AU': 'CALF', 'BA': 'CARRY',
             'BB': 'DRAG', 'BC': 'AOS', 'BD': 'POS', 'BE': 'LSS'}
        if c == 'C':
            return 'ANKLE' if r >= 124 else 'TX'
        if c == 'O':
            return 'CP' if r >= 124 else 'CT'
        if c == 'AZ':
            u = sp.upper()
            for kw, p in (('UNILATERAL KNEE', 'UKD'), ('BILATERAL KNEE', 'BKD'), ('LEG EXT', 'KEXT'), ('UNILATERAL HIP', 'UHD'), ('BILATERAL HIP', 'BHD'),
                          ('LEG CURL', 'KFLEX'), ('MID RANGE', 'MRPUSH'), ('VERTICAL PUSH', 'VPUSH'), ('HORIZONTAL PUSH', 'HPUSH'), ('VERTICAL PULL', 'VPULL'),
                          ('HORIZONTAL PULL', 'HPULL'), ('SIDE RAISE', 'SHLD'), ('BICEP', 'BIC'), ('TRICEP', 'TRI'), ('CALF', 'CALF'), ('CORE THORAX', 'CT')):
                if kw in u:
                    return p
            return 'CT'
        return m.get(c, 'CORE')
    if role == 'reference_resistance_patterns':
        if 'leg extension' in raw:
            return 'KEXT'
        for kw, p in (('knee_dominant.bilateral', 'BKD'), ('knee_dominant.unilateral', 'UKD'), ('hip_dominant.bilateral', 'BHD'),
                      ('hip_dominant.unilateral', 'UHD'), ('mid_range_push', 'MRPUSH'), ('vertical_push', 'VPUSH'), ('horizontal_push', 'HPUSH'),
                      ('vertical_pull', 'VPULL'), ('horizontal_pull', 'HPULL'), ('shoulder', 'SHLD'), ('biceps', 'BIC'), ('triceps', 'TRI')):
            if kw in cc:
                return p
        return 'BKD'
    if role == 'reference_specialty':
        for kw, p in (('athletic.throwing', 'THROW'), ('warmup.', 'WARMUP'), ('cardio.', 'CARDIO'), ('control.core.thorax', 'CT'),
                      ('control.core.pelvis', 'CP'), ('control.core.both', 'CB'), ('athletic.ballistic', 'PLYO'), ('athletic.plyometric', 'PLYO'),
                      ('athletic.plyo', 'PLYO'), ('athletic.triple_extension', 'TX'), ('athletic.change_of_direction', 'COD'),
                      ('athletic.sprint', 'SPRINT'), ('knee_flexion', 'KFLEX'), ('knee_dominant.unilateral', 'UKD'), ('knee_dominant', 'BKD'),
                      ('hip_dominant', 'BHD'), ('vertical_push', 'VPUSH')):
            if kw in cc:
                return p
        return 'CORE'
    # sheet23
    u = cc.upper()
    for kw, p in (('JUMPING LIMITED KNEE', 'ANKLE'), ('JUMPING', 'PLYO'), ('PLYOS', 'PLYO'), ('TRIPLE', 'TX'), ('THROW', 'THROW'),
                  ('CHANGE OF DIRECTION', 'COD'), ('CORE THORAX', 'CT'), ('CORE PELVIS', 'CP'), ('UNILATERAL KNEE', 'UKD'), ('BILATERAL KNEE', 'BKD'),
                  ('UNILATERAL HIP', 'UHD'), ('BILATERAL HIP', 'BHD'), ('VERTICAL PULL', 'VPULL'), ('HORIZONTAL PULL', 'HPULL'),
                  ('VERTICAL PUSH', 'VPUSH'), ('HORIZONTAL PUSH', 'HPUSH'), ('SHOULDERS', 'SHLD'), ('BICEP', 'BIC'), ('TRICEP', 'TRI'),
                  ('CALVES', 'CALF'), ('SSC', 'PLYO')):
        if kw in u:
            return p
    if 'mach' in raw or 'acceleration' in raw:
        return 'SPRINT'
    return 'PLYO'

PRIMARY_COL_OVERRIDE = {'Leg Extensions': 'AM', 'DB thrusters': 'AI', 'Barbell Thrusters': 'AI', 'Single arm DB thrusters': 'AI'}

def choose_primary(members, key):
    tr = TARGET_RAW.get(key)
    want = PRIMARY_COL_OVERRIDE.get(tr) if tr else None
    if not want:
        for m in members:
            if m['raw'] in PRIMARY_COL_OVERRIDE:
                want = PRIMARY_COL_OVERRIDE[m['raw']]
    ms = sorted(members, key=lambda m: (ROLE_RANK.get(m['role'], 9), 0 if (want and col_row(m['cell'])[0] == want) else 1, col_row(m['cell'])[1] or 0))
    if want:
        cand = [m for m in ms if m['role'] == 'byop_master_stack' and col_row(m['cell'])[0] == want]
        if cand:
            return cand[0]
    return ms[0]

def _clean_setup(st):
    st = [t for t in st if t]
    if len(st) > 1 and 'none' in st:
        st = [t for t in st if t != 'none']
    out = []
    for t in st:
        if t not in out:
            out.append(t)
    return out or ['none']

def _dedupe_setups(setups):
    out = []
    for st in setups:
        st = _clean_setup(st)
        if sorted(st) not in [sorted(x) for x in out]:
            out.append(st)
    return out

def eq_groups_from_enrich(cell):
    """Return equipment as DNF: a list of alternative setups, each a list of required tokens."""
    import itertools
    if ('ATH', cell) in EQ:
        r = EQ[('ATH', cell)]
        dnf = [[EQ_TOKEN.get(t, t) for t in st] for st in (r.get('requires_any_of') or [])]
        return _dedupe_setups(dnf) or [['none']], 'analysis/equipment/lib_athletic_core.json requires_any_of (alternative setups)'
    if ('RES', cell) in EQ:
        r = EQ[('RES', cell)]
        cnf = [[EQ_TOKEN.get(t, t) for t in g] for g in (r.get('implement_requirement_groups') or [])]
        dnf = [list(p) for p in itertools.product(*cnf)] if cnf else [['none']]
        return _dedupe_setups(dnf), 'analysis/equipment/lib_resistance.json implement_requirement_groups (AND of OR-groups, expanded)'
    return None, None

def eq_groups_infer(name, decoder_eq, pat, generic=False):
    toks = []
    for e in decoder_eq or []:
        t = EQ_TOKEN.get(e)
        if t and t not in toks:
            toks.append(t)
    low = ' ' + str(name).lower() + ' '
    for pat_re, tok in KEYWORD_EQ:
        if re.search(pat_re, low) and tok not in toks:
            if tok == 'open_space_long' and pat not in ('CARDIO', 'SPRINT', 'COD'):
                continue
            if tok == 'barbell' and ('dumbbell' in toks or 'kettlebell' in toks or 'medball' in toks) and not re.search(r'barbell|\bbb\b', low):
                continue
            if tok == 'machine' and ('cable' in toks or (re.search(r'band|\bdb\b|dumbbell', low) and 'machine' not in low)):
                continue
            if tok == 'squat_rack':
                continue
            toks.append(tok)
    if pat in ('HPUSH', 'MRPUSH') and 'bench' in toks and ('dumbbell' in toks or 'barbell' in toks):
        toks = ['weight_bench' if t == 'bench' else t for t in toks]
    if 'viking' in low and 'landmine' not in toks:
        toks.append('landmine')
    if 'barbell' in toks and pat in ('BKD', 'HPUSH', 'MRPUSH') and 'squat_rack' not in toks and 'box' not in toks and 'floor' not in low and 'landmine' not in toks:
        toks.append('squat_rack')
    if len(toks) > 1 and 'none' in toks:
        toks.remove('none')
    if not toks:
        toks = ['none']
    if pat in ('PLYO', 'ANKLE') and 'plate' in toks:
        toks = ['plate_low_target' if t == 'plate' else t for t in toks]
    if pat in ('CT', 'CP', 'CB', 'CORE') and 'plate_low_target' in toks:
        toks = ['plate' if t == 'plate_low_target' else t for t in toks]
    if generic:
        setups = []
        for t in toks:
            if t == 'squat_rack':
                continue
            setups.append([t, 'squat_rack'] if (t == 'barbell' and pat == 'BKD') else [t])
        if pat in ('UKD',) and ['none'] not in setups:
            setups.append(['none'])
        return _dedupe_setups(setups)
    alts = []
    for pair in (('dumbbell', 'kettlebell'), ('cable', 'band')):
        if pair[0] in toks and pair[1] in toks:
            alts.append(pair)
    setups = [[t for t in toks if not any(t in p for p in alts)]]
    for pair in alts:
        setups = [st + [opt] for st in setups for opt in pair]
    return _dedupe_setups(setups)

def machine_type(name, impl):
    if 'machine' not in impl and 'smith' not in impl:
        return None
    m = re.search(r'leg press|leg extension|leg curl|hack|pendulum|v-squat|smith|calf|hip thrust|row|pull-?up|bench press|flie|fly|reverse fl|good morning|dip|hyper', name.lower())
    return m.group(0) if m else 'machine (type not stated)'

def setup_tier(st):
    return max([TIER.get(t, 3) for t in st] or [0])

def tier_of_groups(setups):
    if not setups:
        return 0
    return min(setup_tier(st) for st in setups)

def household(setups):
    if not setups:
        return []
    best = min(setups, key=setup_tier)
    if setup_tier(best) > 0:
        return []
    return sorted({f"{t}: {HOUSEHOLD_NOTE[t]}" for t in best if t in HOUSEHOLD_NOTE and t != 'none'})

REP_BUCKETS = [('4 to 6 Reps', 4, 6), ('6 to 8 Reps', 6, 8), ('8 to 12 Reps', 8, 12), ('10 to 15 Reps', 10, 15), ('15 Reps', 15, 15), ('20 Reps', 20, 20)]
# [verification 2026-10-08] the old code took min-max of EVERY number in the reps cells, mixing reps with seconds,
# minutes, calories, %1RM, set counts ('3x8' -> 3) and '10/10' per-side notation (-> '10-10'). This parser keeps
# true rep counts only and reports timed work separately.
def _parse_reps_cell(v):
    s = str(v or '').strip()
    low = s.lower().replace('1o', '10')
    out = dict(reps=[], per_side=False, secs=[], max=False)
    if not low or low in ('none', 'choose \U0001f447'):
        return out
    m = re.match(r'see -> (\d+)', low)
    if m:
        out['reps'].append(int(m.group(1)))
        return out
    if re.search(r'max|m\.e\.|unbroken', low):
        out['max'] = True
    if '%' in low or 'rpe' in low:
        return out
    if re.search(r'cal\b|calorie|yrd|yard|mile|\d\s*m\b', low):
        return out
    if re.search(r'sec|\bs\b|^:\d|min', low):
        for n, unit in re.findall(r'(\d+(?:\.\d+)?)\s*(min|minute|sec|s\b)?', low):
            if not n:
                continue
            x = float(n)
            if unit.startswith('min') or ('min' in low and not unit and 'sec' not in low):
                x *= 60
            if x > 0:
                out['secs'].append(int(x))
        if re.search(r'each side|each leg|each arm|/', low):
            out['per_side'] = True
        return out
    m = re.match(r'^\s*(\d+)\s*x\s*(\d+)', low)
    if m:
        out['reps'].append(int(m.group(2)))
        return out
    parts = [int(x) for x in re.findall(r'\d+', low)]
    if re.match(r'^\s*\d+\s*/\s*\d+\s*$', low) and len(set(parts)) == 1:
        out['reps'] = parts[:1]
        out['per_side'] = True
        return out
    if re.search(r'each side|each leg|each arm|on each', low):
        out['per_side'] = True
    out['reps'] = [x for x in parts if 0 < x <= 60]
    return out

def observed_rep_summary(obs):
    reps, secs, side_flags, mx = [], [], [], False
    for o in obs:
        pr = _parse_reps_cell(o.get('reps'))
        if pr['reps']:
            reps += pr['reps']
            side_flags.append(pr['per_side'])
        secs += pr['secs']
        mx = mx or pr['max']
    parts = []
    rep_txt = None
    if reps:
        lo, hi = min(reps), max(reps)
        rep_txt = (f"{lo}" if lo == hi else f"{lo}-{hi}") + ' reps'
        if side_flags and all(side_flags):
            rep_txt += ' per side'
        elif any(side_flags):
            rep_txt += ' (some cells per side)'
        parts.append(rep_txt)
    if secs:
        lo, hi = min(secs), max(secs)
        parts.append(('%d s' % lo if lo == hi else '%d-%d s' % (lo, hi)) + ' timed')
    if mx:
        parts.append('max-rep sets')
    if not parts:
        return None, None
    return '; '.join(parts) + ' (observed in programs)', rep_txt

def buckets_for(rr):
    if not rr:
        return []
    nums = [int(x) for x in re.findall(r'\d+', str(rr).split('(')[0])[:2]]
    if not nums or re.search(r'\bs\b|sec|min|hold|round|mile|m\b|cal', str(rr).lower()):
        return []
    lo, hi = (nums[0], nums[-1]) if len(nums) > 1 else (nums[0], nums[0])
    return [b for b, a, z in REP_BUCKETS if not (z < lo or a > hi)]

# [verification 2026-10-08] every reference level now carries the evidence behind it. Decoder levels that were
# copied from BYOP or guessed (no label / no colour in the reference tab) are no longer presented as OBSERVED and no
# longer trigger 'LEVEL DIFFERS BY SOURCE'.
def ref_level_evidence(m):
    lv = (m.get('level_norm') or '').lower()
    if lv not in LEVEL_ORDER and lv not in ('foundational-intermediate', 'intermediate-advanced'):
        return 'no level'
    b = str(m.get('level_basis') or '')
    role = m['role']
    if role == 'reference_sheet23':
        if m.get('level_raw') and 'positional only' in b:
            return 'INFERRED (cell sits in a loose list below the grid; column header applied by position only)'
        return 'OBSERVED header label' if m.get('level_raw') else 'INFERRED (column position / footer - no level word in the header)'
    if role == 'reference_resistance_patterns':
        if b.startswith('OBSERVED colour') or b.startswith('OBSERVED: cell background'):
            return 'OBSERVED cell colour (colour->level mapping INFERRED; it matches BYOP for 48 of 52 twins)'
        if b.startswith('OBSERVED header'):
            return 'OBSERVED header wording'
        if b.startswith('BYOP'):
            return 'COPIED from the BYOP library by the decoder (not independent evidence)'
        return 'INFERRED by the decoder (no colour / label in this tab)'
    if role == 'reference_specialty':
        if b.startswith('OBSERVED in BYOP'):
            return 'COPIED from the BYOP library by the decoder (not independent evidence)'
        if b.startswith('OBSERVED') and m.get('level_raw'):
            return 'OBSERVED label'
        if b.startswith('OBSERVED'):
            return 'OBSERVED (decoder) - no level word quoted'
        return 'INFERRED by the decoder (%s)' % (b[:80] or 'no basis given')
    return 'INFERRED'

def level_info(members, pat):
    byop = []
    refs = []
    for m in members:
        lv = (m.get('level_norm') or '').lower() or None
        if m['role'].startswith('byop'):
            byop.append(dict(cell=m['cell'], tab=m['tab'], block_label=m.get('level_raw'), level=lv, role=m['role']))
        else:
            refs.append(dict(source=m['tab'], cell=m['cell'], label=m.get('level_raw'), level=lv, basis=m['role'],
                             evidence=ref_level_evidence(m)))
    byop_lv = sorted({b['level'] for b in byop if b['level'] in LEVEL_ORDER}, key=LEVEL_ORDER.get)
    master_lv = sorted({b['level'] for b in byop if b['level'] in LEVEL_ORDER and b['role'] == 'byop_master_stack'}, key=LEVEL_ORDER.get)
    ref_lv = sorted({r['level'] for r in refs if r['level'] in LEVEL_ORDER}, key=LEVEL_ORDER.get)
    ref_obs_lv = sorted({r['level'] for r in refs if r['level'] in LEVEL_ORDER and r['evidence'].startswith('OBSERVED')}, key=LEVEL_ORDER.get)
    if master_lv:
        primary, basis = master_lv[0], 'OBSERVED: lowest BYOP dropdown level block containing it'
    elif byop_lv:
        if all(not b['block_label'] for b in byop if b['level'] in LEVEL_ORDER):
            primary, basis = byop_lv[0], ('INFERRED: BYOP cell fill colour read as a level (light green D9EAD3 = foundational, light yellow FFF2CC = '
                                          'intermediate, light red F4CCCC = advanced); the column has no level word')
        else:
            primary, basis = byop_lv[0], 'OBSERVED: BYOP level view / unwired column (level word in the column header)'
    elif any(b['level'] == 'any' for b in byop):
        primary, basis = 'any', "OBSERVED: BYOP list has no level tiers ('any')"
    elif ref_lv:
        s23 = [r for r in refs if r['basis'] == 'reference_sheet23' and r['level'] in LEVEL_ORDER]
        rp = [r for r in refs if r['basis'] == 'reference_resistance_patterns' and r['level'] in LEVEL_ORDER]
        pool = s23 or rp or [r for r in refs if r['level'] in LEVEL_ORDER]
        best = sorted(pool, key=lambda r: LEVEL_ORDER[r['level']])[0]
        primary = best['level']
        basis = '%s %s: %s' % (best['source'], best['cell'], best['evidence'])
    elif any(r['level'] == 'any' for r in refs):
        primary, basis = 'any', 'reference list without levels'
    else:
        primary, basis = 'unrated', 'no level in any source'
    allv = sorted(set(byop_lv) | set(ref_lv), key=LEVEL_ORDER.get)
    disagree = bool(byop_lv and ref_obs_lv and not set(ref_obs_lv) <= set(byop_lv))
    return dict(primary=primary, basis=basis, levels_in_byop=byop_lv, levels_all_sources=allv, reference_levels_observed=ref_obs_lv,
                multi_level_in_byop=len(master_lv) > 1, cross_source_disagreement=disagree,
                cross_source_rule='compares BYOP levels with OBSERVED reference levels only (labels/colours); decoder-copied or decoder-inferred levels are excluded',
                byop_placements=byop, reference_placements=refs)

def tidy(s):
    s = fix_typos(disp(s)).strip()
    s = re.sub(r'\s+', ' ', s)
    return s[:1].upper() + s[1:] if s else s

VARLABEL = {'rom': 'ROM variable', 'end_range_behaviour': 'End-range behaviour', 'accommodating_or_special_loading': 'Loading variable',
            'load_position': 'Load position', 'load_laterality': 'Load laterality', 'hand_placement': 'Hand placement',
            'feet_position': 'Feet position', 'stance': 'Stance', 'load_laterality x load_position': 'Load laterality x position'}

def special_name(prim, members):
    ex = prim.get('extra') or {}
    if prim['role'] == 'reference_specialty' and ex.get('specialty_record_type') == 'workout':
        if ex.get('aerobic_band_letter'):
            return f"Aerobic {ex['aerobic_band_letter']} ({ex.get('aerobic_colour')}): {tidy(prim['raw'])}"
        return f"Lactate Clearance: {tidy(prim['raw'])}"
    if prim['kind'] == 'modifier' and prim['role'] == 'reference_resistance_patterns':
        return f"{VARLABEL.get(prim['category_canon'], prim['category_canon'])}: {tidy(prim['raw'])}"
    if prim['kind'] == 'taxonomy_placeholder':
        cat = str(prim.get('category_verbatim') or '')
        raw = tidy(prim['raw'].title())
        if raw.upper() in cat.upper().split(' > ')[-1:]:
            return f"{tidy(cat.title())} [heading - no exercises yet]"
        return f"{tidy(cat.title())} > {raw} [heading - no exercises yet]"
    return None

# ------------------------------------------------------------------ build library/reference records
RECORDS = []
KEY2REC = {}

def heuristics(pat, groups, name):
    low = name.lower()
    t = tier_of_groups(groups)
    flat = {x for g in groups for x in g}
    if pat in ('CARDIO',):
        lc = 'low'
    elif flat & {'barbell', 'hex_bar', 'machine', 'smith', 'squat_rack'}:
        lc = 'high'
    elif flat & {'dumbbell', 'kettlebell', 'cable', 'sandbag', 'landmine', 'ez_bar', 'plate'}:
        lc = 'moderate'
    else:
        lc = 'low'
    sk = {'TX': 'high', 'PLYO': 'moderate', 'COD': 'moderate', 'SPRINT': 'moderate', 'THROW': 'low', 'ANKLE': 'low', 'WARMUP': 'low', 'CARDIO': 'low', 'ARMCARE': 'low'}.get(pat)
    if not sk:
        sk = 'moderate' if (flat & {'barbell', 'hex_bar'} or 'single' in low or 'sl ' in low + ' ' or 'alternating' in low) else 'low'
    imp = {'PLYO': 'moderate', 'ANKLE': 'low', 'SPRINT': 'high', 'COD': 'high'}.get(pat, 'none')
    if pat == 'PLYO' and re.search(r'depth|drop|single|sl |bound|hurdle|tuck|repeat|reverse banded', low + ' '):
        imp = 'high'
    if pat == 'CARDIO' and re.search(r'sprint|run|jack|burpee', low):
        imp = 'low'
    return lc, sk, imp

# [verification 2026-10-08] factual corrections to decoder notes (checked against the dumps)
NOTE_FIX = [
    ("UPPER/LOWER & PPL 'Sqats or Leg Press' 2x12 -> 3x10 -> 4x8",
     "'Sqats or Leg Press' by LEVEL column (not by week): UPPER/LOWER C17/G17/K17 NOVICE 2x12, NEWBY 3x10, INTERMEDIATE 4x8; "
     "PUSH/PULL/LEGS C40/G40/K40 NOVICE 2x8, NEWBY 3x10, INTERMEDIATE 4x8"),
]

def make_record(key, members, prog, byop_prog, newspec=None):
    rec = collections.OrderedDict()
    if members:
        prim = choose_primary(members, key)
        pat = pattern_of(prim)
        tr = TARGET_RAW.get(key)
        # name
        name = None
        for cand in ([tr] if tr else []) + [m['raw'] for m in members]:
            if cand in NAMES:
                name = NAMES[cand]
                break
        if not name:
            name = special_name(prim, members) or tidy(prim.get('decoder_clean') or prim['raw'])
        kinds = [m['kind'] for m in members]
        rtype = prim['kind'] if prim['kind'] in EXK else prim['kind']
        if prim['kind'] == 'program_session':
            rtype = 'conditioning_prescription'
        generic = any(m['raw'] in GENERIC or nkey(m['raw']) in {nkey(g) for g in GENERIC} for m in members)
    else:
        pat = newspec['pat']
        name = newspec['name']
        rtype = newspec.get('rtype', 'exercise')
        generic = rtype == 'generic_exercise'
        if generic:
            rtype = 'exercise'
        prim = None
    P = PAT[pat]
    rec['id'] = None
    rec['name'] = name
    rec['record_type'] = rtype
    rec['generic'] = bool(generic)
    # status
    roles = {m['role'] for m in members}
    in_dd = any(m['in_dropdown'] for m in members)
    if in_dd:
        status = 'live_library_selectable'
    elif roles & {'byop_level_view', 'byop_unwired_column'}:
        status = 'live_library_not_selectable'
    elif 'byop_copy_tab_only' in roles:
        status = 'copy_tab_only'
    elif roles:
        status = 'reference_only'
    else:
        status = 'program_only'
    rec['status'] = status
    rec['aliases'] = []
    seen = set()
    for m in sorted(members, key=lambda m: (ROLE_RANK.get(m['role'], 9), m['tab'], col_row(m['cell'])[1] or 0)):
        sig = (m['workbook'], m['tab'], m['cell'], m['raw'])
        if sig in seen:
            continue
        seen.add(sig)
        a = dict(raw=m['raw'], workbook=m['workbook'], tab=m['tab'], cell=m['cell'], role=m['role'])
        vv = _cell_verbatim(m['workbook'], m['tab'], m['cell'])
        if isinstance(vv, datetime.datetime) and str(m['raw']).startswith('datetime.datetime('):
            a['raw'] = '5-10-5' if (vv.month, vv.day) == (5, 10) else m['raw']
            a['raw_value_stored'] = f"date {vv.date()} (Sheets auto-converted the typed text to a date)"
        elif m['role'] == 'reference_specialty' and isinstance(vv, str) and nkey(strip_urls(vv)) != nkey(m['raw']) and nkey(vv) in nkey(m['raw']):
            a['raw'] = vv
            a['composed_name'] = m['raw']   # decoder joined this cell with its parent row (e.g. ALL ABOUT BALLISTICS C11-C13)
        if isinstance(m.get('raw_value'), dict):
            a['raw_value_stored'] = m['raw_value']
        if m.get('level_raw'):
            a['level_label_verbatim'] = m['level_raw']
        if m.get('category_verbatim'):
            a['category_verbatim'] = m['category_verbatim'] if isinstance(m['category_verbatim'], str) else str(m['category_verbatim'])
        ex = m.get('extra') or {}
        ctx = {k: ex.get(k) for k in ('pace_verbatim', 'sets_verbatim', 'aerobic_band_letter', 'aerobic_colour', 'week', 'day', 'detail_verbatim',
                                       'coach_pattern_description_verbatim', 'force_phase_verbatim', 'ssc_speed_tier', 'start_position') if ex.get(k) not in (None, '', [])}
        if ctx:
            a['context'] = ctx
        mk = skey(m)
        if mk in merge_reason and mk != key:
            a['merged_because'] = merge_reason[mk]
        rec['aliases'].append(a)
    for a in byop_prog + prog:
        rec['aliases'].append({k: v for k, v in a.items() if v not in (None, [], '')})
    # taxonomy
    tax = collections.OrderedDict()
    tax['family'] = P['family']
    tax['region'] = P['region']
    tax['pattern_code'] = pat
    tax['category'] = P['category']
    tax['category_label'] = P['label']
    tax['pattern_label_verbatim'] = PAT_VERBATIM.get(pat)
    if prim:
        tax['category_label_verbatim'] = prim.get('category_verbatim') if isinstance(prim.get('category_verbatim'), str) else None
        tax['sub_pattern'] = prim.get('sub_pattern') if isinstance(prim.get('sub_pattern'), str) else None
        tax['zone_code_verbatim'] = sorted({m['zone_code'] for m in members if isinstance(m.get('zone_code'), str) and m['zone_code'].strip()})
        hdr = (prim.get('extra') or {}).get('effective_header_rows') or (prim.get('extra') or {}).get('column_header_rows') or {}
        if isinstance(hdr, dict):
            r6 = hdr.get('row6')
            r6 = r6.get('value') if isinstance(r6, dict) else r6
            r5 = hdr.get('row5')
            r5 = r5.get('value') if isinstance(r5, dict) else r5
            tax['coach_purpose_row6'] = r6
            tax['coach_row5_label'] = r5
    else:
        tax['sub_pattern'] = None
        tax['zone_code_verbatim'] = []
    sub = tax.get('sub_pattern') or ''
    tax['path'] = ' > '.join([x for x in [P['family'], P['region'] if P['region'] not in (P['family'],) else None, P['label'], sub if sub and sub.upper() != P['label'] else None] if x])
    rec['taxonomy'] = tax
    rec['placements'] = []
    for m in sorted(members, key=lambda m: (ROLE_RANK.get(m['role'], 9), m['tab'], col_row(m['cell'])[1] or 0)):
        rec['placements'].append(dict(workbook=m['workbook'], tab=m['tab'], cell=m['cell'], role=m['role'], pattern_code=pattern_of(m),
                                      category_verbatim=m['category_verbatim'] if isinstance(m['category_verbatim'], str) else None,
                                      level=m.get('level_norm'), level_label_verbatim=m.get('level_raw'),
                                      **({} if m['role'].startswith('byop') else {'level_evidence': ref_level_evidence(m)})))
    # laterality / plane
    lat = (prim or {}).get('laterality') if prim else None
    plane = (prim or {}).get('plane') if prim else None
    if newspec:
        lat = newspec.get('lat') or P['lat']
        plane = newspec.get('plane') or P['plane']
        low = name.lower()
        if not newspec.get('lat'):
            if re.search(r'single|\bsl\b|one arm|one leg|unilateral|\bsa\b', low):
                lat = 'unilateral'
            elif 'alternating' in low or 'seesaw' in low:
                lat = 'alternating'
    rec['laterality'] = lat or P['lat']
    rec['plane'] = plane or P['plane']
    if any('Rotational' in m['raw'] and m['raw'].strip().endswith((' R', ' L')) for m in members) or name.endswith('(R & L)') or name.endswith('(R & L leg)'):
        rec['sides'] = ['R', 'L']
    # level
    rec['level'] = level_info(members, pat) if members else dict(primary='unrated', basis='program-only: the coach gave no level', levels_in_byop=[], levels_all_sources=[],
                                                                reference_levels_observed=[], multi_level_in_byop=False, cross_source_disagreement=False, byop_placements=[], reference_placements=[])
    # muscles
    if prim:
        pm = norm_muscles(prim.get('primary'))
        sm = []
        for m in sorted(members, key=lambda m: ROLE_RANK.get(m['role'], 9)):
            for x in norm_muscles(m.get('secondary')):
                if x not in sm:
                    sm.append(x)
        if not pm:
            pm = list(P['primary'])
    else:
        pm, sm = list(P['primary']), list(P['secondary'])
    sm = [x for x in sm if x not in pm][:8]
    rec['primary_muscles'] = pm
    rec['secondary_muscles'] = sm
    groups = []
    for x in pm:
        g = COACH_GROUP.get(x)
        if g and g not in groups:
            groups.append(g)
    rec['coach_muscle_groups'] = groups
    if P['family'] == 'CARDIO' or not groups:
        size = 'n/a'
    elif set(groups) <= BIG:
        size = 'big'
    elif set(groups) <= SMALL:
        size = 'small'
    else:
        size = 'mixed'
    rec['muscle_size_class'] = size
    ec = (prim or {}).get('exercise_class') if prim else None
    rec['exercise_class'] = ec if ec in ('compound', 'isolation') else P['ex_class']
    rec['volume_counting'] = P['vc']
    # equipment
    egroups, esrc = (None, None)
    if prim and prim['workbook'] == 'BYOP' and prim['tab'] == 'MASTER EXERCISE LIBRARY':
        egroups, esrc = eq_groups_from_enrich(prim['cell'])
    if egroups is None:
        for m in members:
            if m['workbook'] == 'BYOP' and m['tab'] == 'MASTER EXERCISE LIBRARY':
                egroups, esrc = eq_groups_from_enrich(m['cell'])
                if egroups is not None:
                    break
    eq_basis = 'INFERRED (equipment decoder, analysis/equipment)' if egroups is not None else None
    if egroups is None:
        if newspec:
            egroups = _dedupe_setups([[EQ_TOKEN.get(t, t) for t in newspec.get('eq', ['none'])]])
            eq_basis = 'INFERRED (name of the program cell)'
        else:
            dec = []
            for m in members:
                for e in m.get('equipment') or []:
                    if e not in dec:
                        dec.append(e)
            gi = any(nkey(m['raw']) in {nkey(g) for g in GENERIC_IMPL} for m in members)
            egroups = eq_groups_infer(prim['raw'] + ' ' + name, dec, pat, generic=gi)
            eq_basis = 'INFERRED (decoder equipment list + name keywords)'
    egroups = [g for g in egroups if g]
    if pat in ('CT', 'CP', 'CB', 'CORE'):
        egroups = _dedupe_setups([['plate' if t == 'plate_low_target' else t for t in st] for st in egroups])
    tier = tier_of_groups(egroups)
    impl = []
    for g in egroups:
        for t in g:
            if t not in impl:
                impl.append(t)
    enrich = None
    if prim and prim['workbook'] == 'BYOP':
        enrich = EQ.get(('ATH', prim['cell'])) or EQ.get(('RES', prim['cell']))
    rec['equipment'] = collections.OrderedDict(
        implements=impl, setups_any_of=egroups, min_access_tier=tier, min_access_tier_label=TIER_NAME[tier],
        household_substitutions=household(egroups), basis=eq_basis,
        machine_type=machine_type(name, impl),
        substitutes_by_equipment=(enrich.get('substitutes_by_equipment') if enrich else None))
    rec['no_equipment_ok'] = tier == 0
    rec['minimal_kit_ok'] = tier <= 1
    rec['home_weights_ok'] = tier <= 2
    # load / skill / impact
    lc, sk, imp = heuristics(pat, egroups, name)
    if prim:
        rec['load_ceiling'] = prim.get('load_ceiling') or (enrich or {}).get('load_ceiling') or lc
        rec['skill_demand'] = prim.get('skill') or (enrich or {}).get('skill_demand') or sk
        ii = (enrich or {}).get('impact_intensity')
        rec['impact_level'] = ii or prim.get('impact') or imp
    else:
        rec['load_ceiling'], rec['skill_demand'], rec['impact_level'] = lc, sk, imp
    # reps
    rg = None
    if prim:
        for m in sorted(members, key=lambda m: ROLE_RANK.get(m['role'], 9)):
            if m.get('reps_guess'):
                rg = m['reps_guess']
                break
    obs = []
    for a in byop_prog + prog:
        if a.get('sets_raw') is not None or a.get('reps_raw') is not None:
            obs.append(dict(tab=a['tab'], cell=a['cell'], sets=a.get('sets_raw'), reps=a.get('reps_raw'), week=a.get('week'), day=a.get('day'),
                            program=a.get('program'), cues=a.get('cues') or None))
    rg_for_buckets = rg
    if not rg and obs:
        if 'time' in P['unit']:
            # cardio cells mix minutes, seconds, calories and work/rest pairs ('20/40'): quote them, do not turn them into reps
            vals = []
            for o in obs:
                v = re.sub(r'\s+', ' ', str(o.get('reps') or '')).strip()
                if v and v != 'None' and v not in vals:
                    vals.append(v)
            rg = ("as written: " + ' | '.join(repr(v) for v in vals[:8]) + ' (observed in programs; unit per cell)') if vals else None
            rg_for_buckets = None
        else:
            rg, rg_for_buckets = observed_rep_summary(obs)
    bk = buckets_for(rg_for_buckets)
    if pat in ('KEXT',) or (prim and nkey(prim['raw']) == nkey('Leg press')):
        if 'MYO SET' not in bk:
            bk.append('MYO SET')
    rec['typical_rep_range'] = collections.OrderedDict(value=rg, dose_unit=P['unit'], coach_reps_dropdown_buckets=bk,
                                                       basis='INFERRED (decoder guess / observed program doses)', observed_doses=obs[:40],
                                                       observed_doses_total=len(obs))
    # slots
    ws = []
    for m in members:
        if m['in_dropdown']:
            ws += slots_for_cell(m['cell'])
    rec['program_slots'] = summarize_slots(ws)
    cand = P.get('slot')
    rec['candidate_slot_inferred'] = cand if not ws else None
    reach_note = None
    for m in members:
        c, r = col_row(m['cell'])
        if m['in_dropdown'] and c == 'B' and r and r > 122:
            reach_note = "only BOOTCAMP - OPTION 2 rows 7/12/22/27 (range B7:B335) can select it; every other Cardio/Aerobic Capacity slot uses B7:B122"
    if reach_note:
        rec['selectable_note'] = reach_note
    # coach preference
    pref = None
    for cand_raw in ([TARGET_RAW.get(key)] if TARGET_RAW.get(key) else []) + [m['raw'] for m in members]:
        if nkey(cand_raw) in PREF_N:
            pref = PREF_N[nkey(cand_raw)]
            break
    rec['coach_preference'] = pref
    stm = []
    for m in members:
        ex = m.get('extra') or {}
        for k, v in ex.items():
            if k.startswith('coach_') and (k.endswith('verbatim') or k == 'coach_knowledge_status') and v not in (None, '', []):
                stm.append(dict(field=k, verbatim=v, source=f"{m['tab']}!{m['cell']}"))
        cpd = ex.get('coach_pattern_description')
        if isinstance(cpd, dict) and cpd.get('value'):
            stm.append(dict(field='coach_pattern_description', verbatim=cpd['value'], default_dose=cpd.get('default_dose'), source=cpd.get('source')))
        if isinstance(m.get('coach_opinion'), (str, dict)) and m.get('coach_opinion'):
            stm.append(dict(field='coach_opinion', verbatim=m['coach_opinion'], source=f"{m['tab']}!{m['cell']} (decoder field)"))
    uniq = []
    for x in stm:
        if x not in uniq:
            uniq.append(x)
    rec['coach_statements'] = uniq
    # videos
    vids = []
    for m in members:
        if m.get('video_url'):
            vids.append(dict(url=m['video_url'], source=f"{m['tab']}!{m['cell']}"))
    for a in prog:
        for u in a.get('video_urls') or []:
            vids.append(dict(url=u, source=f"{a['tab']}!{a['cell']}"))
    uniq = collections.OrderedDict()
    for v in vids:
        uniq.setdefault(v['url'], v)
    rec['video_urls'] = list(uniq.values())
    # usage
    rec['observed_in_programs'] = sorted({f"{a['workbook']}:{a['tab']}!{a['cell']}" for a in byop_prog + prog})
    rec['observed_in_programs_count'] = len(byop_prog + prog)
    # flags
    fl = []
    for cand_raw in ([TARGET_RAW.get(key)] if TARGET_RAW.get(key) else []) + [m['raw'] for m in members]:
        for f in FLAGS_N.get(nkey(cand_raw), []):
            if f not in fl:
                fl.append(f)
    typos = sorted({m['raw'].strip() for m in members if fix_typos(m['raw']).strip().lower() != m['raw'].strip().lower()})
    if typos:
        fl.append('VERBATIM TYPOS KEPT IN ALIASES: ' + '; '.join(repr(t) for t in typos))
    if rec['level']['cross_source_disagreement']:
        fl.append('LEVEL DIFFERS BY SOURCE: BYOP %s vs OBSERVED reference levels %s (%s)' % (rec['level']['levels_in_byop'],
                  rec['level']['reference_levels_observed'],
                  '; '.join(f"{r['source']} {r['cell']} {r['level']}" for r in rec['level']['reference_placements']
                            if r['level'] in LEVEL_ORDER and r['evidence'].startswith('OBSERVED') and r['level'] not in rec['level']['levels_in_byop'])))
    pats = sorted({p['pattern_code'] for p in rec['placements']})
    if len(pats) > 1:
        fl.append('FILED UNDER SEVERAL PATTERNS: ' + ', '.join(pats))
    rec['flags'] = fl
    # sources / evidence
    rec['sources'] = sorted({m['file'] for m in members} | ({'analysis/programs (MASTER_MODEL program tabs via analysis/equipment/_extract_sessions.py)'} if prog else set())
                            | ({'analysis/library/L4_slot_wiring.md (BYOP program fills)'} if byop_prog else set())
                            | ({esrc} if esrc else set()))
    obsf = ['aliases', 'placements (cells; each reference level carries its own level_evidence)', 'program_slots', 'observed_in_programs',
            'level.byop_placements', 'level.reference_placements (cells/labels; level values only where evidence says OBSERVED)']
    if prim:
        obsf += ['taxonomy.category_label_verbatim', 'taxonomy.zone_code_verbatim', 'taxonomy.coach_purpose_row6', 'level.primary (only when level.basis starts with OBSERVED)']
    if pref:
        obsf.append('coach_preference.label_verbatim/detail_verbatim')
    rec['observed_fields'] = obsf
    inf = ['taxonomy.pattern_code', 'primary_muscles', 'secondary_muscles', 'coach_muscle_groups', 'muscle_size_class', 'exercise_class',
           'equipment', 'no_equipment_ok', 'minimal_kit_ok', 'home_weights_ok', 'load_ceiling', 'skill_demand', 'impact_level', 'typical_rep_range',
           'volume_counting', 'candidate_slot_inferred']
    if not prim or 'laterality' in (prim.get('inferred_fields') or []):
        inf.append('laterality')
    if not prim or 'plane' in (prim.get('inferred_fields') or []):
        inf.append('plane')
    if not members:
        inf += ['name', 'taxonomy', 'level']
    rec['inferred_fields'] = inf
    notes = []
    for m in sorted(members, key=lambda m: ROLE_RANK.get(m['role'], 9))[:3]:
        n = m.get('notes')
        if isinstance(n, list):
            n = ' '.join(str(x) for x in n)
        if n:
            n = str(n)
            for bad, good in NOTE_FIX:
                n = n.replace(bad, good)
            n = n[:400]
            if n not in notes:
                notes.append(n)
    if newspec and newspec.get('notes'):
        notes.append(newspec['notes'])
    rec['notes'] = notes
    rec['_key'] = key
    if newspec:
        rec['_variant_of_ref'] = newspec.get('variant_of')
        rec['_related_ref'] = newspec.get('related')
    return rec

for key, c in clusters.items():
    if key.startswith('sess:'):
        continue
    rec = make_record(key, c['members'], c['prog'], c['byop_prog'])
    RECORDS.append(rec)
    KEY2REC[key] = rec

# Sheet24 sessions -> run-type records
SESS_NAMES = {
 'continuous_distance_run': 'Continuous Distance Run (half-marathon plan)', 'unspecified_pace_distance_workout': "Distance/Pace Workout - not specified ('Workouts involving distances and paces')",
 'split_day_run (a.m. + p.m.)': 'Split-Day Run (a.m. + p.m.)', 'hill_sprints': 'Hill Sprints (8-20 s, full recovery)',
 'progression_run (easy -> moderate -> hard)': 'Progression Run (easy -> moderate -> hard)', 'flat_sprints': 'Flat Sprints (40-80 m, full recovery)',
 'intervals': 'Fast Run Repeats (200 m fast; 150 m fast / 250 m walk)', 'taper_run': 'Taper Run (comfortable pace)', 'race': 'Race Day: Half Marathon (13.1 mi)',
}
for key, c in clusters.items():
    if not key.startswith('sess:'):
        continue
    st = key[5:]
    spec = dict(name=SESS_NAMES.get(st, st), pat='CARDIO', rtype='conditioning_prescription', eq=['open_space_long'],
                notes="Sheet24 'HALF MARATHON PROGRAM by CHRIS HINSHAW ' - 'Program we use for all Blaze Camp Athletes who are looking to run a half marathon.' (borrowed model)")
    rec = make_record(key, [], [], [], newspec=spec)
    rec['status'] = 'reference_only'
    rec['aliases'] = [dict(raw=m['raw'], workbook=m['workbook'], tab=m['tab'], cell=m['cell'], role=m['role'],
                           week=m['extra'].get('week'), day=m['extra'].get('day')) for m in c['members']]
    rec['level']['basis'] = 'Sheet24 gives weeks, not levels'
    rec['sources'] = ['analysis/reference/specialty.json']
    rec['inferred_fields'] = [f for f in rec['inferred_fields'] if f not in ('name', 'taxonomy', 'level')] + ['name (session-type grouping)']
    RECORDS.append(rec)
    KEY2REC[key] = rec

for nk, c in NEWC.items():
    rec = make_record('new:' + nk, [], c['prog'], [], newspec=NEW[nk])
    RECORDS.append(rec)
    KEY2REC['new:' + nk] = rec

# ------------------------------------------------------------------ ids
used = set()
def mkid(rec):
    base = slugify(rec['name'])
    pre = {'modifier': 'mod-', 'taxonomy_placeholder': 'ph-', 'progression_note': 'ph-', 'variant_rule': 'ph-'}.get(rec['record_type'], '')
    i = pre + base
    n = 2
    while i in used:
        i = f"{pre}{base}-{n}"
        n += 1
    used.add(i)
    return i
for rec in RECORDS:
    rec['id'] = mkid(rec)

# complexes
for ck, cx in CX.items():
    rec = collections.OrderedDict()
    comps = []
    for kind, ref, cue in cx['components']:
        r = KEY2REC[ref]
        comps.append(dict(id=r['id'], name=r['name'], cue=cue))
    txt = tidy(strip_urls(cx['prog'][0].get('extracted_as') or cx['prog'][0]['raw']))  # name keeps the row label (ids stay stable)
    rec['id'] = None
    rec['name'] = txt
    rec['record_type'] = {'choice': 'generic_choice'}.get(cx['type'], 'complex')
    rec['complex_type'] = cx['type']
    rec['generic'] = cx['type'] == 'choice'
    rec['status'] = 'program_only'
    rec['components'] = comps
    rec['aliases'] = [{k: v for k, v in a.items() if v not in (None, [], '')} for a in cx['prog']]
    fams = sorted({KEY2REC[ref]['taxonomy']['family'] for _, ref, _ in cx['components']})
    rec['taxonomy'] = dict(family=fams[0] if len(fams) == 1 else 'MIXED', families=fams, pattern_code='COMPLEX', category='complex_' + cx['type'],
                           path=('COMPLEX > ' + cx['type'].upper() + ' > ' + ' + '.join(c['name'] for c in comps))[:300])
    rec['level'] = dict(primary='unrated', basis='program-only combination')
    tiers = [KEY2REC[ref]['equipment']['min_access_tier'] for _, ref, _ in cx['components']]
    t = min(tiers) if cx['type'] == 'choice' else max(tiers)
    rec['equipment'] = dict(min_access_tier=t, min_access_tier_label=TIER_NAME[t], basis='derived from components (choice = easiest option; others = hardest component)')
    rec['no_equipment_ok'] = t == 0
    rec['minimal_kit_ok'] = t <= 1
    rec['home_weights_ok'] = t <= 2
    obs = [dict(tab=a['tab'], cell=a['cell'], sets=a.get('sets_raw'), reps=a.get('reps_raw'), week=a.get('week'), day=a.get('day'), program=a.get('program'))
           for a in cx['prog']]
    rec['typical_rep_range'] = dict(observed_doses=obs, observed_doses_total=len(obs))
    vids = []
    for a in cx['prog']:
        for u in a.get('video_urls') or []:
            vids.append(dict(url=u, source=f"{a['tab']}!{a['cell']}"))
    rec['video_urls'] = vids
    rec['observed_in_programs'] = sorted({f"MASTER_MODEL:{a['tab']}!{a['cell']}" for a in cx['prog']})
    rec['observed_in_programs_count'] = len(cx['prog'])
    rec['sources'] = ['analysis/programs (MASTER_MODEL program tabs via analysis/equipment/_extract_sessions.py)']
    rec['observed_fields'] = ['aliases', 'observed_in_programs', 'typical_rep_range.observed_doses']
    rec['inferred_fields'] = ['components (parsing of the program text)', 'complex_type', 'equipment']
    rec['flags'] = []
    rec['notes'] = []
    rec['_key'] = ck
    rec['id'] = None
    base = 'cx-' + slugify(txt)
    i, n = base, 2
    while i in used:
        i = f"{base}-{n}"
        n += 1
    used.add(i)
    rec['id'] = i
    RECORDS.append(rec)
    KEY2REC[ck] = rec

# related / variant_of links
for rec in RECORDS:
    rel = []
    if rec.get('_variant_of_ref'):
        k = resolve_eq_ref(rec['_variant_of_ref'][1:])
        rel.append(dict(id=KEY2REC[k]['id'], relation='variant_of'))
    if rec.get('_related_ref'):
        k = resolve_eq_ref(rec['_related_ref'][1:])
        rel.append(dict(id=KEY2REC[k]['id'], relation='related'))
    rec['related'] = rel
for rec in RECORDS:
    for r in rec.get('related', []):
        if r['relation'] == 'variant_of':
            tgt = next(x for x in RECORDS if x['id'] == r['id'])
            tgt.setdefault('related', []).append(dict(id=rec['id'], relation='has_variant'))
    if rec.get('record_type') in ('complex', 'generic_choice'):
        for c in rec['components']:
            tgt = next(x for x in RECORDS if x['id'] == c['id'])
            if rec['id'] not in tgt.setdefault('used_in_complexes', []):
                tgt['used_in_complexes'].append(rec['id'])
            for a in rec['aliases']:
                tgt.setdefault('observed_as_component', []).append(dict(tab=a['tab'], cell=a['cell'], program=a.get('program'),
                                                                         complex_text=a['raw'], cue=c.get('cue')))
for rec in RECORDS:
    if not rec.get('aliases') and rec.get('observed_as_component'):
        rec['aliases'] = [dict(raw=o['complex_text'], workbook='MASTER_MODEL', tab=o['tab'], cell=o['cell'], role='program (named inside a complex/choice cell)')
                          for o in rec['observed_as_component']]
    if 'observed_as_component' in rec:
        rec['observed_as_component_count'] = len(rec['observed_as_component'])

# manual related links among library records (INFERRED)
REL = [
 ('Hurdle Hops', 'Bilateral Forward Hurdle Hops ', 'possible_duplicate'), ('Bent Over Barbell Rows', 'Bent Over Rows Pronated Grip', 'possible_duplicate'),
 ('Shoulder Wide Grip Deadlift', 'Barbell Deadlifts', 'possible_duplicate'), ('Depth Drops ', 'Low Depth Drop', 'generic_of'),
 ('Depth Drops ', 'Medium Depth Drop', 'generic_of'), ('Depth Drops ', 'High Depth Drop (above hip)', 'generic_of'),
 ('Back squats', 'High Bar Back Squat', 'generic_of'), ('Back squats', 'Low Bar Back Squat', 'generic_of'),
 ('lat pull down', 'Lat Pulldown Wide Grip', 'generic_of'), ('lat pull down', 'Lat Pulldown Pronated Grip', 'generic_of'),
 ('Pull ups', 'Wide Grip Pull-ups', 'generic_of'), ('Pull ups', 'Chin-ups', 'generic_of'),
 ('machine rows', 'Machine Row Close Grip', 'generic_of'), ('machine rows', 'Machine Row Supinated Grip', 'generic_of'), ('machine rows', 'Machine Row Pronated Grips', 'generic_of'),
 ('assisted pull ups', 'Assisted Pull up w Band', 'generic_of'), ('assisted pull ups', 'Assisted  Pull-Up Machine Close Grip', 'generic_of'),
 ('Staggered stance DL', 'Staggered Stance DL w/ DB ', 'generic_of'), ('Staggered stance DL', 'Staggered Stance DL w/ Barbell', 'generic_of'),
 ('Hip thrusts/ Glute bridges', 'Barbell Hip Thrusts', 'generic_of'), ('Hip thrusts/ Glute bridges', 'Glute Bridges', 'generic_of'),
 ('hip thrust', 'Barbell Hip Thrusts', 'generic_of'), ('hip thrust', 'DB Hip Thrusts', 'generic_of'), ('hip thrust', 'Hip Thrust Machine', 'generic_of'),
 ('lunges', 'Stationary Lunges', 'generic_of'), ('lunges', 'Reverse Lunges ', 'generic_of'), ('lunges', 'Forward  Lunges', 'generic_of'),
 ('Machine Leg Curls', 'Seated leg curls', 'generic_of'), ('Machine Leg Curls', 'Lying Leg Curls', 'generic_of'),
 ('Bd overhead Press', 'Standing DB Press', 'generic_of'), ('Bd overhead Press', 'Incline Seated DB Press', 'generic_of'),
 ('Cosak lateral lunges', 'Side Lunges', 'related'), ('KB swing', 'American kb swing', 'related'),
 ('High Zercher DB Squats ', 'High Zercher Barbell Squats', 'related'), ('Hanging Rotational Knee/Leg Raises', 'Hanging rotational knees to chest', 'progression'),
 ('Push up Stick the Landing', ' Push up Box Jump ', 'progression'), (' Push up Box Jump ', 'Plyo pushups', 'progression'),
 ('BILATERAL REPEAT HOPS', 'Ankle Hops ', 'generic_of'), ('UNILATERAL REPEAT HOPS', 'Single leg ankle hops', 'generic_of'),
 ('BILATERAL JUMP ON TO', 'Low Box Jumps (half shin)', 'generic_of'), ('BILATERAL JUMP ON TO', 'Mid Box Jump (up to knee)', 'generic_of'),
 ('STICK THE LANDING BILATERAL ', 'Low Depth Drop', 'generic_of'), ('STICK THE LANDING BILATERAL ', 'Medium Depth Drop', 'generic_of'),
 ('STICK THE LANDING UNILATERAL', 'SL Depth Drops', 'generic_of'), ('DROP BILATERAL AND JUMP', 'Depth Jumps', 'generic_of'),
 ('BILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP', 'DB Depth drop dbs Jump', 'generic_of'), ('UNILATERAL DROP WEIGHTED, DELOAD WEIGHT & JUMP', 'SL DB depth drop dbs jump', 'generic_of'),
 ('High hang clean pull', 'POWER CLEAN FROM THE HIGH HANG', 'progression'), ('Mid hang clean pull', 'POWER CLEAN FROM THE MID HANG (KNEE)', 'progression'),
 ('Low hang clean pull', 'POWER CLEAN FROM THE LOW HANG (BELLOW KNEE)', 'progression'), ('High hang snatch pull', 'POWER SNATCH FROM THE HIGH HANG', 'progression'),
 ('Mid hang snatch pull', 'POWER SNATCH FROM THE MID HANG (KNEE)', 'progression'), ('Low hang snatch pull', 'POWER SNATCH FROM THE LOW HANG (BELLOW THE KNEE)', 'progression'),
 ('Low Depth Drop', 'Medium Depth Drop', 'progression'), ('Medium Depth Drop', 'High Depth Drop (above hip)', 'progression'),
 ('Low Box Jumps (half shin)', 'Mid Box Jump (up to knee)', 'progression'), ('Ankle Hops ', 'DB Ankle hops', 'progression'),
 ('✅ MACH DRILLS', 'A March', 'generic_of'), ('✅ MACH DRILLS', 'A Skip', 'generic_of'), ('✅ MACH DRILLS', 'A Runs', 'generic_of'),
 ('✅ Acceleration starts', 'Falling start accelerations', 'related'),
]
for a, b, relname in REL:
    if relname == 'skip':
        continue
    try:
        ka, kb = resolve_eq_ref(a), resolve_eq_ref(b)
    except AssertionError:
        continue
    ra, rb = KEY2REC[ka], KEY2REC[kb]
    ra.setdefault('related', []).append(dict(id=rb['id'], relation=relname))
    inv = {'generic_of': 'variant_of_generic', 'progression': 'regression', 'possible_duplicate': 'possible_duplicate', 'related': 'related', 'variant_of': 'has_variant'}[relname]
    rb.setdefault('related', []).append(dict(id=ra['id'], relation=inv))
for rec in RECORDS:
    if 'related' in rec:
        seen = set()
        out = []
        for r in rec['related']:
            sig = (r['id'], r['relation'])
            if sig not in seen and r['id'] != rec['id']:
                seen.add(sig)
                out.append(r)
        rec['related'] = out

# cardio calorie-sprint relations
for nk in ('bike_sprint', 'row_sprint', 'ski_sprint'):
    if 'new:' + nk in KEY2REC:
        for cal in ('10 cals', '15 cals', '20 cals', '25 cals', '30 cals', '35 cals', '40 cals', '45 cals', '50 cals'):
            KEY2REC['new:' + nk].setdefault('related', []).append(dict(id=KEY2REC[resolve_eq_ref(cal)]['id'], relation='modality_for_calorie_option'))

# ------------------------------------------------------------------ crosswalk for every source record
for key, c in clusters.items():
    rid = KEY2REC[key]['id']
    for m in c['members']:
        CROSS.append(dict(source=m['file'], tab=m['tab'], cell=m['cell'], raw=m['raw'], maps_to=rid,
                          how=('merged: ' + merge_reason[skey(m)]) if skey(m) in merge_reason else 'same normalised name' if skey(m) != key else 'cluster root'))
for row in CROSS:
    if 'maps_to_key' in row:
        row['maps_to'] = KEY2REC[row['maps_to_key']]['id'] if row['maps_to_key'] else None
        del row['maps_to_key']

# order: family, pattern, name
FAM_ORDER = {'ATHLETIC': 0, 'RESISTANCE': 1, 'CONTROL': 2, 'FUNCTIONAL': 3, 'CARDIO': 4, 'MODIFIER': 5, 'MIXED': 6}
PAT_ORDER = {p: i for i, p in enumerate(['PLYO', 'ANKLE', 'TX', 'THROW', 'COD', 'SPRINT', 'WARMUP', 'BKD', 'UKD', 'KEXT', 'BHD', 'UHD', 'KFLEX', 'HPULL', 'VPULL',
                                          'HPUSH', 'MRPUSH', 'VPUSH', 'SHLD', 'BIC', 'TRI', 'CALF', 'CT', 'CP', 'CB', 'CORE', 'AOS', 'POS', 'LSS', 'CARRY', 'ARMCARE', 'CARDIO', 'COMPLEX'])}
RT_ORDER = {'exercise': 0, 'test': 0, 'drill': 0, 'conditioning_prescription': 0, 'generic_choice': 1, 'complex': 2, 'modifier': 3, 'progression_note': 4,
            'variant_rule': 4, 'taxonomy_placeholder': 5}
for rec in RECORDS:
    if rec['record_type'] == 'modifier':
        rec['taxonomy']['family'] = 'MODIFIER'
        rec['taxonomy']['pattern_code'] = 'MODIFIER'
RECORDS.sort(key=lambda r: (RT_ORDER.get(r['record_type'], 9), FAM_ORDER.get(r['taxonomy']['family'], 9), PAT_ORDER.get(r['taxonomy'].get('pattern_code'), 99), r['name'].lower()))
for r in RECORDS:
    for k in [k for k in r if k.startswith('_')]:
        del r[k]

dump(RECORDS, SCR + '/catalog_draft.json')
dump(CROSS, SCR + '/crosswalk_draft.json')
dump(NONEX, SCR + '/nonex_draft.json')
print('records', len(RECORDS), collections.Counter(r['record_type'] for r in RECORDS))
print('status', collections.Counter(r['status'] for r in RECORDS))
print('crosswalk rows', len(CROSS), 'nonex', len(NONEX))
