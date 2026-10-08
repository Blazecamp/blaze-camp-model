# -*- coding: utf-8 -*-
"""Write the synthesis deliverables from the merged catalog (read-only toward the sheets)."""
import re, os, json, collections
from common import *
from vocab import TIER_NAME, PAT, PAT_VERBATIM
from manual_lib import MERGES

os.makedirs(OUT, exist_ok=True)
R = load(SCR + '/catalog_draft.json')
CROSS = load(SCR + '/crosswalk_draft.json')
NONEX = load(SCR + '/nonex_draft.json')
BYID = {r['id']: r for r in R}
EXT = ('exercise', 'drill', 'test', 'conditioning_prescription')
EX = [r for r in R if r['record_type'] in EXT]

def esc(s):
    return str(s).replace('|', '/').replace('\n', ' ')

def lv(r):
    return r['level']['primary'] if isinstance(r.get('level'), dict) else '-'

# ------------------------------------------------------------------ crosswalk to 01_taxonomy node ids (INFERRED)
from node01 import node_for, FACET_FOR_VAR, LEVEL01
for r in R:
    nd = node_for(r)
    r['taxonomy']['node_01_taxonomy'] = nd
    if r['record_type'] == 'modifier':
        var = None
        for a in r['aliases']:
            pass
        lab = r['name'].split(':')[0].strip().lower()
        m = {'rom variable': 'F.ROM', 'end-range behaviour': 'F.END', 'loading variable': 'F.ACCOM', 'load position': 'F.LOADPOS', 'load laterality': 'F.LOADLAT',
             'hand placement': 'F.GRIP', 'feet position': 'F.BODYPOS', 'stance': 'F.STANCE', 'load laterality x position': 'F.LOADLAT + F.LOADPOS',
             'lunge orientation': 'F.ORIENT', 'lunge load position': 'F.LOADPOS', 'lunge stance/propulsion surface': 'F.STANCE'}
        r['taxonomy']['facet_01_taxonomy'] = m.get(lab, 'F.ACCOM' if re.search(r'band|chain|releaser', r['name'].lower()) else None)
    if isinstance(r.get('level'), dict):
        r['level']['code_01_taxonomy'] = LEVEL01.get(r['level']['primary'])
    r['inferred_fields'] = list(r.get('inferred_fields') or []) + ['taxonomy.node_01_taxonomy']

# ------------------------------------------------------------------ JSON outputs
dump(R, OUT + '/02_exercise_catalog.json')
src_counts = collections.Counter(c['source'] for c in CROSS)
dump(dict(_meta=dict(
    title='Blaze Camp exercise catalog - source crosswalk',
    description='Every source record (decoder JSON rows, MASTER_MODEL program line items, BYOP program-tab fills) and the canonical catalog id it maps to. maps_to = null means the program cell is not an exercise (see reason).',
    catalog_file='synthesis/02_exercise_catalog.json', rows=len(CROSS), rows_by_source=dict(src_counts),
    read_only='No Google Sheet was modified.',
    verification_2026_10_08='Fact-checked against the dumps: BASEBALL G75/J75 corrected to E75/I75 (cell_corrected_from); CrossFit rows now carry the verbatim cell text with the row label in context_label. See the Verification log section of 02_exercise_catalog.md.'),
    rows=CROSS, non_exercise_program_cells=NONEX), OUT + '/02_exercise_catalog_crosswalk.json')

# ------------------------------------------------------------------ helpers for MD
def table(headers, rows):
    out = ['| ' + ' | '.join(headers) + ' |', '|' + '|'.join(['---'] * len(headers)) + '|']
    for r in rows:
        out.append('| ' + ' | '.join(esc(x) for x in r) + ' |')
    return '\n'.join(out)

FAM_ORDER = ['ATHLETIC', 'RESISTANCE', 'CONTROL', 'FUNCTIONAL', 'CARDIO']
PAT_LABEL = {k: v['label'] for k, v in PAT.items()}
STATUS_LABEL = {'live_library_selectable': 'BYOP library, selectable in a program dropdown', 'live_library_not_selectable': 'BYOP library, no dropdown reads it',
                'copy_tab_only': 'BYOP copy tab only', 'reference_only': 'MASTER_MODEL reference tab only', 'program_only': 'named only in program tabs'}

md = []
A = md.append
A('# 02 - Canonical exercise catalog (Blaze Camp)')
A('')
A('**Files:** `synthesis/02_exercise_catalog.json` (array of %d records), `synthesis/02_exercise_catalog_crosswalk.json` (every source cell -> catalog id), `synthesis/02_no_equipment_subset.md` (NO ACCESS / home subset).' % len(R))
A('')
A('**Evidence legend.** OBSERVED = printed in a sheet cell, header, fill or dropdown (tab + cell given). INFERRED = our reading (each record lists its inferred fields in `inferred_fields`). SCIENCE = general training science, not the coach\'s words. Coach labels are quoted verbatim, typos included (\'TRIPPLE\', \'SAGITAL\', \'INTERMIDIATE\', \'DOMNANT\', \'ABdution\', \'Harmstring\'...); our own names use correct spelling. Nothing in Google Sheets was modified.')
A('')
A('## 1. What was merged')
A('')
A('Every exercise-like record from the decode outputs was loaded, normalised (case, spaces, plurals, the coach\'s typos, URL removal, dose prefixes such as `2x 3` and intensity cues such as `HEAVY`/`FAST`/`@ 75%` stripped into an alias `cues` field) and grouped. Near-duplicates were merged by hand (section 5). Program line items that matched no library name became **program-only** records, **complex** records (supersets, contrasts, circuits, sequences) or **generic choice** records (`X or Y`).')
A('')
rows = []
for f, label in [('analysis/library/L1_cardio_athletic.json', 'BYOP MASTER EXERCISE LIBRARY A-N (cardio + athletic) + 6 Sheet23 supplements'),
                 ('analysis/library/L2_core_upper.json', 'BYOP MASTER EXERCISE LIBRARY O-AH (core + upper) + 1 copy-tab item'),
                 ('analysis/library/L3_lower_isolation.json', 'BYOP MASTER EXERCISE LIBRARY AI-AU (lower + arm/calf isolation)'),
                 ('analysis/library/L4_focus_functional.json', 'BYOP AZ focus list, BA/BB carry/drag headings, BC-BE functional system'),
                 ('analysis/reference/sheet23.json', 'MASTER_MODEL Sheet23 (flat precursor library)'),
                 ('analysis/reference/resistance_patterns.json', 'MASTER_MODEL (NOT DONE) RESISTANCE PATTERNS (161 exercises + 39 variable modifiers)'),
                 ('analysis/reference/specialty.json', 'MASTER_MODEL specialty tabs (squats, ballistics, Olympic, lunges, core, agility, aerobic, Sheet24, Sheet25)'),
                 ('MASTER_MODEL program', 'MASTER_MODEL program tabs (UL, PPL, FAT BURN, BASEBALL, 4 TRACKS, ATHLETIC FB, BOXING, CROSSFIT, CONJUGATE) - every line item'),
                 ('BYOP program fill', 'BYOP program tabs - every non-placeholder exercise value typed into a slot')]:
    rows.append([f, label, src_counts.get(f, 0)])
A(table(['Source', 'What it is', 'Rows mapped'], rows))
A('')
A('Equipment requirements for BYOP library cells come from the equipment decode (`analysis/equipment/lib_athletic_core.json`, `lib_resistance.json`); everything else is inferred from the decoder equipment lists and the exercise name. The BYOP dropdown wiring (which program slot can draw which item) comes from `analysis/library/L4_slot_wiring.md` section 6 (OBSERVED data validations).')
A('')
rt = collections.Counter(r['record_type'] for r in R)
st = collections.Counter(r['status'] for r in R)
A('**Result: %d canonical records** (%d source rows in, %d program cells that are not exercises).' % (len(R), len(CROSS), len(NONEX)))
A('')
A(table(['record_type', 'count', 'meaning'], [
    ['exercise', rt['exercise'], 'a movement (or a generic one, `generic: true`, when the source does not name the implement/grip)'],
    ['conditioning_prescription', rt['conditioning_prescription'], 'self-dosing cardio item (dose is in the name, e.g. \'3 min Fast - 2 min walk\', \'15 cals\')'],
    ['test', rt['test'], 'distance / speed / agility tests'],
    ['drill', rt['drill'], 'running and agility drills (A-drills, formations, route trees)'],
    ['complex', rt['complex'], 'program cell that chains exercises (superset / contrast complex / circuit / sequence); `components` lists ids'],
    ['generic_choice', rt['generic_choice'], "program cell offering alternatives ('Pull ups or Lat pull down')"],
    ['modifier', rt['modifier'], 'coach variable that is stacked on a base exercise (grip, feet, stance, ROM, end-range, load position, bands/chains...)'],
    ['taxonomy_placeholder', rt['taxonomy_placeholder'], 'heading with no exercises yet (CARRY, DRAGS, functional slings)'],
    ['progression_note / variant_rule', rt['progression_note'] + rt['variant_rule'], 'a rule written inside an exercise list'],
]))
A('')
A(table(['status', 'count', 'meaning'], [[k, st[k], STATUS_LABEL[k]] for k in ['live_library_selectable', 'live_library_not_selectable', 'copy_tab_only', 'reference_only', 'program_only'] if st[k]]))
A('')

# ------------------------------------------------------------------ section 2 taxonomy table
A('## 2. Taxonomy used (coach buckets -> canonical codes)')
A('')
A("The coach's grammar (OBSERVED in BYOP rows 3-6 and Sheet23 headers): **LEVEL - FAMILY - SYMMETRY - PATTERN**, e.g. `FOUNDATIONAL - RP - BS - VERTICAL PUSH`. Families (row 4 'PATTERN'): ATHLETIC (AP), RESISTANCE (RP), CONTROL (CT/CP core), CARDIO, FUNCTIONAL. Row 6 'PURPOSE' is a *quality* for athletic work ('SPEED/POWER', 'CHANGE OF DIRECTION') and a *muscle* for resistance work ('QUADS', 'GLUTES/HAMSTRINGS', 'BACK'...). Each record carries `taxonomy.pattern_code` (ours) plus the verbatim labels.")
A('')
prow = []
for code, p in PAT.items():
    n = sum(1 for r in EX if r['taxonomy'].get('pattern_code') == code)
    nsel = sum(1 for r in EX if r['taxonomy'].get('pattern_code') == code and r['status'] == 'live_library_selectable')
    prow.append([code, p['family'], p['label'], PAT_VERBATIM.get(code) or '-', p['col'] or '-', p['slot'] or '(no BYOP slot)', p['vc'], n, nsel])
A(table(['pattern_code', 'family', 'our canonical label', 'coach label VERBATIM (cell)', 'BYOP column', 'BYOP program slot (purpose / category)', 'volume counted as (INFERRED)', 'records', 'of which selectable'], prow))
A('')
A("The canonical label is ours (typos corrected); the verbatim column quotes the coach's own heading with its typos ('TRIPPLE', 'DOMNANT'). SPRINT and ARMCARE are INFERRED buckets with no coach heading of their own. POS and LSS hold only the empty BD/BE headings (no exercises yet).")
A('')
A('`coach_muscle_groups` uses the 10 FULL FOCUS LIST headers (OBSERVED AZ8..AZ331: QUADS, SHOULDERS/TRAPS, BACK, TRICEP, GLUTES, HAMSTRINGS, CHEST, CORE, BICEP, CALVES). `muscle_size_class`: big = QUADS/GLUTES/HAMSTRINGS/BACK/CHEST, small = SHOULDERS-TRAPS/BICEP/TRICEP/CALVES/CORE, mixed = both (INFERRED split, matching the coach\'s "bigger muscles / smaller muscles").')
A('')

# ------------------------------------------------------------------ section 3 counts
A('## 3. Counts')
A('')
A('### 3.1 By family and source status (exercise-like records only: %d)' % len(EX))
A('')
rows = []
for f in FAM_ORDER:
    rs = [r for r in EX if r['taxonomy']['family'] == f]
    c = collections.Counter(r['status'] for r in rs)
    rows.append([f, len(rs), c['live_library_selectable'], c['live_library_not_selectable'], c['reference_only'], c['program_only']])
A(table(['family', 'total', 'selectable in BYOP', 'BYOP not selectable', 'reference only', 'program only'], rows))
A('')
A('### 3.2 By pattern and level (primary level; `any` = the coach lists it without tiers; `unrated` = no level anywhere)')
A('')
rows = []
for code in PAT:
    rs = [r for r in EX if r['taxonomy'].get('pattern_code') == code]
    if not rs:
        continue
    c = collections.Counter(lv(r) for r in rs)
    rows.append([code, PAT_LABEL[code], len(rs), c['foundational'], c['intermediate'], c['advanced'], c['any'], c['unrated']])
A(table(['pattern', 'label', 'records', 'foundational', 'intermediate', 'advanced', 'any', 'unrated'], rows))
A('')
bas = collections.Counter()
for r in EX:
    b = r['level']['basis']
    if r['level']['primary'] not in ('foundational', 'intermediate', 'advanced'):
        bas['no level / any'] += 1
    elif (b.startswith('OBSERVED') or ': OBSERVED' in b) and 'COPIED' not in b:
        bas['OBSERVED'] += 1
    else:
        bas['INFERRED'] += 1
A("Level evidence for the tiered records above: %d OBSERVED (BYOP block word, Sheet23/aerobic header word, RESISTANCE PATTERNS cell colour), %d INFERRED (decoder guesses from row order, demand or column position; colours with no legend; levels the decoders copied from BYOP onto reference tabs); %d records are 'any' or unrated. Each record's `level.basis` says which, and every reference placement carries `evidence`. A generator should treat INFERRED levels as defaults, not as the coach's ruling." % (bas['OBSERVED'], bas['INFERRED'], bas['no level / any']))
A('')
ml = [r for r in EX if r['level'].get('multi_level_in_byop')]
A('Records listed at more than one BYOP level block (OBSERVED): %d - %s.' % (len(ml), '; '.join(f"{r['name']} ({'/'.join(r['level']['levels_in_byop'])})" for r in ml)))
A('')
A('### 3.3 By equipment access tier (minimum tier at which the exercise can be done)')
A('')
A('Tiers (INFERRED definitions): **T0** bodyweight + household (floor, wall, stairs/sturdy chair or bench, open space, towel as a slider, a plate-sized object as a hop target); **T1** minimal kit (bands + door anchor, doorway pull-up bar, jump rope, suspension trainer, low hurdles/cones, foam roller); **T2** home light weights (dumbbells, kettlebells, medball/slam ball, stability ball, sandbag, weight plate, adjustable weight bench, dip station, high plyo box above knee height - a low box/step counts as T0); **T3** gym (barbell + rack, EZ/hex bar, landmine, cable stack, machines, Smith, GHD/hyper/reverse-hyper, seal bench, chains, cardio machines). `equipment.setups_any_of` lists alternative set-ups; the tier is the cheapest set-up.')
A('')
rows = []
for f in FAM_ORDER:
    rs = [r for r in EX if r['taxonomy']['family'] == f]
    c = collections.Counter(r['equipment']['min_access_tier'] for r in rs)
    rows.append([f, len(rs), c[0], c[1], c[2], c[3]])
tot = collections.Counter(r['equipment']['min_access_tier'] for r in EX)
rows.append(['ALL', len(EX), tot[0], tot[1], tot[2], tot[3]])
A(table(['family', 'records', 'T0', 'T1', 'T2', 'T3'], rows))
A('')
imp = collections.Counter(i for r in EX for i in r['equipment']['implements'])
A('Implements named in at least one set-up (count of records): ' + ', '.join(f"{k} {v}" for k, v in imp.most_common()) + '.')
A('')
A('### 3.4 Laterality and plane')
A('')
A(table(['laterality', 'records'], sorted(collections.Counter(r.get('laterality') for r in EX).items(), key=lambda x: -x[1])))
A('')
A(table(['plane', 'records'], sorted(collections.Counter(r.get('plane') for r in EX).items(), key=lambda x: -x[1])))
A('')

# ------------------------------------------------------------------ section 4 catalog listing by pattern
A('## 4. Full exercise list by pattern')
A('')
A('Status: **S** = selectable in a BYOP dropdown, **L** = in the BYOP library but no dropdown reads it, **R** = MASTER_MODEL reference tab only, **P** = named only in program tabs. Level = primary level (`any` = unlevelled list). Uses = program cells naming it (direct + inside complexes).')
A('')
SA = {'live_library_selectable': 'S', 'live_library_not_selectable': 'L', 'copy_tab_only': 'C', 'reference_only': 'R', 'program_only': 'P'}
for code in PAT:
    rs = sorted([r for r in EX if r['taxonomy'].get('pattern_code') == code], key=lambda r: (r['status'] != 'live_library_selectable', r['name'].lower()))
    if not rs:
        continue
    A(f"### {code} - {PAT_LABEL[code]} ({len(rs)})")
    A('')
    rows = []
    for r in rs:
        rows.append([r['name'], r['id'], SA[r['status']], lv(r), 'T%d' % r['equipment']['min_access_tier'], r.get('laterality'),
                     ', '.join(r.get('coach_muscle_groups') or []), (r.get('observed_in_programs_count') or 0) + (r.get('observed_as_component_count') or 0),
                     (r['coach_preference'] or {}).get('label_verbatim', '') if r.get('coach_preference') else ''])
    A(table(['name', 'id', 'st', 'level', 'tier', 'laterality', 'coach groups', 'uses', 'coach pref'], rows))
    A('')

# ------------------------------------------------------------------ section 5 duplicates merged
A('## 5. Duplicates merged')
A('')
A('### 5.1 Hand-reviewed near-duplicate merges (INFERRED unless stated)')
A('')
rows = []
for tgt, others, why in MERGES:
    k = nkey(tgt)
    rec = None
    for r in R:
        if any(nkey(a['raw']) == k for a in r['aliases'] if a.get('role') != 'program'):
            rec = r
            break
    rows.append([rec['name'] if rec else tgt, '; '.join(repr(o) for o in others), why])
A(table(['canonical record', 'merged raw names', 'why'], rows))
A('')
A('Also merged (INFERRED): RP \'LOADING VARIABLES\' `WEIGHT RELEASERS`/`CHAINS`/`BANDS` (A91-A93) with ALL ABOUT SQUATS `WEIGHT RELEASERS`/`BOTTOM CHAINS`/`BOTTOM BANDED` (A41/A39/A35); Sheet24 \'1-mile at max effort\' with BYOP SPEED TEST \'1 Mile run for time\'; the Sheet23 copy of the progression note \'Bigger plates start at lateral bilateral plate hops\' with BYOP G53/H16; the 42 Sheet24 half-marathon sessions grouped into 9 session-type records.')
A('')
A('### 5.2 Same exercise listed in several BYOP dropdown cells (OBSERVED repeats inside the live library)')
A('')
rows = []
for r in EX:
    cells = [a for a in r['aliases'] if a.get('role') == 'byop_master_stack']
    if len(cells) > 1:
        rows.append([r['name'], ', '.join(f"{a['cell']} ({a.get('level_label_verbatim') or '-'})" for a in cells)])
A(table(['record', 'master-stack cells (block label)'], rows))
A('')
A('### 5.3 Automatic merges by normalised name')
A('')
multi = [r for r in EX if len({(a['workbook'], a['tab'], a['cell']) for a in r['aliases'] if a.get('role') not in ('program', 'byop_program_fill')}) > 1]
A('%d records combine more than one library/reference cell (the BYOP master stack + its side-by-side level-view copy + the Sheet23 / RESISTANCE PATTERNS / specialty twin). Every alias keeps `workbook`, `tab`, `cell`, `role` and the verbatim text, so nothing is lost; `merged_because` is set when the merge was manual.' % len(multi))
A('')
A('Program cells were folded in the same way: e.g. `Front Squat (barbell)` carries %d program aliases, `Leg Press (machine)` %d, `DB Lateral (Side) Raise` %d (see each record\'s `aliases` with `role: program` and `cues` such as `heavy`, `fast`, `@ 75%%`, `MYO SET 15-5-5-5-5-5`).' % tuple(
    len([a for a in next(r for r in R if r['name'] == n)['aliases'] if a.get('role') == 'program']) for n in ('Front Squat (barbell)', 'Leg Press (machine)', 'DB Lateral (Side) Raise')))
A('')

# ------------------------------------------------------------------ section 6 conflicts
A('## 6. Conflicts and flags')
A('')
A('### 6.1 Coach preference vs. what the library offers (OBSERVED)')
A('')
rows = []
for r in R:
    p = r.get('coach_preference')
    if p:
        rows.append([r['name'], p['label_verbatim'], p['detail_verbatim'][:160], p['source'], p['generator_rule_inferred'], SA[r['status']], ', '.join(sorted(set(r['level'].get('levels_in_byop', [])))) if isinstance(r.get('level'), dict) else ''])
A(table(['record', 'coach label', 'coach detail (abridged)', 'source', 'generator rule (INFERRED)', 'status', 'BYOP levels'], rows))
A('')
A("Key conflicts: **Hack Squat** - the coach writes \"I PERSONALLY DON'T LIKE IT\" yet it is selectable at MODERATE ('Hack Squat Machine ', AI52) and ADVANCED ('Hack Squats', AI97). **Leg Press** - 'LOVE IT' but only reachable in the ADVANCED knee-dominant block (the INTERMEDIATE copy in Sheet23 AD9 was removed). **Pendulum** - 'LOVE IT' / 'FAVORITE' but ADVANCED only. **V-Squat** - never prescribe; it is not in BYOP (good). **Weight releasers** - 'I HAVE NO IDEA' but listed as an RP loading variable.")
A('')
A('### 6.2 All flags by type')
A('')
groups = collections.defaultdict(list)
for r in R:
    for f in r.get('flags') or []:
        typ = f.split(':')[0] if ':' in f[:40] else 'OTHER'
        groups[typ].append((r['name'], f))
for typ in sorted(groups, key=lambda t: -len(groups[t])):
    A(f"**{typ}** ({len(groups[typ])})")
    A('')
    for name, f in groups[typ]:
        A(f"- {esc(name)} - {esc(f)}")
    A('')

# ------------------------------------------------------------------ section 7 program-only / reference-only
A('## 7. Exercises the BYOP library does not have')
A('')
A('### 7.1 Named only in MASTER_MODEL program tabs (program_only, %d exercise-like records)' % sum(1 for r in EX if r['status'] == 'program_only'))
A('')
rows = []
for r in sorted([r for r in EX if r['status'] == 'program_only'], key=lambda r: (r['taxonomy']['pattern_code'], r['name'])):
    progs = sorted({a.get('program') for a in r['aliases'] if a.get('program')})
    rows.append([r['taxonomy']['pattern_code'], r['name'], 'T%d' % r['equipment']['min_access_tier'], (r.get('observed_in_programs_count') or 0) + (r.get('observed_as_component_count') or 0), '; '.join(progs)[:120]])
A(table(['pattern', 'record', 'tier', 'uses', 'programs'], rows))
A('')
A('### 7.2 In MASTER_MODEL reference tabs but not in the BYOP library (reference_only, %d)' % sum(1 for r in EX if r['status'] == 'reference_only'))
A('')
rows = []
for r in sorted([r for r in EX if r['status'] == 'reference_only'], key=lambda r: (r['taxonomy']['pattern_code'], r['name'])):
    tabs = sorted({a['tab'] for a in r['aliases'] if a.get('workbook') == 'MASTER_MODEL' and a.get('role') != 'program'})
    rows.append([r['taxonomy']['pattern_code'], r['name'], lv(r), 'T%d' % r['equipment']['min_access_tier'], '; '.join(tabs), (r.get('observed_in_programs_count') or 0)])
A(table(['pattern', 'record', 'level', 'tier', 'reference tab(s)', 'program uses'], rows))
A('')
A('### 7.3 Generic choices and complexes found in programs')
A('')
rows = []
for r in [r for r in R if r['record_type'] in ('generic_choice', 'complex')]:
    rows.append([r['record_type'], r.get('complex_type'), r['name'][:90], ' + '.join(c['name'] for c in r['components'])[:160], len(r['aliases']), 'T%d' % r['equipment']['min_access_tier']])
A(table(['type', 'kind', 'program text', 'components', 'cells', 'tier'], rows))
A('')
A('### 7.4 Program cells that are not exercises (%d, kept in the crosswalk with `maps_to: null`)' % len(NONEX))
A('')
A(table(['reason', 'cells'], collections.Counter(n['reason'] for n in NONEX).most_common()))
A('')

# ------------------------------------------------------------------ section 8 modifiers & placeholders
A('## 8. Modifiers, notes and empty headings')
A('')
A("The coach builds exercises as **base pattern + stacked variables** (RESISTANCE PATTERNS: 'FEET POSITIONING VARIATIONS', 'GET INTO THE HIP' / 'GET OUT OF THE HIP', 'LOW/MID' vs 'HIGH LOADING VARIATION', 'HAND PLACEMENT', 'FEET POSITION', 'STANCES', 'ROM VARIABLE', 'END RANGE BEHAVIOR VARIABLE', 'LOADING VARIABLES'; ALL ABOUT LUNGES: orientation x load position x stance; ALL ABOUT SQUATS: banded / chained / weight releasers). These are catalogued as `record_type: modifier` so a generator can attach them to a base exercise instead of storing every combination.")
A('')
rows = [[r['name'], lv(r), (r.get('notes') or [''])[0][:140] if r.get('notes') else '', '; '.join(f"{a['tab']}!{a['cell']}" for a in r['aliases'])] for r in R if r['record_type'] == 'modifier']
A(table(['modifier', 'difficulty (OBSERVED colour/header where given)', 'effect / note (INFERRED biomechanics unless quoted)', 'cells'], rows))
A('')
rows = [[r['record_type'], r['name'], '; '.join(f"{a['tab']}!{a['cell']}" for a in r['aliases'])] for r in R if r['record_type'] in ('taxonomy_placeholder', 'progression_note', 'variant_rule')]
A(table(['type', 'record', 'cells'], rows))
A('')

# ------------------------------------------------------------------ section 9 open questions
A('## 9. Open questions for the coach (catalog-specific)')
A('')
QS = [
 "Are 'Clean ' and 'Snatch ' (BYOP C95/C94, listed after the power versions) the full squat clean / squat snatch? The catalog assumes yes.",
 "Should the near-duplicates we merged stay merged: the three ball hamstring curls (AN17/AN19/AN50), the DB calf raises with/without deficit (AU10/AU11/AZ332), 'Seated Db Bicep Curls' vs 'Seated DB Curls ' (AS14/AS16), 'Hack Squat Machine ' (MODERATE) vs 'Hack Squats' (ADVANCED), and the Rotational Chest Pass / Scoop / Step-forward R and L entries (one record with sides R & L)?",
 "Which name wins when the same lift is spelled differently: 'Shoulder Wide Grip Deadlift' (MODERATE AN49) vs 'Barbell Deadlifts' (ADVANCED AN92); 'Bent Over Barbell Rows' vs 'Bent Over Rows Pronated Grip'; 'Hurdle Hops' (ADVANCED) vs 'Bilateral Forward Hurdle Hops ' (MODERATE)?",
 "You 'LOVE' the leg press and the pendulum but they only sit in the ADVANCED knee-dominant block, and the hack squat you dislike is offered at MODERATE and ADVANCED. Should the generator move leg press to every level, drop the hack squat, or keep it as a fallback only?",
 "Program tabs name about 120 exercises that are in no library (e.g. 'SL RDL' / single-leg RDL (32 program cells + 17 inside complexes), 'Hang cleans @ %' (12), 'Arnold press', 'JM PRESS' (16), 'Neutral grip lat pull down' (16), 'Pull under' (16), seal rows, A-drills, bike/row/ski calorie sprints, slider hamstring runners, Copenhagen raises, hollow rocks, star side planks). Which should be added to the BYOP library, and at which level?",
 "Generic program names ('DEADLIFTS', 'Back squats', 'Bicep Curls', 'Tricep (any kind)', 'Rows', 'OVERHEAD PRESS', 'SIDE RAISES', 'INCLINE BENCH'): should the generator read the implement as barbell / DB by default, or always pick a specific library variation?",
 "Is the RESISTANCE PATTERNS idea of 'base exercise + stacked variables' (grip, feet, stance, ROM, end range, bands/chains, contra/ipsilateral load) how you want the generator to create variety, instead of listing every combination?",
 "Equipment: the library has no equipment column. Are the inferred set-ups right for ambiguous items - 'Weighted squat to calf raise' (DB/KB/vest?), 'Box Squats' (bodyweight?), 'Bench Push ups' (hands or feet on the bench?), 'KB Face Pulls' (how with a KB?), 'Low DB Squats', 'Camporini Deadlifts'?",
 "Several items are filed under one pattern but train another: leg curls, slider/ball hamstring curls and Nordic curls under BILATERAL HIP DOMINANT; leg extension inside BILATERAL KNEE DOMINANT; thrusters in both VERTICAL PUSH and KNEE DOMINANT; front raises and reverse flies under the 'ABdution' slot. For weekly volume, should they count toward the slot's muscle or the muscle they actually train?",
 "Unclear names to confirm for cues/videos: 'Camporini Deadlifts', 'Lat pull unders' / 'Pull under', 'Kong Rows', 'Sealed cable Row', 'Pendulum row', 'Face up tricep push away', 'Whats that strap rotating in/out', 'Plate core', 'Med ball rocker(s)', 'Swiss ball kicks', 'hips raises', 'DB \"no money\" curls', 'Oscilating drop squats', 'Banded tantrums'.",
 "Cardio: the BYOP 'CALORIES' block (10-50 cals) names no machine while BASEBALL uses bike, row and SkiErg calorie sprints; and 'DISTANCE'/'CALORIES' sit outside the B7:B122 range most templates use. Should calorie items become machine-specific, and should every cardio slot see them?",
 "Half-marathon sessions (Sheet24, Chris Hinshaw): keep them as a separate borrowed running plan, or fold the session types (hill sprints, progression runs, split days) into your own aerobic A/B/C system?",
 "The functional slings (anterior oblique chops and Pallof holds, BC9-BC91) and the CARRY / DRAGS headings are in the library but no program slot reads them. Should they feed the Core slot, the warm-up, or a new slot?",
]
for i, q in enumerate(QS, 1):
    A(f"{i}. {q}")
A('')

# ------------------------------------------------------------------ section 10 field dictionary
A('## 10. Record fields (JSON)')
A('')
A(table(['field', 'meaning', 'evidence'], [
 ['id', 'stable slug of the canonical name (prefix `mod-` modifier, `ph-` heading/rule, `cx-` complex)', 'ours'],
 ['name / record_type / generic / status', 'canonical name (typos fixed), type, whether the source names no implement/grip, where it lives', 'INFERRED from sources'],
 ['aliases[]', 'every raw spelling (the cell text; `context_label` = row label the extractor prefixed, `composed_name` = decoder text joined from two cells, `cell_corrected_from` = corrected cell reference) with workbook, tab, cell, role (byop_master_stack, byop_level_view, byop_unwired_column, byop_focus_list, byop_copy_tab_only, reference_*, program, byop_program_fill), level label, category, merge reason, program dose and cues, video links', 'OBSERVED'],
 ['taxonomy', 'family, region, pattern_code, category, coach label (verbatim), sub-pattern, ZONE codes (verbatim), row-6 PURPOSE, path', 'labels OBSERVED; pattern_code ours'],
 ['placements[]', 'each library/reference cell with its own pattern, category and level', 'OBSERVED'],
 ['laterality / plane / sides', 'bilateral, unilateral, alternating; sagittal, frontal, transverse, multi; R & L pairs', 'row 5 or plane headers OBSERVED where given, else INFERRED'],
 ['level', 'primary level + basis, levels in BYOP, levels in all sources, OBSERVED reference levels, multi-level flag, cross-source disagreement (observed evidence only), every placement with its `evidence`', 'mixed: OBSERVED only where `basis` / `evidence` starts with OBSERVED; decoder-inferred and BYOP-copied levels are labelled INFERRED / COPIED'],
 ['primary_muscles / secondary_muscles / coach_muscle_groups / muscle_size_class / exercise_class', 'canonical muscle tokens, the 10 FOCUS LIST groups, big/small/mixed, compound/isolation/athletic/control/conditioning', 'INFERRED (row-6 PURPOSE OBSERVED in taxonomy)'],
 ['volume_counting', 'what the generator should count: hypertrophy_sets, control_sets, contacts, throws, power_reps, conditioning_bouts, reps_or_distance, warmup_not_counted', 'INFERRED'],
 ['equipment', 'implements, setups_any_of (alternative set-ups), min_access_tier (0-3), household substitutions, machine_type, substitutes_by_equipment (equipment decoder)', 'INFERRED'],
 ['no_equipment_ok / minimal_kit_ok / home_weights_ok', 'tier 0 / <=1 / <=2', 'INFERRED'],
 ['load_ceiling / skill_demand / impact_level', 'low-moderate-high', 'INFERRED'],
 ['typical_rep_range', "value, dose unit, matching BYOP REPS dropdown buckets, observed program doses (cells). Values ending '(observed in programs)' summarise only true rep counts ('10/10' = 10 per side, '3x8' = 8 reps); timed, calorie and %1RM cells are reported separately or ignored", 'doses OBSERVED; range INFERRED'],
 ['program_slots / candidate_slot_inferred / selectable_note', 'BYOP slot labels + range + every template cell that can pick it; the slot an unwired item would fit', 'OBSERVED wiring / INFERRED fit'],
 ['coach_preference / coach_statements', "verbatim opinions ('LOVE IT', \"DON'T LIKE IT\"), purposes, pattern descriptions, doses", 'OBSERVED'],
 ['video_urls', 'demo links found in RESISTANCE PATTERNS, L3 cross-refs and program cells', 'OBSERVED'],
 ['observed_in_programs(_count) / observed_as_component(_count) / used_in_complexes', 'program usage', 'OBSERVED'],
 ['related[]', 'variant_of / has_variant / generic_of / progression / regression / possible_duplicate / related', 'INFERRED'],
 ['flags', 'conflicts, typos, wiring problems, data corruption', 'cells quoted are OBSERVED; the reading of a conflict is INFERRED'],
 ['sources / observed_fields / inferred_fields / notes', 'provenance', '-'],
]))
A('')
from verification_log import CATALOG_LOG
A(CATALOG_LOG)
open(OUT + '/02_exercise_catalog.md', 'w').write('\n'.join(md))
print('md lines', len(md))
