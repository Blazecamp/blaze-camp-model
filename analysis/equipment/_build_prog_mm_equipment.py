# -*- coding: utf-8 -*-
"""Build prog_mm_equipment.json (+ a stats pickle for the markdown writer).

Run from the blaze-camp-model folder:
  .venv/bin/python analysis/equipment/_build_prog_mm_equipment.py
"""
import json, re, sys, os, collections, statistics, itertools
sys.path.insert(0, os.path.dirname(__file__))
from _extract_sessions import extract_all, boxing_medball_list, Sheet
from _classify import classify, norm, TIER_ORDER, has

OUT_JSON = 'analysis/equipment/prog_mm_equipment.json'

TAB_CODE = {'EXAMPLE UPPERLOWER SPLIT': '00', 'EXAMPLE FAT BURNBODY TONING PRO': '01', 'BASEBALL': '02',
            '(NOT DONE) 4 TRACKS PROGRAMMING': '04', 'EXAMPLE ATHLETIC FULL BODY SPLI': '05',
            'EXAMPLE PUSHPULLLEGS SPLIT': '06', 'EXAMPLE BOXING 8 WEEK BUILD UP': '07', 'EXAMPLE CROSSFIT SPLIT': '11',
            '(NOT DONE) EXAMPLE CONJUGATE': '12'}
DAY_ORDER = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY', 'SATURDAY', 'SUNDAY']
POP_GROUP = {'gen_pop': 'GEN POP (novice/newby/intermediate, aesthetics, fat-burn)',
             'strength_powerlifting': 'STRENGTH / POWERLIFTING (conjugate)',
             'athlete': 'ATHLETES (off-season athletic, baseball)',
             'athlete_hybrid': 'HYBRID ATHLETE (strength-athletic-crossfitish)',
             'boxing': 'BOXING / FIGHTER', 'crossfit': 'CROSSFIT'}

def day_idx(d):
    if not d:
        return 99
    d = d.upper()
    for k, x in enumerate(DAY_ORDER):
        if d.startswith(x) or d.startswith(x[:3]):
            return k
    m = re.search(r'WORKOUT (\d+)', d)
    if m:
        return int(m.group(1))
    return 50

def num_sets(it, prev_sets):
    s = it.get('sets_raw')
    if s is None:
        return prev_sets if it.get('paired_with_prev') else None
    m = re.search(r'(\d+)', str(s))
    if re.search(r'accumulate', str(s), re.I):
        return 1
    return int(m.group(1)) if m else None

# ---------------------------------------------------------------- CrossFit components
def classify_crossfit(it):
    comp, val = it['component'], (it['component_value'] or '').upper()
    base = {'implements': [], 'implement_sources': {}, 'coach_alternate': False, 'options': None, 'components': None,
            'notes': ['CROSSFIT tab holds component labels only, no exercises: implement INFERRED from the label'],
            'upper_pattern': None, 'lower_pattern': None}
    def mk(fam, tier, imps, c, v, vl, up=None, lp=None):
        d = dict(base)
        d.update({'family': fam, 'tier': tier, 'implements': imps, 'implement_sources': {i: 'inferred_default' for i in imps},
                  'primary_implement': imps[0] if imps else None, 'constraint_level': c, 'velocity_intent': v,
                  'velocity_label': vl, 'upper_pattern': up, 'lower_pattern': lp})
        from _classify import category_of
        d['implement_category'] = category_of(d['primary_implement'], fam)
        d['name_norm'] = it['name']
        return d
    if comp in ('AEROBIC C.', 'AEROBIC CAPACITY'):
        return mk('cardio_steady', 'CONDITIONING', ['cardio_any'], None, None, 'aerobic')
    if comp in ('SKILL', 'SKILLS'):
        imps = []
        if 'T2B' in val: imps.append('pullup_bar')
        if 'H.S' in val: imps.append('wall')
        if 'DUBS' in val: imps.append('jump_rope')
        if 'GYMNASTICS' in val: imps.append('pullup_bar')
        return mk('gymnastics_skill', 'SKILL', imps or ['bodyweight'], 2, 2, 'skill')
    if comp in ('STRENGTH', 'STRNGTH'):
        up = {'PUSH': 'PUSH (unspecified H/V)', 'PULL': 'PULL (unspecified H/V)', 'PRESS': 'V_PUSH'}.get(val)
        lp = {'KNEE DOM': 'BILATERAL_KNEE', 'HIP DOM': 'BILATERAL_HIP', 'SQUAT': 'BILATERAL_KNEE', 'DEADLIFT': 'BILATERAL_HIP'}.get(val)
        return mk('strength_slot', 'T3_STRENGTH', ['barbell'], 3, 3, 'heavy', up, lp)
    if comp in ('POWER', 'PWR'):
        return mk('olympic_lift', 'T2_POWER_STRENGTH', ['barbell'], 2, 5, 'ballistic_loaded', None, 'BILATERAL_HIP')
    if comp == 'RESISTANCE':
        return mk('resistance_slot', 'T4_RESISTANCE_PATTERN', ['unspecified'], None, 2, 'controlled')
    if comp == 'WODs':
        return mk('wod', 'CONDITIONING', ['mixed (WOD)'], None, 4, 'metabolic')
    if comp == 'TEST/PEAK':
        return mk('test', 'PLACEHOLDER', [], None, None, None)
    return mk('unclassified', 'UNCLASSIFIED', [], None, None, None)

# ---------------------------------------------------------------- per-session sequence metrics
def rankdata(v):
    order = sorted(range(len(v)), key=lambda k: v[k])
    r = [0.0] * len(v)
    k = 0
    while k < len(order):
        j = k
        while j + 1 < len(order) and v[order[j + 1]] == v[order[k]]:
            j += 1
        for t in range(k, j + 1):
            r[order[t]] = (k + j) / 2 + 1
        k = j + 1
    return r

def spearman(x, y):
    if len(x) < 3 or len(set(x)) < 2 or len(set(y)) < 2:
        return None
    rx, ry = rankdata(x), rankdata(y)
    mx, my = statistics.mean(rx), statistics.mean(ry)
    num = sum((a - mx) * (b - my) for a, b in zip(rx, ry))
    den = (sum((a - mx) ** 2 for a in rx) * sum((b - my) ** 2 for b in ry)) ** 0.5
    return round(num / den, 3) if den else None

def seq_metrics(items, exclude_accessory=False, use_effective=False):
    tkey = 'effective_tier' if use_effective else 'tier'
    seq = [(it['pos'], TIER_ORDER[it[tkey]]) for it in items
           if it[tkey] in TIER_ORDER and not (exclude_accessory and it.get('accessory_slot_ballistic'))]
    ranks = [r for _, r in seq]
    pairs = list(itertools.combinations(ranks, 2))
    inv = sum(1 for a, b in pairs if a > b)
    adj_drops = [(seq[k][0], seq[k][1], seq[k + 1][0], seq[k + 1][1]) for k in range(len(seq) - 1) if seq[k + 1][1] < seq[k][1]]
    return {'tier_ranks': ranks, 'n_ranked': len(ranks), 'pair_inversions': inv, 'pairs': len(pairs),
            'concordance': (1 - inv / len(pairs)) if pairs else None,
            'adjacent_drops': len(adj_drops), 'adjacent_drop_positions': adj_drops,
            'monotonic': (len(adj_drops) == 0) if len(ranks) > 1 else None,
            'spearman_position_vs_tier': spearman([p for p, _ in seq], ranks)}

def constraint_metrics(items):
    seq = [(it['pos'], it['constraint_level']) for it in items if it['tier'] in TIER_ORDER and it['constraint_level']]
    drops = [(seq[k][0], seq[k][1], seq[k + 1][0], seq[k + 1][1]) for k in range(len(seq) - 1) if seq[k + 1][1] < seq[k][1]]
    vals = [c for _, c in seq]
    first_half = vals[:len(vals) // 2]
    second_half = vals[len(vals) - len(vals) // 2:]
    return {'constraint_seq': vals, 'adjacent_drops': len(drops), 'drop_positions': drops,
            'spearman_position_vs_constraint': spearman([p for p, _ in seq], vals),
            'monotonic': (len(drops) == 0) if len(vals) > 1 else None,
            'mean_first_half': round(statistics.mean(first_half), 2) if first_half else None,
            'mean_second_half': round(statistics.mean(second_half), 2) if second_half else None}

def hv_test(items):
    res = {}
    for a, b, key in (('H_PULL', 'V_PULL', 'pull'), ('H_PUSH', 'V_PUSH', 'push')):
        ia = [it['pos'] for it in items if it.get('upper_pattern') == a and it['tier'] != 'T1_POWER']
        ib = [it['pos'] for it in items if it.get('upper_pattern') == b and it['tier'] != 'T1_POWER']
        if ia and ib:
            res[key] = 'H_before_V' if min(ia) < min(ib) else ('V_before_H' if min(ib) < min(ia) else 'same_line')
            res[key + '_positions'] = {a: ia, b: ib}
        elif ia:
            res[key] = 'only_H'
        elif ib:
            res[key] = 'only_V'
        else:
            res[key] = 'none'
    return res

def lower_order(items):
    bil = [it['pos'] for it in items if it.get('lower_pattern', '') and it['lower_pattern'].startswith('BILATERAL') and it['tier'] in ('T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN')]
    uni = [it['pos'] for it in items if it.get('lower_pattern', '') and it['lower_pattern'].startswith('UNILATERAL') and it['tier'] in ('T3_STRENGTH', 'T4_RESISTANCE_PATTERN')]
    if bil and uni:
        return 'bilateral_first' if min(bil) < min(uni) else 'unilateral_first'
    return 'only_bilateral' if bil else 'only_unilateral' if uni else 'none'

def compound_iso_order(items):
    comp = [it['pos'] for it in items if it['tier'] in ('T3_STRENGTH', 'T4_RESISTANCE_PATTERN')]
    iso = [it['pos'] for it in items if it['tier'] == 'T5_ISOLATION']
    if comp and iso:
        if max(comp) < min(iso):
            return 'all_compounds_before_isolation'
        if min(iso) < min(comp):
            return 'isolation_first'
        return 'interleaved'
    return 'n/a'

# ---------------------------------------------------------------- load cue catalogue
LOAD_CUES = [
    ('percent_1RM', r'@ ?\d+ ?%|\d+ ?%|60-70%'), ('RPE', r'\brpe\s*\d'), ('RIR', r'\d(-\d)? ?rir|rir'),
    ('HEAVY', r'heavy'), ('light', r'\blight\b'), ('mid weight', r'mid weight'), ('LOAD & jump hard', r'load & jump'),
    ('weighted / with weight', r'weighted|with weight|wighted'), ('no weight', r'no weight|no weigths|bodyweight'),
    ('same speed / fast / max speed', r'same speed|\bfast|max speed|fastest|powerful'), ('slow / eccentric / iso', r'slow|eccentric|iso hold|hold for'),
    ('banded (accommodating/assisted/resisted)', r'band'), ('chains', r'chain'), ('deficit / box / T&G', r'deficit|\(d\)|box squat|t&g|def\.'),
    ('loading position (ipsi/contra/suitcase/front rack/goblet/zercher/double)', r'ipsi|contra|suitcase|front rack|goblet|zercher|double (db|dumb)|double rack|offset|medial pressure'),
    ('max reps / myo / AMRAP', r'max reps|\bmax\b|myo|amrap|unbroken'), ('EASY', r'\beasy\b'), ('test', r'^test$'),
    ('full ROM / 1/4 / range', r'full range|full rom|1/4|rythmic'), ('same weight coupling', r'same weight'),
]

def load_cues(it):
    txt = ' '.join(str(x) for x in (it.get('name'), it.get('reps_raw'), it.get('load_raw'), it.get('sets_raw')) if x)
    hdr = it.get('week_header') or {}
    if not re.search(r'm\.e\.', str(it.get('reps_raw') or ''), re.I):
        hdr = {}   # rows 3-4 (% / RPE) of the 12-week strength columns are read as applying to the M.E. row only (INFERRED)
    out = []
    for lab, pat in LOAD_CUES:
        if re.search(pat, txt, re.I):
            out.append(lab)
    if hdr.get('%') not in (None, 'MID DELOAD'):
        out.append('percent_1RM (week header row 3)')
    if hdr.get('RPE'):
        out.append('RPE (week header row 4)')
    return sorted(set(out))

# ---------------------------------------------------------------- main
def build():
    S, wb = extract_all()
    sessions = []
    for s in S:
        code = TAB_CODE[s['tab']]
        sid = f"{code}|{s['variant']}|{s.get('week_index') and ('wk#' + str(s['week_index']) + ' ') or ''}{s['week']}|{s['day']}"
        prev_sets = None
        items = []
        n = len(s['items'])
        for it in s['items']:
            if s['program'] == 'CROSSFIT SPLIT':
                c = classify_crossfit(it)
            else:
                ctx = {'part': it.get('part'), 'load_raw': it.get('load_raw'), 'reps_raw': it.get('reps_raw')}
                c = classify(it['name'], ctx)
                if it.get('template_only') or (c['tier'] == 'PLACEHOLDER' and it.get('template_name')):
                    c['notes'] = c['notes'] + [f"template cell D{it['row']}: '{it.get('template_name') or it['name']}'"]
            ns = num_sets(it, prev_sets)
            if ns is not None:
                prev_sets = ns
            row = {k: v for k, v in it.items() if k not in ('row',)}
            row.update({
                'rel_pos': round((it['pos'] - 1) / (n - 1), 3) if n > 1 else 0.0,
                'sets_numeric_est': ns,
                'implements': c['implements'], 'implement_sources': c['implement_sources'],
                'primary_implement': c['primary_implement'], 'implement_category': c['implement_category'],
                'coach_alternate': c['coach_alternate'], 'options': c.get('options'), 'components': c.get('components'),
                'family': c['family'], 'tier': c['tier'], 'constraint_level': c['constraint_level'],
                'velocity_intent': c['velocity_intent'], 'velocity_label': c['velocity_label'],
                'upper_pattern': c.get('upper_pattern'), 'lower_pattern': c.get('lower_pattern'),
                'accessory_slot_ballistic': c.get('accessory_slot_ballistic', False),
                'class_notes': c['notes'],
                'load_cues': load_cues(it),
            })
            items.append(row)
        # contrast pairs: a jump/hop line paired (superset) right after a heavy bilateral lower lift
        for k, row in enumerate(items):
            row['effective_tier'] = row['tier']
            row['contrast_pair'] = False
        for k in range(1, len(items)):
            a, b = items[k - 1], items[k]
            if b.get('paired_with_prev') and b['tier'] == 'T1_POWER' and b['family'] in ('plyo_jump_hop', 'jump_squat') \
                    and a['tier'] in ('T2_POWER_STRENGTH', 'T3_STRENGTH') and (a.get('lower_pattern') or '').startswith('BILATERAL'):
                a['effective_tier'] = b['effective_tier'] = 'T2_POWER_STRENGTH'
                a['contrast_pair'] = b['contrast_pair'] = True
        sess = {k: v for k, v in s.items() if k not in ('items',)}
        sess['session_id'] = sid
        sess['tab_code'] = code
        sess['items'] = items
        sess['tier_sequence'] = '-'.join(
            {'T1_POWER': '1', 'T2_POWER_STRENGTH': '2', 'T3_STRENGTH': '3', 'T4_RESISTANCE_PATTERN': '4', 'T5_ISOLATION': '5',
             'CORE': 'C', 'CONDITIONING': 'K', 'WARMUP': 'W', 'PLACEHOLDER': '?', 'SKILL': 'S', 'UNCLASSIFIED': 'U'}[i['tier']] for i in items)
        sess['seq'] = seq_metrics(items)
        sess['seq_excl_accessory_ballistic'] = seq_metrics(items, exclude_accessory=True)
        sess['seq_adjusted'] = seq_metrics(items, exclude_accessory=True, use_effective=True)
        sess['constraint'] = constraint_metrics(items)
        sess['hv'] = hv_test(items)
        sess['lower_order'] = lower_order(items)
        sess['compound_iso_order'] = compound_iso_order(items)
        ranked = [i for i in items if i['tier'] in TIER_ORDER]
        sess['first_ranked_tier'] = ranked[0]['tier'] if ranked else None
        if s['program'] == 'BASEBALL':
            sess['order_basis'] = "OBSERVED: coach's own 'Part A'..'Part E' / 'OPTIONAL PIECE' labels"
        elif s['program'] == 'CROSSFIT SPLIT' and 'monthly' in s['variant']:
            sess['order_basis'] = 'planning grid (component rows, not an execution order) - excluded from order tests'
        elif s['program'] == 'CROSSFIT SPLIT':
            sess['order_basis'] = "header R3:T3 'WARMUP/SKILL' | 'STRENGTH/POWER' | 'WOD' (OBSERVED); order inside STRENGTH/POWER = row order"
        else:
            sess['order_basis'] = 'row order in the sheet (INFERRED to be execution order)'
        sess['has_power'] = any(i['tier'] in ('T1_POWER', 'T2_POWER_STRENGTH') for i in items)
        p_items = [i for i in ranked if i['tier'] in ('T1_POWER', 'T2_POWER_STRENGTH') and not i['accessory_slot_ballistic']]
        r_items = [i for i in ranked if i['tier'] not in ('T1_POWER', 'T2_POWER_STRENGTH')]
        sess['power_block_before_all_resistance'] = (max(i['pos'] for i in p_items) < min(i['pos'] for i in r_items)) if p_items and r_items else None
        sessions.append(sess)
    prog_order = ['UPPER/LOWER', 'PUSH/PULL/LEGS', 'FAT BURN / BODY TONING', '4 TRACKS - AESTHETICS (bodybuilding style)',
                  '4 TRACKS - STRENGTH (conjugate style)', 'CONJUGATE (NOT DONE)', 'ATHLETIC FULL BODY', 'BASEBALL',
                  '4 TRACKS - HYBRID (strength-athletic-crossfitish)', 'BOXING 8 WEEK BUILD UP', 'CROSSFIT SPLIT']
    def wk_num(s):
        if s.get('week_index'):
            return s['week_index']
        m = re.search(r'(\d+)', str(s['week']))
        return int(m.group(1)) if m else 0
    var_seen = {}
    for k, s in enumerate(sessions):
        var_seen.setdefault((s['program'], s['variant']), k)
    sessions.sort(key=lambda s: (prog_order.index(s['program']), var_seen[(s['program'], s['variant'])], wk_num(s), day_idx(s['day'])))
    return sessions, wb

if __name__ == "__main__" and "BUILD" not in os.environ:
    sessions, wb = build()
    print(len(sessions), sum(len(s['items']) for s in sessions))
    c = collections.Counter(i['tier'] for s in sessions for i in s['items'])
    print(c)


# ================================================================ AGGREGATION
UNIT_OF = lambda s: f"{s['program']} :: {s['variant']}"
RANKED = ('T1_POWER', 'T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN', 'T5_ISOLATION')
ALL_TIERS = RANKED + ('CORE', 'CONDITIONING', 'WARMUP', 'SKILL', 'PLACEHOLDER')

def pct(n, d):
    return round(100.0 * n / d, 1) if d else None

def agg(sessions):
    all_sessions = sessions
    items = [i for s in sessions for i in s['items'] if i['tier'] not in ('PLACEHOLDER',)]
    out = {'n_sessions': len(sessions), 'n_items': len(items),
           'n_unique_names': len({norm(i['name']).lower() for i in items})}
    cat = collections.Counter(i['implement_category'] for i in items)
    out['implement_category_pct'] = {k: pct(v, len(items)) for k, v in cat.most_common()}
    out['implement_category_n'] = dict(cat.most_common())
    expl = [i for i in items if i['primary_implement'] and i['implement_sources'].get(i['primary_implement']) == 'explicit']
    out['primary_implement_written_explicitly_pct'] = pct(len(expl), len(items))
    uniq = {}
    for i in items:
        uniq.setdefault(norm(i['name']).lower(), i['implement_category'])
    ucat = collections.Counter(uniq.values())
    out['implement_category_pct_unique_names'] = {k: pct(v, len(uniq)) for k, v in ucat.most_common()}
    allimp = collections.Counter(x for i in items for x in i['implements'])
    out['any_implement_mentions'] = dict(allimp.most_common())
    cons = [i['constraint_level'] for i in items if i['constraint_level'] and i['tier'] in RANKED + ('CORE',)]
    out['constraint_mean'] = round(statistics.mean(cons), 2) if cons else None
    out['constraint_dist_pct'] = {str(k): pct(cons.count(k), len(cons)) for k in (1, 2, 3, 4, 5)} if cons else {}
    tiers = collections.Counter(i['tier'] for i in items)
    out['tier_pct'] = {t: pct(tiers.get(t, 0), len(items)) for t in ALL_TIERS if tiers.get(t)}
    vel = [i['velocity_intent'] for i in items if i['velocity_intent']]
    out['velocity_mean'] = round(statistics.mean(vel), 2) if vel else None
    out['fast_or_ballistic_pct'] = pct(sum(1 for v in vel if v >= 4), len(items))
    out['velocity_label_n'] = dict(collections.Counter(i['velocity_label'] for i in items if i['velocity_label']).most_common())
    sessions = [s for s in sessions if not s.get('order_basis', '').startswith('planning grid')]
    out['n_sessions_in_order_tests'] = len(sessions)
    relpos = collections.defaultdict(list)
    for s in sessions:
        for i in s['items']:
            if len(s['items']) > 1:
                relpos[i['tier']].append(i['rel_pos'])
    out['mean_rel_position_by_tier'] = {t: round(statistics.mean(v), 2) for t, v in relpos.items() if t in ALL_TIERS and v}
    def m(key, sub):
        v = [s[key][sub] for s in sessions if s[key][sub] is not None]
        return v
    mono = m('seq', 'monotonic'); mono2 = m('seq_excl_accessory_ballistic', 'monotonic'); mono3 = m('seq_adjusted', 'monotonic')
    out['sessions_with_2plus_ranked'] = len(mono)
    out['tier_monotonic_pct_raw'] = pct(sum(mono), len(mono))
    out['tier_monotonic_pct_excl_partD_ballistics'] = pct(sum(mono2), len(mono2))
    out['tier_monotonic_pct_adjusted_contrast_pairs'] = pct(sum(mono3), len(mono3))
    conc = m('seq', 'concordance')
    out['pairwise_order_concordance_mean'] = round(statistics.mean(conc), 3) if conc else None
    sp = m('seq', 'spearman_position_vs_tier')
    out['spearman_position_vs_tier_mean'] = round(statistics.mean(sp), 3) if sp else None
    cm = m('constraint', 'monotonic')
    out['constraint_monotonic_pct'] = pct(sum(cm), len(cm))
    spc = m('constraint', 'spearman_position_vs_constraint')
    out['spearman_position_vs_constraint_mean'] = round(statistics.mean(spc), 3) if spc else None
    h1 = m('constraint', 'mean_first_half'); h2 = m('constraint', 'mean_second_half')
    out['constraint_first_half_mean'] = round(statistics.mean(h1), 2) if h1 else None
    out['constraint_second_half_mean'] = round(statistics.mean(h2), 2) if h2 else None
    pw = [s for s in sessions if s['has_power']]
    out['sessions_with_power_items'] = len(pw)
    out['power_item_first_pct'] = pct(sum(1 for s in pw if s['first_ranked_tier'] in ('T1_POWER', 'T2_POWER_STRENGTH')), len(pw))
    pb = [s['power_block_before_all_resistance'] for s in sessions if s['power_block_before_all_resistance'] is not None]
    out['power_block_entirely_before_resistance_pct'] = pct(sum(pb), len(pb))
    for key in ('pull', 'push'):
        out[f'hv_{key}'] = dict(collections.Counter(s['hv'][key] for s in all_sessions))
    out['lower_bilateral_vs_unilateral'] = dict(collections.Counter(s['lower_order'] for s in sessions))
    out['compound_vs_isolation'] = dict(collections.Counter(s['compound_iso_order'] for s in sessions))
    lc = collections.Counter(c for i in items for c in i['load_cues'])
    out['load_cue_item_n'] = dict(lc.most_common())
    out['first_ranked_tier'] = dict(collections.Counter(s['first_ranked_tier'] for s in sessions))
    out['implement_by_tier'] = {t: dict(collections.Counter(i['implement_category'] for i in items if i['tier'] == t).most_common(6)) for t in RANKED}
    out['last_item_tier'] = dict(collections.Counter(s['items'][-1]['tier'] for s in sessions if s['items']))
    return out

def inversion_catalogue(sessions):
    inv = collections.defaultdict(list)
    for s in sessions:
        items = {i['pos']: i for i in s['items']}
        for a, ra, b, rb in s['seq']['adjacent_drop_positions']:
            ia, ib = items[a], items[b]
            k = (s['program'], ia['tier'], ia['family'], ib['tier'], ib['family'])
            inv[k].append({'session': s['session_id'], 'from': f"{ia['cell']} {norm(ia['name'])}", 'to': f"{ib['cell']} {norm(ib['name'])}",
                           'to_part': ib.get('part'), 'to_accessory_slot_ballistic': ib.get('accessory_slot_ballistic'),
                           'contrast_pair': ib.get('contrast_pair')})
    out = []
    for k, v in sorted(inv.items(), key=lambda x: -len(x[1])):
        out.append({'program': k[0], 'from_tier': k[1], 'from_family': k[2], 'to_tier': k[3], 'to_family': k[4],
                    'n': len(v), 'examples': v[:4]})
    return out

def alternates_catalogue(sessions):
    alts = collections.OrderedDict()
    for s in sessions:
        for i in s['items']:
            nm = norm(i['name'])
            two = None
            if '/' in nm and not re.search(r'\d\s*/\s*\d|sec|/ ?core|chest pass', nm, re.I):
                parts = [p.strip() for p in nm.split('/') if p.strip()]
                if len(parts) == 2:
                    a, b = classify(parts[0]), classify(parts[1])
                    if a['family'] == b['family'] and a['tier'] not in ('PLACEHOLDER', 'UNCLASSIFIED'):
                        two = parts
            special = None
            if re.search(r'hyper-extension machine - kb swings', nm, re.I):
                special = 'ambiguous: alternate OR superset written with " - "'
            if re.search(r'walk back or 3 min walk', nm, re.I):
                special = 'recovery-mode alternative (not equipment)'
            if two and re.match(r'^\d+\s*/\s*\d+$', str(i.get('reps_raw') or '').strip()) and i['family'] in ('core',):
                two = None   # 'Situps / Toes to bar' 15/10 -> both are done (pair), not an alternate
                special = 'paired movements (reps split by "/")'
            if not (i['coach_alternate'] or two or special):
                continue
            key = nm.lower()
            if key not in alts:
                opts = i['options'] or two or [nm]
                kind = 'free choice'
                if special:
                    kind = special
                elif re.search(r'clean pull/ hang power clean', nm, re.I):
                    kind = 'ambiguous: alternate OR complex (two Olympic derivatives)'
                elif two:
                    kind = 'slash alternate (same movement family)'
                elif i['options']:
                    o_imps = [classify(o)['primary_implement'] for o in i['options']]
                    o_fams = [classify(o)['family'] for o in i['options']]
                    if len(set(o_fams)) == 1 and len(set(o_imps)) > 1:
                        kind = 'implement swap (same movement)'
                    elif len(set(o_imps)) == 1 and len(set(o_fams)) == 1:
                        kind = 'variant swap (same implement)'
                    else:
                        kind = 'exercise swap (different movement/implement)'
                alts[key] = {'text_verbatim': nm, 'kind': kind, 'options': opts,
                             'option_primary_implements': [classify(o)['primary_implement'] for o in opts] if opts else None,
                             'option_constraint_levels': [classify(o)['constraint_level'] for o in opts] if opts else None,
                             'cells': [], 'programs': set(), 'tier': i['tier']}
            alts[key]['cells'].append(f"{s['tab_code']}:{i['cell']}")
            alts[key]['programs'].add(s['program'])
    out = []
    for v in alts.values():
        v['programs'] = sorted(v['programs'])
        v['n_occurrences'] = len(v['cells'])
        v['cells'] = sorted(set(v['cells']))
        out.append(v)
    return out

def rotations(sessions):
    """Same row / same slot, different exercise across weeks -> the coach's within-slot substitution habits."""
    out = []
    groups = collections.defaultdict(list)
    for s in sessions:
        if s['program'] in ('BASEBALL',):
            # slot = (block, day, part, index within part)
            idx = collections.Counter()
            for i in s['items']:
                idx[i.get('part')] += 1
                groups[(s['program'], s['variant'], s['day'], i.get('part'), idx[i.get('part')])].append((s.get('week_index'), s['week'], i))
        elif s['program'] in ('CROSSFIT SPLIT', 'UPPER/LOWER', 'PUSH/PULL/LEGS', 'ATHLETIC FULL BODY'):
            continue
        else:
            for i in s['items']:
                row = int(re.sub(r'[A-Z]+', '', i['cell']))
                groups[(s['program'], s['variant'], s['day'], 'row', row)].append((None, s['week'], i))
    for k, v in groups.items():
        v = sorted(v, key=lambda x: (x[0] or 0))
        names = [norm(x[2]['name']) for x in v]
        if len(set(n.lower() for n in names)) < 2:
            continue
        imps = [x[2]['primary_implement'] for x in v]
        out.append({'program': k[0], 'variant': k[1], 'day': k[2], 'slot': f"{k[3]}#{k[4]}",
                    'sequence': [f"{x[1]}: {norm(x[2]['name'])} [{x[2]['primary_implement']}, c{x[2]['constraint_level']}, {x[2]['tier']}]" for x in v],
                    'distinct_names': len(set(n.lower() for n in names)),
                    'distinct_primary_implements': sorted({str(i) for i in imps}),
                    'implement_changes_across_weeks': len(set(str(i) for i in imps)) > 1,
                    'tiers': sorted({x[2]['tier'] for x in v})})
    return out

def load_prescription_catalogue(sessions):
    rows = collections.OrderedDict()
    for s in sessions:
        for i in s['items']:
            for cue in i['load_cues']:
                k = (cue, i['implement_category'])
                r = rows.setdefault(k, {'cue': cue, 'implement_category': i['implement_category'], 'n': 0, 'tiers': collections.Counter(),
                                        'programs': set(), 'examples': []})
                r['n'] += 1
                r['tiers'][i['tier']] += 1
                r['programs'].add(s['program'])
                ex = f"{s['tab_code']}:{i['cell']} '{norm(i['name'])}'" + (f" reps='{i.get('reps_raw')}'" if i.get('reps_raw') else '') + \
                     (f" load='{i.get('load_raw')}'" if i.get('load_raw') else '')
                if len(r['examples']) < 6 and ex not in r['examples']:
                    r['examples'].append(ex)
    out = []
    for r in rows.values():
        r['programs'] = sorted(r['programs'])
        r['tiers'] = dict(r['tiers'])
        out.append(r)
    out.sort(key=lambda r: (r['cue'], -r['n']))
    return out

NOTE_CELLS = [
    ('EXAMPLE UPPERLOWER SPLIT', ['A4', 'A5', 'A6', 'A7']),
    ('EXAMPLE PUSHPULLLEGS SPLIT', ['A7']),
    ('EXAMPLE ATHLETIC FULL BODY SPLI', ['A3', 'A4', 'A5', 'A6', 'A41', 'A42', 'A43', 'A44', 'A45', 'K13']),
    ('EXAMPLE CROSSFIT SPLIT', ['A4', 'A5', 'A6', 'R2', 'R3', 'S3', 'T3', 'A20', 'B20', 'C20', 'A21', 'A22', 'B21', 'B22', 'B23', 'B24',
                                'C21', 'C22', 'C23', 'C24', 'R21', 'R22', 'R23', 'R24', 'R25', 'S21', 'S22', 'S23', 'S24']),
    ('BASEBALL', ['A19', 'B19', 'C19', 'E19', 'A20', 'B20', 'C20', 'E20', 'F20', 'A21', 'B21', 'C21', 'E21', 'F21', 'A22', 'B22', 'C22', 'E22', 'F22']),
    ('(NOT DONE) 4 TRACKS PROGRAMMING', ['A1', 'A2', 'C3', 'N3', 'U3', 'C30', 'C69', 'N9', 'N11', 'N15', 'N17', 'N21', 'D35']),
    ('(NOT DONE) EXAMPLE CONJUGATE', ['F2', 'M13', 'M14', 'M15', 'M16', 'D13', 'D14', 'D15', 'D16', 'D21']),
    ('EXAMPLE BOXING 8 WEEK BUILD UP', ['A1', 'F50']),
    ('(NOT DONE) ALL ABOUT BALLISTICS', ['A2', 'A4', 'A22', 'D22', 'A23', 'D23', 'A24', 'B24', 'C24', 'D24']),
]

def notes_catalogue(wb):
    out = []
    for tab, cells in NOTE_CELLS:
        sh = Sheet(wb[tab])
        for c in cells:
            m = re.match(r'([A-Z]+)(\d+)', c)
            v = sh.v(int(m.group(2)), m.group(1))
            if v:
                out.append({'tab': tab, 'cell': c, 'text_verbatim': v, 'evidence': 'OBSERVED'})
    return out

def main():
    sessions, wb = build()
    units = collections.OrderedDict()
    for s in sessions:
        units.setdefault(UNIT_OF(s), []).append(s)
    programs = collections.OrderedDict()
    for s in sessions:
        programs.setdefault(s['program'], []).append(s)
    pops = collections.OrderedDict()
    for s in sessions:
        pops.setdefault(s['population'], []).append(s)
    res = {
        'meta': {
            'title': 'MASTER MODEL program tabs - equipment usage, constraint, velocity intent and session sequencing',
            'source': 'raw/MASTER_MODEL.xlsx (read-only, openpyxl); dumps/MASTER_MODEL/*.txt used for cross-checks',
            'tabs': sorted({s['tab'] for s in sessions}),
            'skipped': ["'Copy of BASEBALL' (identical to 'BASEBALL')"],
            'item_evidence': 'name, sets_raw, reps_raw, load_raw, part, slot, cell = OBSERVED; implements, implement_category, constraint_level, velocity_*, tier, family, patterns, load_cues = INFERRED (rules in _classify.py)',
            'evidence_legend': {'OBSERVED': 'value/label read from a cell (tab + cell given)',
                                'INFERRED': 'analyst classification by rule (see _classify.py)',
                                'SCIENCE': 'general training-science rationale, not from the sheet'},
            'constraint_scale': {
                '5': 'seated/lying, pad-supported, machine-guided path (leg press, leg ext/curl, machine row, machine dips/flies)',
                '4': 'guided OR supported: cable stations & cable isolation, Smith, lat pulldown, chest-supported/bench-supported free weight (seal row, preacher, floor skull crusher, tate press), 45-deg hyperextension, floor-supported core',
                '3': 'free weight bilateral with stable stance (barbell/hex/DB/KB squat, deadlift, bench, OHP, rows, curls, raises), pull-ups/push-ups/dips, planks',
                '2': 'low-constraint free weight: unilateral/split/staggered/offset/single-arm/half-kneeling, carries, swiss ball/slider, Olympic lifts, KB swings, push press/jerk, hanging & rotational core',
                '1': 'bodyweight ballistic/reactive: jumps, hops, bounds, depth drops, sprints & A-drills, medball throws/slams, plyo push-ups (incl. light DB/hex-loaded jumps)'},
            'velocity_scale': {'5': 'ballistic / max intent (throws, jumps, sprints, Oly, swings, push press, contrast)',
                               '4': 'fast concentric with load or speed drill (FAST/same speed/banded DE, fast runners, powerful turns, A-skip/run)',
                               '3': 'heavy / max effort (HEAVY, 1RIR main lifts, heavy max reps); A-march technique drill',
                               '2': 'controlled resistance (RIR-based hypertrophy/strength-endurance)',
                               '1': 'slow / isometric / eccentric (planks, holds, carries, slow tempo, iso holds)'},
            'tiers': {'T1_POWER': 'unloaded/light ballistic: medball, plyo, sprint, A-drills, depth drops, plyo push-ups',
                      'T2_POWER_STRENGTH': 'loaded ballistic & speed-strength: Olympic lifts & derivatives, KB swings/cleans, push press/jerk, loaded jumps, contrast complexes, dynamic-effort (FAST/banded/chained/same-speed) lifts',
                      'T3_STRENGTH': 'barbell/hex (or HEAVY-labelled) compound main lifts',
                      'T4_RESISTANCE_PATTERN': 'other compound patterns: DB/KB/cable/machine/bodyweight compounds, all unilateral lower-body work, leg press/Smith',
                      'T5_ISOLATION': 'single-joint work (curls, extensions, raises, flies, leg ext/curl, calf raises, slider/swiss-ball hamstring)',
                      'CORE': 'control patterns / core (planks, anti-rotation, rotation, hanging core)',
                      'CONDITIONING': 'cardio, sprint intervals, buy-outs, circuits', 'WARMUP': 'warm-up cardio / mobility',
                      'SKILL': 'CrossFit skill slot (T2B, DUBS, H.S.)', 'PLACEHOLDER': "non-exercise cells ('ACCESSORIES', 'DELOAD', 'TEST', 'none')"},
            'claim_tested': 'power first (medball/plyo/sprint) -> power-strength (oly, contrast, loaded jumps) -> strength (heavy barbell/hex) -> resistance patterns (DB/KB/cable) -> isolation (machines/cables)',
            'sequence_metric_notes': [
                'Only T1-T5 items enter the order tests; CORE, CONDITIONING, WARMUP, SKILL, PLACEHOLDER are reported by position only.',
                "'monotonic' = no adjacent drop in tier rank; 'concordance' = share of all item pairs (i<j) with rank_i <= rank_j.",
                "'excl_partD_ballistics' drops BASEBALL Part D ballistic accessories (ankle hops, hurdle hops, DB snatch in the calf/shoulder slot).",
                "'adjusted' also re-tiers a jump paired straight after a heavy bilateral lift (e.g. 'Barbell deadlift' + 'Broad jumps') as one T2 contrast pair.",
                'Row order is treated as execution order. That is OBSERVED for BASEBALL (Part A-E) and INFERRED elsewhere.'],
            'counting_unit': 'line item = one exercise cell in one session column; repeated weeks/levels are counted each time they are written',
        },
        'sessions': sessions,
        'units': {k: agg(v) for k, v in units.items()},
        'programs': {k: agg(v) for k, v in programs.items()},
        'populations': {k: dict(agg(v), label=POP_GROUP.get(k, k), programs=sorted({s['program'] for s in v})) for k, v in pops.items()},
        'inversions': inversion_catalogue(sessions),
        'alternates': alternates_catalogue(sessions),
        'rotations': rotations(sessions),
        'load_prescriptions': load_prescription_catalogue(sessions),
        'coach_notes': notes_catalogue(wb),
        'boxing_medball_list': boxing_medball_list(wb),
    }
    # exercise dictionary
    ed = collections.OrderedDict()
    for s in sessions:
        for i in s['items']:
            k = norm(i['name']).lower()
            d = ed.setdefault(k, {'name_verbatim': norm(i['name']), 'tier': i['tier'], 'family': i['family'],
                                  'primary_implement': i['primary_implement'], 'implement_category': i['implement_category'],
                                  'implements': i['implements'], 'implement_sources': i['implement_sources'],
                                  'constraint_level': i['constraint_level'], 'velocity_intent': i['velocity_intent'],
                                  'velocity_label': i['velocity_label'], 'upper_pattern': i['upper_pattern'],
                                  'lower_pattern': i['lower_pattern'], 'coach_alternate': i['coach_alternate'],
                                  'options': i['options'], 'n': 0, 'programs': set(), 'cells': []})
            d['n'] += 1
            d['programs'].add(s['program'])
            if len(d['cells']) < 8:
                d['cells'].append(f"{s['tab_code']}:{i['cell']}")
    for d in ed.values():
        d['programs'] = sorted(d['programs'])
    res['exercise_dictionary'] = list(ed.values())
    with open(OUT_JSON, 'w') as f:
        json.dump(res, f, indent=1, default=lambda o: sorted(o) if isinstance(o, set) else str(o), ensure_ascii=False)
    return res

if __name__ == '__main__' and 'BUILD' in os.environ:
    main()
