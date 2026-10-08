# -*- coding: utf-8 -*-
"""02_no_equipment_subset.md - which catalog items qualify for NO ACCESS (bodyweight / minimal) per BYOP slot, and the gaps."""
import re, collections
from common import *
from vocab import TIER_NAME

R = load(OUT + '/02_exercise_catalog.json')
EXT = ('exercise', 'drill', 'test', 'conditioning_prescription')
EX = [r for r in R if r['record_type'] in EXT and r['record_type'] != 'modifier']

def esc(s):
    return str(s).replace('|', '/').replace('\n', ' ')

def table(headers, rows):
    out = ['| ' + ' | '.join(headers) + ' |', '|' + '|'.join(['---'] * len(headers)) + '|']
    for r in rows:
        out.append('| ' + ' | '.join(esc(x) for x in r) + ' |')
    return '\n'.join(out)

def lv(r):
    return r['level']['primary']

def setup_str(r):
    st = r['equipment'].get('setups_any_of') or []
    best = sorted(st, key=lambda s: max([{'none': 0}.get(t, 0) for t in s] or [0]))
    return ' | '.join('+'.join(s) for s in st)

# Slot definitions (OBSERVED ranges and labels from L4_slot_wiring.md; candidate patterns INFERRED)
SLOTS = [
 ('Plyo', 'Plyo / Plyo|PLYO', ['G7:G162'], ['PLYO', 'ANKLE'], 'ATHLETIC, JUSTICE LEAGUE, NO ACCESS - ATHLETIC (6 per week)'),
 ('Throwing', 'Throwing / Throwing', ['K7:K87'], ['THROW'], 'athletic tabs (4 per week)'),
 ('COD', 'COD / COD', ['L7:L242'], ['COD'], 'athletic tabs (4 per week)'),
 ('Tripple Extension', 'Tripple Extension / Tripple Extension', ['C7:C242'], ['TX', 'ANKLE'], 'athletic tabs (4 per week)'),
 ('Cardio / Aerobic Capacity', "Cardio or Aerobic Capacity / (none)", ['B7:B122', 'B7:B335'], ['CARDIO', 'SPRINT'], '8 tabs (B7:B122); BOOTCAMP - OPTION 2 rows 7/12/22/27 (B7:B335)'),
 ('Core', 'Core / (none)', ['O7:O283'], ['CT', 'CP', 'CB', 'CORE', 'AOS'], '8 tabs (optional / conditioning days)'),
 ('Vertical Pull', "Back / Vertical Pull", ['U7:U122'], ['VPULL'], '9 tabs'),
 ('Horizontal Pull', "Back / Horizontal Pull", ['X7:X162'], ['HPULL'], '9 tabs'),
 ('Vertical Push', 'Chest/Shoulders / Vertical Push', ['AA7:AA122'], ['VPUSH'], '9 tabs'),
 ('Horizontal Push (+ PPL Incline, Flies, Dips)', 'Chest / Horizontal Push|Incline|Flies|Dips', ['AD7:AD162'], ['HPUSH', 'MRPUSH'], '9 tabs'),
 ('ABdution (+ PPL Reverse Flies)', 'Shoulders/Traps / ABdution|Reverse Flies', ['AH7:AH42'], ['SHLD'], '8 tabs'),
 ('Bilateral KD', 'Quads / Bilateral KD', ['AI7:AI122'], ['BKD'], '9 tabs'),
 ('Unilateral KD', 'Quads/Glutes / Unilateral KD', ['AL7:AL42'], ['UKD'], '9 tabs'),
 ('Leg Extensions', 'Quads / Leg Extensions', ['AM7:AM9'], ['KEXT'], '7 tabs'),
 ('Bilateral HD', 'Hamstring / Bilateral HD', ['AN7:AN122'], ['BHD'], '9 tabs'),
 ('Unilateral HD', 'Hamstring/Glutes / Unilateral HD', ['AQ7:AQ42'], ['UHD'], '7 tabs (the 2 NO ACCESS tabs are miswired to AR7:AR42 LEG CURLS)'),
 ('Leg Curls', 'Hamstrings / Leg Curls', ['AR7:AR10', 'AR7:AR42'], ['KFLEX'], '8 tabs'),
 ('Bicep', 'Bicep / Bicep', ['AS7:AS42'], ['BIC'], '5 tabs'),
 ('Tricep (+ PPL Push / Overhead)', 'Tricep / (none)|Tricep|Push|Overhead', ['AT7:AT42'], ['TRI'], '5 tabs'),
 ('Calves', 'Calves / Calves|(none)', ['AU7:AU13'], ['CALF'], '7 tabs'),
 ('Focus 1 / Focus 2', 'Focus 1|Focus 2 / (none)', ['AZ7:AZ335'], None, '8 tabs (optional days; PPL legs day)'),
]
# Extra out-of-dropdown candidates that train the slot's job (INFERRED, by name)
EXTRA = {
 'Leg Curls': r'hamstring curl|nordic|hamstring runner|leg curl|swiss ball kick|rolling hamstring',
 'Leg Extensions': r'leg extension|sissy squat|reverse nordic',
 'Bicep': r'curl(?!.*(hamstring|leg))',
 'Tricep (+ PPL Push / Overhead)': r'tricep|triceps|skullcrusher|diamond|bench dip|close-hand',
 'Calves': r'calf raise|ankle hop|jump rope|double-under',
}

def extra_match(label, r):
    n = r['name'].lower()
    if label == 'Leg Curls':
        return bool(re.search(r'hamstring curl|nordic|hamstring runner|leg curl|swiss ball kick|rolling hamstring', n))
    if label == 'Leg Extensions':
        return bool(re.search(r'leg extension|sissy squat|reverse nordic', n))
    if label == 'Bicep':
        return bool(re.search(r'curl', n)) and not re.search(r'hamstring|leg curl|route|nordic', n)
    if label.startswith('Tricep'):
        return bool(re.search(r'tricep|skullcrusher|diamond|bench dip|close-hand', n))
    if label == 'Calves':
        return bool(re.search(r'calf raise|ankle hop|jump rope|double-under', n))
    return False

def in_slot(r, ranges):
    return any(s['library_range'] in ranges for s in r.get('program_slots', []))

md = []
A = md.append
A('# 02 - NO ACCESS / no-equipment subset of the catalog')
A('')
A('**Source:** `synthesis/02_exercise_catalog.json` (equipment set-ups and tiers per record; BYOP dropdown wiring per record). Read-only - no Google Sheet was modified.')
A('')
A('## 0. What "NO ACCESS" means here')
A('')
A("**OBSERVED:** the two hidden tabs 'NO ACCESS - AESTHETICS - FB - 4' and 'NO ACCESS - ATHLETIC - FB - 4 t' are *not* equipment-filtered. Their 88 exercise dropdowns read exactly the same library ranges as AESTHETICS / ATHLETIC, except that the 'Hamstring/Glutes' / 'Unilateral HD' slots (E12/E33 in the aesthetics copy, E19/E46 in the athletic copy) point at `AR7:AR42` (LEG CURLS: 'Seated leg curls', 'Lying Leg Curls') instead of `AQ7:AQ42` - so as wired they are the *most* machine-dependent templates (equipment decode, `analysis/equipment/prog_byop_equipment.md` section 8). The only exercise pre-typed in the athletic copy is 'Leg extensions' (a machine).")
A('')
A('**This file therefore answers the question the brief asks** - *if* NO ACCESS means no gym / bodyweight-minimal, which catalog items qualify for each program slot, and where are the holes. The tier definitions are INFERRED:')
A('')
A(table(['tier', 'kit', 'examples of what it unlocks'], [
 ['T0', 'bodyweight + household: floor, wall, stairs / sturdy chair or bench / couch, open space (yard, road, park), towel or paper plate as a slider, a book or tape line as a hop target, a pillow or ball to squeeze', 'push-ups, lunges, step-ups, glute bridges, ankle hops, depth drops off a step, sprints, routes, planks'],
 ['T1', 'minimal kit: resistance bands + mini-bands + door anchor, doorway pull-up bar, jump rope, suspension trainer (TRX/rings), low hurdles / cones, foam roller', 'pull-ups, band-assisted pull-ups, TRX rows/curls, banded leg extensions, hurdle hops, Pallof holds, hanging core'],
 ['T2', 'home light weights: dumbbells, kettlebells, medball / slam ball, stability ball, sandbag, weight plate, adjustable weight bench, dip station, high plyo box (above knee height; low boxes / steps count as T0)', 'DB/KB presses, rows, deadlifts, goblet squats, medball throws, KB swings'],
 ['T3', 'gym: barbell + rack, EZ / hex bar, landmine, cable stack, machines, Smith, GHD / hyper / reverse hyper, seal bench, chains, bike / rower / ski erg', 'barbell lifts, Olympic lifts, cable and machine work, calorie sprints'],
]))
A('')
A("Household substitutions are listed per record in `equipment.household_substitutions` (e.g. 'box: stairs / sturdy step or bench (low heights only)'). SCIENCE / safety note: plyometric landings and depth drops off household furniture are only acceptable at low heights on a stable surface; anything above knee height needs a real plyo box (tier T2).")
A('')

summary = []
details = []
for label, slotlab, ranges, pats, where in SLOTS:
    dd = [r for r in EX if in_slot(r, ranges)]
    by = collections.defaultdict(list)
    for r in dd:
        by[r['equipment']['min_access_tier']].append(r)
    # out-of-dropdown candidates
    cand = []
    if pats:
        for r in EX:
            if r in dd:
                continue
            if r['taxonomy'].get('pattern_code') in pats or extra_match(label, r):
                if r['equipment']['min_access_tier'] <= 1:
                    cand.append(r)
    t0, t1, t2, t3 = (len(by[i]) for i in range(4))
    gap0 = 'GAP' if t0 == 0 else 'ok'
    gap1 = 'GAP' if (t0 + t1) == 0 else 'ok'
    c0 = sum(1 for r in cand if r['equipment']['min_access_tier'] == 0)
    c1 = sum(1 for r in cand if r['equipment']['min_access_tier'] == 1)
    summary.append([label, ', '.join(ranges), len(dd), t0, t1, t2, t3, gap0, gap1, c0, c1])
    details.append((label, slotlab, ranges, where, dd, by, cand))

A('## 1. Summary: options per slot by tier')
A('')
A('Counts are distinct catalog records reachable from the slot\'s dropdown (OBSERVED wiring). "Outside" = catalog records that do the same job but no dropdown offers them (reference-tab or program-only items, or items filed in another column) - candidates to add for a home / NO ACCESS version.')
A('')
A(table(['slot', 'range', 'options', 'T0', 'T1', 'T2', 'T3 only', 'T0 viable?', 'T0-T1 viable?', 'outside T0', 'outside T1'], summary))
A('')
gaps0 = [s[0] for s in summary if s[7] == 'GAP']
gaps1 = [s[0] for s in summary if s[8] == 'GAP']
A('**Slots with no bodyweight / household option inside their dropdown (T0 gaps):** ' + (', '.join(gaps0) if gaps0 else 'none') + '.')
A('')
A('**Slots with no option even with a minimal kit (T0-T1 gaps):** ' + (', '.join(gaps1) if gaps1 else 'none') + '.')
A('')

A('## 2. Gap analysis and fixes (INFERRED)')
A('')
for label, slotlab, ranges, where, dd, by, cand in details:
    t0 = by[0]
    t01 = by[0] + by[1]
    cand0 = [r for r in cand if r['equipment']['min_access_tier'] == 0]
    cand1 = [r for r in cand if r['equipment']['min_access_tier'] == 1]
    if not t0:
        fix = ', '.join(f"{r['name']} (T{r['equipment']['min_access_tier']}, {r['status'].replace('_', ' ')})" for r in (cand0 + cand1)[:12]) or 'nothing in the whole catalog'
        A(f"- **{label}** - no T0 option in `{' / '.join(ranges)}`" + (f"; T1 inside the dropdown: {', '.join(r['name'] for r in by[1])}" if by[1] else '; no T1 option either') + f". Catalog items outside the dropdown that could fill it at T0/T1: {fix}.")
A('')
A('')
A('Ideas that are NOT in the coach\'s sheets (INFERRED / general practice, flagged so the coach can accept or reject them): Vertical Pull at T0 - none realistic (a doorway bar or band is the minimum); Horizontal Pull at T0 - inverted row under a sturdy table, towel / door-frame row; ABdution at T0-T1 - band lateral raises, band pull-aparts, prone floor Y/T raises (bodyweight form of RP \'Bench incline DB ys/Ts\'); Bicep at T0 - towel isometric curls (weak stimulus), so a band (T1) is the practical minimum; Tricep at T0 - diamond push-ups (AD93) and bench dips; Leg Extensions at T0 - sissy squat (AI100) or reverse Nordic; Leg Curls at T0 - slider / towel hamstring curls (AN18) and Nordic curls (AN91); Throwing - a medball (T2) is the minimum, or the coach\'s own \'FAKE MEDBALL SLAM & RETURN ANY WAY POSSIBLE\' (BALLISTICS C46) as a stop-gap.')
A('')
A("Two structural gaps the catalog cannot fill from the coach's own material: **Throwing at T0/T1** (every throw needs a medball or slam ball - the nearest no-equipment stand-ins would be bodyweight rotational drills such as 'Hip Turns' or band chops, which change the quality from ballistic to control; recommendation: treat a medball as the minimum kit for athletic clients) and **Leg Curls / Leg Extensions inside their own dropdowns** (`AR7:AR10` and `AM7:AM9` hold machines only; the coach's own non-machine alternatives - 'banded leg extensions on bench', 'DB leg extensions on box' (RESISTANCE PATTERNS A40/A41), 'Supine Glidder hamstring curls' (AN18), 'Nordic Curls' (AN91), slider hamstring runners and banded rolling hamstring curls (BASEBALL) - exist but are filed elsewhere).")
A('')
_aq = [r['name'] for r in EX if in_slot(r, ['AQ7:AQ42']) and r['equipment']['min_access_tier'] == 0]
A("Template-level consequence: in both NO ACCESS tabs the B-day 'Unilateral HD' slot is wired to LEG CURLS (machine only), so as built those days have **two machine-only hamstring slots and zero single-leg hinge**. Re-pointing E12/E33 (aesthetics copy) and E19/E46 (athletic copy) to `AQ7:AQ42` gives %d T0 options (%s) plus DB/barbell staggered-stance deadlifts." % (len(_aq), ', '.join(_aq)))
A('')

A('## 3. Slot-by-slot options (every record)')
A('')
for label, slotlab, ranges, where, dd, by, cand in details:
    A(f"### {label}")
    A('')
    A(f"Slot label(s) (OBSERVED): `{slotlab}`; range(s): `{', '.join(ranges)}`; used in: {where}. Options in the dropdown: {len(dd)}.")
    A('')
    for t in range(4):
        rs = sorted(by[t], key=lambda r: ({'foundational': 0, 'any': 1, 'intermediate': 2, 'advanced': 3, 'unrated': 4}.get(r['level']['primary'], 5), r['name']))
        if not rs:
            A(f"- **{TIER_NAME[t]}**: none")
            continue
        A(f"- **{TIER_NAME[t]}** ({len(rs)}): " + '; '.join(f"{r['name']} [{lv(r)}; {setup_str(r)}]" for r in rs))
    A('')
    if cand:
        A(f"Outside the dropdown, T0-T1 candidates ({len(cand)}): " + '; '.join(f"{r['name']} [T{r['equipment']['min_access_tier']}; {r['status'].replace('_', ' ')}; {setup_str(r)}]" for r in sorted(cand, key=lambda r: (r['equipment']['min_access_tier'], r['name']))))
        A('')
    subs = collections.OrderedDict()
    for r in by[3] + by[2]:
        sb = (r['equipment'].get('substitutes_by_equipment') or {})
        b = sb.get('bodyweight_only')
        if isinstance(b, dict):
            b = b.get('pick')
        if b and 'same exercise' not in str(b) and 'same (' not in str(b):
            subs.setdefault(str(b), []).append(r['name'])
    if subs:
        A('Bodyweight-only substitutes proposed by the equipment decode for the T2/T3 items (INFERRED, `equipment.substitutes_by_equipment.bodyweight_only`):')
        A('')
        for b, names in list(subs.items())[:25]:
            A(f"- {esc(b)} <- for: {', '.join(names[:6])}{' ...' if len(names) > 6 else ''}")
        A('')

A('## 4. The two NO ACCESS templates, day by day (OBSERVED wiring, INFERRED tiers)')
A('')
WIRING = []
cur = None
for line in open(AN + '/library/L4_slot_wiring.md'):
    m = re.match(r'^#### (.+?)(?: \(HIDDEN tab\))?\s*$', line)
    if m:
        cur = m.group(1).strip()
        continue
    if cur and cur.startswith('NO ACCESS') and line.startswith('| ') and '->' in line:
        parts = [p.strip() for p in line.strip().strip('|').split('|')]
        mm = re.match(r'([A-Z]+\d+) -> `([A-Z]+\d+:[A-Z]+\d+)`', parts[4])
        if mm:
            WIRING.append((cur, parts[1], parts[2], parts[3], mm.group(1), mm.group(2)))
for tab in ['NO ACCESS - AESTHETICS - FB - 4', 'NO ACCESS - ATHLETIC - FB - 4 t']:
    A(f"### {tab}")
    A('')
    rows = []
    for t, day, purpose, cat, cell, rng in [w for w in WIRING if w[0] == tab]:
        dd = [r for r in EX if any(s['library_range'] == rng for s in r.get('program_slots', []))]
        c = collections.Counter(r['equipment']['min_access_tier'] for r in dd)
        LO = {'foundational': 0, 'any': 1, 'intermediate': 2, 'advanced': 3, 'unrated': 4}
        best = [r['name'] for r in sorted(dd, key=lambda r: (r['equipment']['min_access_tier'], LO.get(r['level']['primary'], 5), r['name'])) if r['equipment']['min_access_tier'] == 0][:3]
        note = 'MISWIRED (should be AQ7:AQ42)' if rng == 'AR7:AR42' else ('truncated cardio range' if rng == 'B7:B122' else '')
        rows.append([day, purpose, cat or '-', cell, rng, len(dd), c[0], c[1], c[2], c[3], '; '.join(best), note])
    A(table(['day', 'purpose', 'category', 'cell', 'range', 'options', 'T0', 'T1', 'T2', 'T3', 'first T0 picks', 'note'], rows))
    A('')

A('## 5. Rules a generator can apply (INFERRED)')
A('')
A('1. Filter each slot\'s dropdown pool by the client\'s tier (`equipment.min_access_tier <= client tier`); never fall back to a higher tier silently.')
A('2. When a slot is empty at the client\'s tier, look in the same pattern outside the dropdown (section 3 "outside" lists) before changing the slot\'s job.')
A("3. Keep the coach's level logic: at T0 most foundational/intermediate options survive, but the ADVANCED blocks lean on barbells, bands/chains and machines (e.g. Bilateral KD ADVANCED AI91-AI104: banded/reverse-banded box squats, hack squat, leg press, pendulum, leg extension and barbell thruster are T3; only 'Sissy Squats' (AI100) is T0, and 'Box. Any Squat Touch and Go fast' (AI91) / 'Box. Any Squat Deload' (AI94) with DBs, 'DB thrusters' (AI102) and 'Single arm DB thruster' (AI104) are T2). For an advanced home client progress through the variables the coach lists - single-leg, tempo/'slow eccentric', deficit, pauses, load position with a DB/KB - instead of the barbell exercise.")
A("4. Joint-pain rule (OBSERVED, MASTER_MODEL EXAMPLE PUSHPULLLEGS SPLIT A7: 'When there are joint pains, usually getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help take care of some stuff'). INFERRED use: prefer the DB/KB version of a pattern for a client reporting joint pain; at T2 those versions exist for most pressing and pulling slots.")
A("5. Throws, calorie sprints and Olympic lifts have no true T0 equivalent; mark them unavailable rather than substituting a different quality.")
A('')
from verification_log import NOEQ_LOG
A(NOEQ_LOG)
open(OUT + '/02_no_equipment_subset.md', 'w').write('\n'.join(md))
print('noeq lines', len(md), 'gaps0', gaps0, 'gaps1', gaps1)
