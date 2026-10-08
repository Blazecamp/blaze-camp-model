"""Write synthesis/10_equipment_model.md from synthesis/10_equipment_model.json (+ _computed.json for the level/zone tables).
Run after build_10_assemble.py:  .venv/bin/python synthesis/_build_10/build_10_write_md.py
v1 (2026-10-08): coach answers applied (coach_answers_full.md); the "v1 - coach answers applied" section is rendered from
_meta.v1 at the top of the file.
"""
import json, os, collections

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, '..', '..'))
J = json.load(open(os.path.join(ROOT, 'synthesis', '10_equipment_model.json')))
C = json.load(open(os.path.join(HERE, '_computed.json')))
items = C['items']
LT = C['level_test']
PROFILES = list(J['access_profiles'])
ABBR = {'FULL_FACILITY': 'FAC', 'FULL_GYM': 'FULL', 'BASIC_GYM': 'BASIC', 'HOME_BARBELL': 'H-BB', 'HOME_DB_BENCH': 'H-DB', 'KB_ONLY': 'KB',
        'BODYWEIGHT': 'BW', 'HOTEL_GYM': 'HOTEL', 'FIELD_TRACK_KIT': 'FIELD', 'FIELD_TRACK_NO_KIT': 'F-NOKIT'}
V1 = J['_meta']['v1']
IDX = J['exercise_index']
L = []


def w(s=''):
    L.append(s)


def esc(s):
    return str(s).replace('|', '\\|').replace('\n', ' ')


def table(header, rows):
    w('| ' + ' | '.join(header) + ' |')
    w('|' + '---|' * len(header))
    for r in rows:
        w('| ' + ' | '.join(esc(x) for x in r) + ' |')
    w()


def shown(o):
    return o.get('display_name') or o['name']


pop = J['population_benchmarks']['mm_programs']
lm = J['level_model']
tst = lm['test_against_library']
gm = J['gap_matrix']

# =====================================================================================================================
w('# 10 · Equipment model for the program generator (Blaze Camp) - v1')
w()
w("**What this file is.** The equipment layer of the generator. A person enters basic information, including the equipment they have, and the generator builds a plan in this coach's style: a 4-6-week maintenance/transition block, an 8-week or a 12-week program, an open week-by-week plan or a yearly plan (COACH-ANSWER PER-01). This file says which implements the coach uses, for whom, in which order inside a session, at what load and speed, and what to put in each template slot when a piece of equipment is missing.")
w()
w('**Files.** `synthesis/10_equipment_model.json` is the machine-readable model (top-level keys `implements`, `out_of_scope_implements`, `constraint_scale`, `level_model`, `access_profiles`, `substitution_by_category`, `client_rules`, `picks_by_client_family`, `intent_sequence`, `load_velocity`, `machine_preferences`, `exercise_index`, `open_questions`, among others; the v1 change log is `_meta.v1`). This `.md` explains it. Both are rebuilt by `synthesis/_build_10/` (`build_10_equipment_model.py` → `build_10_assemble.py` → `build_10_write_md.py`; zone tagger in `zones.py`).')
w()
w('**Inputs.** `coach_answers_full.md` and `coach_answers.md` (read first; the coach\'s answers override every sheet inference and every earlier team decision), everything in `analysis/equipment/` (library decodes, BYOP and MASTER MODEL program decodes, reference-tab variables, ordering audit), and `synthesis/10b_equipment_variables_science.md`. Bucket IDs follow `synthesis/05_session_architecture.md`.')
w()
table(['Label', 'Meaning'], [
    ['**COACH-ANSWER**', "The coach's answers to the questionnaire (`coach_answers_full.md`, 138 of 140 answered, and `coach_answers.md`, 2026-10-08), cited by question ID (e.g. COACH-ANSWER EQ-11). Authoritative: they override anything inferred from the sheets. A RIGHT verdict with no text makes our assumption his rule."],
    ['**OBSERVED**', "Read from a workbook cell, cited as tab!cell. 'MM' = MASTER MODEL workbook. Bare cells such as `AI98` are BYOP 'MASTER EXERCISE LIBRARY'. Labels are quoted verbatim, typos included."],
    ['**COACH-CHAT**', "The coach's spoken words relayed in the task brief (paraphrased closely)."],
    ['**SCIENCE**', 'A published finding; [S#] points to the source list in `10b_equipment_variables_science.md` section 12. Rule ids EQ/GRD/FV/ROM/VOL/VARI/ORD/AR/TEMPO also come from 10b.'],
    ['**INFERRED**', 'Our derivation. Every implement, constraint, zone, axial-load and velocity tag on an exercise is INFERRED from its name, because the library has no equipment column.'],
    ['**PROPOSED**', 'Written as "PROPOSED - PENDING COACH APPROVAL": a science-grounded proposal where the coach asked us to research or propose, or where his answers leave a gap.'],
])

# =====================================================================================================================
w('## v1 - coach answers applied')
w()
w("Date %s. Source: %s. Every change below is built into the tables of this file and into the JSON (not a patch at the end); the question IDs point to `coach_answers_full.md`." % (V1['date'], V1['source']))
w()
for i, a in enumerate(V1['applied'], 1):
    w(f"{i}. **{a['ids']}.** {a['change']}")
w()
w('**Still pending:**')
w()
for x in V1['pending']:
    w('- ' + x)
w()
w('**Profile ids, v0 → v1** (`_meta.v1.profile_id_changes`):')
w()
table(['v0 id', 'v1'], [[k, v] for k, v in V1['profile_id_changes'].items()])
w('**Library cells removed from every list and count** (`exercise_index[cell].excluded`; the level test of section 1.4 still covers them because it tests the library as written):')
w()
table(['Cell', 'Exercise (verbatim)', 'Why', 'Basis', 'Use instead'], [[c, IDX[c]['name'], v['reason'], 'COACH-ANSWER ' + v['basis'].replace('COACH-ANSWER ', ''), v['replace_with']] for c, v in V1['excluded_cells'].items()])
w('**Options added from the coach\'s answers** (not in his library; counted as as-written options of their slot):')
w()
table(['Id', 'Exercise', 'Slot', 'Level', 'Constraint', 'Available in', 'Source'], [[a['id'], a['name'], a['slot'], a['lvl'], a['constraint'], ', '.join(ABBR[p] for p in a['available_in']), a['source']] for a in V1['additions']])
w('**v0 band / reverse-band substitutes removed** (`_meta.v1.removed_v0_subs`):')
w()
table(['v0 substitute', 'Slot', 'Basis (COACH-ANSWER)', 'Replaced by'], [[r['name'], r['slot'], r['basis'], r['replaced_by']] for r in V1['removed_v0_subs']])
vv = V1['verification']
w('**v1 checks (recomputed by the build):** shown option names that mention a band, chain or releaser in any slot list: %d. Curated substitutes that need an excluded token: %d. Profiles with an excluded token in the kit or the add-ons: %d. Cross-check against the decode teams\' tiers: every disagreement is a band or chain route, except the six known v0 BASIC_GYM cells (TRX U19, X12, AS19; hex bar C11, C48; hip-high box G133).' % (
    vv['shown_names_mentioning_band_chain_or_releaser_in_any_list'], vv['curated_substitutes_needing_an_excluded_token'], len(vv['profiles_with_an_excluded_token_in_kit_or_add_ons'])))
w()

_ov = lm['operative_level_overrides']
_rank = {'F': 0, 'I': 1, 'any': 1, 'A': 2}
_up = sum(1 for o in _ov if _rank[o['to']] > _rank[o['frm']])
_down = sum(1 for o in _ov if o['to'] == 'F' and _rank[o['frm']] > 0)
w("**Earlier coach answers (v0, still built in):**")
w()
w("1. **Level = skill + stability + load position (CAT-04), zones as rotation biases (CAT-10).** Every exercise carries Dr. Pat Davidson's position zone: zone 1 low/front (foundational), zone 2 horizontal or racked on the body (intermediate, internal-rotation bias), zone 3 overhead or behind the body (advanced). Machines and cables make any zone easier. Tested against the coach's own library levels in section 1.4. Operative-level overrides where his answers are explicit: %d up (back squats to ADVANCED, push jerk to INTERMEDIATE), %d down to FOUNDATIONAL (front-loaded zercher, low-skill guided machines), %d GHD cells to 'any' (LIB-08)." % (_up, _down, sum(1 for o in _ov if o['to'] == 'any')))
w("2. **Levels add options and are soft (CAT-05/06).** A client sees every exercise at or below their level. Level is an eligibility ceiling and a ranking input, not the main driver. Client level and exercise level are separate axes.")
w("3. **Knee flexion is its own segment (CAT-09).** `ISO_LEG_FLEXION` replaces `ISO_HAM` and absorbs 9 curl/Nordic items that the library files under 'BILATERAL HIP DOMNANT'. The coach had already written the segment: MM 'Sheet25'!H11 'LEG FLEXION' → H13 'ham curls'.")
w("4. **Biomechanics is not a bucket (CAT-03); big vs small muscles is (CAT-02).** The 'FUNCTIONAL BIOMECHANICS SYSTEM' column is treated as a core/anti-rotation bucket. Small-muscle slots are DB-first.")
w("5. **From the coach's chat statements.** Sport sets plyo emphasis (basketball most, MMA many, boxing/karate few; ATH-02 confirms the full ranking). The bilateral vs unilateral VOLUME relationship is very important: an equipment swap that changes a slot's laterality is flagged (`laterality_shift`) so the 03 ratio engine can keep it (UNI-02/UNI-08).")
w()

# =====================================================================================================================
w('## 0. Short answers')
w()
table(['Question', 'Answer', 'Evidence'], [
    ['How should equipment be described?', 'Each exercise gets an implement, a **constraint level 1-5** (reference points: 5 = seated machine with back pad, 1 = open space/ballistic; coach-approved), a **position zone 1-3** with its rotation bias, a velocity intent, a laterality and (lower body) an **axial-load** tag. The constraint level is the main equipment axis.', 'COACH-ANSWER EQ-13, CAT-04, CAT-10, PER-04; %d exercises tagged (`exercise_index`)' % len(IDX)],
    ['What makes an exercise foundational vs advanced?', "Position (zone 1 → 2 → 3) minus the help of a machine, cable or support, plus skill and stability. Position alone reproduces %d of %d library levels exactly and %d within one level. Levels are theoretical and never a hard gate (CAT-05)." % (tst['exact'], tst['n'], tst['within_one_level']), 'COACH-ANSWER CAT-04, CAT-05; section 1.4'],
    ['Who gets machines?', 'Older, injured and high-volume clients for compounds AND isolation (EQ-03), with the MODERATE/ADVANCED-filed leg machines open to FOUNDATIONAL clients (EQ-04); beginners on upper-body pulls (ON_RAMP); leg machines as VOLUME_TOOLs for anyone. Athletes get machines only as the last 1-2 slots (0.5% of athlete items). Machines are NOT ranked against each other (EQ-11).', 'COACH-ANSWER EQ-03, EQ-04, EQ-11; OBSERVED MM athletes 5/949 machine items; gen pop 18%'],
    ['Who gets free weights, medballs, Olympic lifts?', 'Athletes: constraint 1-2 on athletic slots and main lifts, 10-20% medball items, and Olympic-lift work for everyone in athletic training (beginners: hang pulls, hang cleans without bumpers, DB/KB snatches and cleans, hex-bar jumps; intermediate+: full lifts). Strength clients: barbell main lifts. Hypertrophy clients: 1-2 free-weight lead lifts, then machines/cables/DBs, and no medball throwing except in the warm-up.', 'COACH-ANSWER ATH-10, ATH-05; OBSERVED BYOP athletic constraint 2.17 vs aesthetics 2.82'],
    ['Which equipment profiles should intake offer?', "The coach's 8 options (EQ-01, minus bands): full commercial gym, basic gym, home gym (rack + barbell + DBs), home DBs + bench, kettlebells only, bodyweight only, hotel gym, field/track/outdoor kit. Two derived profiles (full gym + every performance add-on; field/track with nothing carried) come from the add-on answers. No bands anywhere.", 'COACH-ANSWER EQ-01, EQ-02; section 3'],
    ['What breaks without equipment?', "Bodyweight only: vertical pull and biceps have no option (pattern gap), throws, leg extension and the FBS chops are substitute-only, lateral raise has only a household-load stand-in, horizontal pull needs a sturdy table. Without bands, home vertical pull needs a pull-up bar and the FBS chops need a cable. The coach's ideal home kit (adjustable DBs + bench + pull-up bar + 8-10 lb medball, EQ-02) plus a box covers every main slot as written except leg extension (DB leg extension on a box) and the cable chops.", 'gap matrix section 3.3; COACH-ANSWER EQ-02'],
    ['Session order?', 'Warm-up → **core (first by default, movable)** → plyo → throws → COD → triple extension/Olympic → bilateral lower + HORIZONTAL upper (hip-dominant with push, knee-dominant with pull) → unilateral lower + VERTICAL upper → isolation (calves 3 sets each leg day, rear delts own sets) → conditioning. The main lift goes first whatever its direction. Implements get heavier and more constrained, and the movement slower, as the session goes on.', 'COACH-ANSWER ATH-11, ORD-01..06, ORD-08, UNI-11, VOL-17; OBSERVED BYOP athletic skeleton'],
    ['Load for speed work?', "Medball 8-10 lb for passes and rotations (overhead 6-10, sit-up 6-8, slams 10-20, never over 20 lb). Loaded jumps 10-20% of body weight, too heavy when height or speed drops. Olympic lifts '@ 75%' → '@ 90%'. Dynamic effort 'FAST RPE6 or about 60-70%' with straight weight - no bands or chains. Heavy strength at 1 RIR.", 'COACH-ANSWER EQ-06, EQ-12, EQ-15, PER-09; section 5'],
    ['Machine preferences?', "No ranking (EQ-11: 'I don't want to rank them because they have different brands, angles'). Constraint differs: leg press 5; hack squat and pendulum back-supported 4; Smith 4 and least constrained. Belt squat when the spine should not be loaded. GHD/reverse hyper only if available and felt in the right muscles. Client preference can decide (EQ-10). V-squat never (GEN-08).", 'COACH-ANSWER EQ-10, EQ-11, GEN-08; section 6'],
])

# =====================================================================================================================
w('## 1. Equipment taxonomy')
w()
w('### 1.1 Implement groups')
w()
table(['Group', 'What it is (and how the coach uses it)'], [[k, v] for k, v in J['implement_groups'].items()])
w("**Out of scope in v1:** bands, chains and weight releasers (the v0 group ELASTIC_ACCOMMODATING). " + J['out_of_scope_implements']['status'] + ". COACH-ANSWER EQ-01: \"" + J['out_of_scope_implements']['coach_answers']['EQ-01'] + "\" EQ-12: \"" + J['out_of_scope_implements']['coach_answers']['EQ-12'] + "\" The v0 records are kept in `out_of_scope_implements.v0_records` for the later variable-resistance work.")
w()
w('### 1.2 Implements: constraint, skill, stability, zones, role')
w()
w('Library statistics are over the primary entries of MASTER EXERCISE LIBRARY (resistance columns S-BE: 283 entries; athletic/core columns B-T: 152 dropdown rows). Skill and stability tags are INFERRED per exercise in the decode files.')
w()
rows = []
for k, v in J['implements'].items():
    ev = v.get('coach_evidence') or []
    rows.append([f'`{k}`', v.get('group', ''), v.get('constraint_typical', ''), v.get('skill', ''), v.get('stability_demand', ''), v.get('zones_reachable', ''),
                 v.get('velocity_role', '') or '; '.join(v.get('roles', [])[:1]), ev[0] if ev else ''])
table(['Implement', 'Group', 'Constraint', 'Skill', 'Stability demand', 'Load-position zones reachable', 'Velocity role / main role', 'Key coach evidence'], rows)
w('Generator rules per implement:')
w()
for k, v in J['implements'].items():
    gr = v.get('generator_rules') or []
    if gr:
        w(f"- `{k}`: " + ' '.join(gr))
w()
w('Mean constraint by implement class in the library (canonical 1-5 scale; the class names are the decode\'s, so "cable/band" means the library item can be done with either - v1 uses the cable):')
w()
table(['Implement class', 'Mean constraint'], [[k, v] for k, v in sorted(J['constraint_scale']['mean_constraint_by_implement_class_library'].items(), key=lambda x: -x[1])])
w("**Reading.** The coach's chat ranks implements from most to least reference points: machines → cables → DB/KB/medball → barbell (\"barbells are more skilled\"). The library confirms it. Machines average 4.43 with 0% high-skill entries. Cables average 3.17 with 0% high skill. DB/KB average 2.32 with 4% high skill. The barbell family averages 2.20, and 45% of its entries are high skill and 51% high stability demand. The barbell is also the only implement that can load zone 3 **behind** the body (back squat, good morning, barbell calf raise). That is one reason it sits at the advanced end of every ladder.")
w()

w('### 1.3 The constraint continuum (1-5)')
w()
w(J['constraint_scale']['definition'])
w()
w('**' + J['constraint_scale']['coach_answer'] + '**')
w()
rows = []
for lvl in ['5', '4', '3', '2', '1']:
    v = J['constraint_scale']['levels'][lvl]
    rows.append([lvl, v['name'], v['davidson'], '; '.join(v['examples_library'][:8]), v['who']])
table(['Level', 'Definition', "Davidson 'ground'", 'Examples from the coach\'s library', 'Who it suits'], rows)
for r in J['constraint_scale']['rules']:
    w('- ' + r)
w()
w('Distribution: ' + J['constraint_scale']['distribution']['athletic_core_library'] + '; resistance: ' + J['constraint_scale']['distribution']['resistance_library'] + '. ' + J['constraint_scale']['distribution']['by_level_resistance'] + '.')
w()
w('Other scales used in the decode files map onto this one as follows. ' + ' '.join(f'**{k}:** {v}' for k, v in J['constraint_scale']['crosswalk_other_scales'].items()))
w()

# ---------------------------------------------------------------------------------------------------------------------
w("### 1.4 Level model: Davidson zones (COACH-ANSWER CAT-04/05/06/10)")
w()
w('> ' + lm['coach_answer']['CAT_04'])
w('>')
w('> ' + lm['coach_answer']['CAT_10'])
w('>')
w('> ' + lm['coach_answer']['CAT_05'] + ' ' + lm['coach_answer']['CAT_06'])
w()
rows = []
for z, v in lm['zones'].items():
    rows.append([z, v['name'], v['level'], v.get('rotation_bias', ''), '; '.join(v['load_positions']), '; '.join(v['coach_ladders'])])
table(['Zone', 'Position', 'Level', 'Rotation bias (CAT-10)', 'Load positions', "Where the coach's own ladders already say this (OBSERVED)"], rows)
w('**Machines and cables shift every zone down.** ' + lm['guidance_modifier'])
w()
w('**Where "ZONE" is written in the sheets (OBSERVED):**')
w()
for x in lm['where_zones_are_already_written']:
    w('- ' + x)
w()
w(lm['reading'])
w()
w('**Testing the rule against the library.** ' + lm['estimator']['rule'] + ' ' + lm['estimator']['why_no_skill_bump'] + ' (' + lm['estimator']['status'] + ')')
w()
tab = collections.defaultdict(collections.Counter)
for it in items:
    if it['lib'] != 'resistance' or it['lvl_library'] == 'any':
        continue
    z, g = it['zone'], it['guidance']
    key = ('zone 3 unguided' if z == 3 and g == 0 else 'zone 3 guided/supported' if z == 3 else 'zone 2 unguided' if z == 2 and g == 0 else
           'zone 2 guided/supported' if z == 2 else 'zone 1' if z == 1 else 'machine (no zone)' if it['impl'] == 'machine' else 'unloaded (no zone)')
    tab[it['lvl_library']][key] += 1
keys = ['zone 1', 'zone 2 guided/supported', 'zone 2 unguided', 'zone 3 guided/supported', 'zone 3 unguided', 'machine (no zone)', 'unloaded (no zone)']
rows = [[{'F': 'FOUNDATIONAL', 'I': 'MODERATE / INTERMEDIATE', 'A': 'ADVANCED'}[lv]] + [tab[lv][k] for k in keys] + [sum(tab[lv].values())] for lv in ['F', 'I', 'A']]
table(['Library level (resistance columns)'] + keys + ['n'], rows)
fz = tab['F']
f23 = fz['zone 2 guided/supported'] + fz['zone 2 unguided'] + fz['zone 3 guided/supported'] + fz['zone 3 unguided']
f23g = fz['zone 2 guided/supported'] + fz['zone 3 guided/supported']
w("Reading: an unguided zone-3 lift is almost never foundational. The only %d are the push press and jerks AA11:AA14 (the coach's RP traffic light does not list them, but it colours every standing overhead press red, RP!E13:E15; LIB-13 now sets push press FOUNDATIONAL and push jerk INTERMEDIATE). Of the %d FOUNDATIONAL zone-2/3 entries, %d are guided or supported (lat pulldowns, assisted pull-ups, machine rows, seated presses, push-up regressions, cable presses); the rest are the push press/jerks and the misfiled 'KB Face Pulls ' (U20). Zone 1 is the largest group at FOUNDATIONAL (%d of %d), and unguided zone 3 is the largest at ADVANCED (%d of %d)." % (
    fz['zone 3 unguided'], f23, f23g, fz['zone 1'], sum(fz.values()), tab['A']['zone 3 unguided'], sum(tab['A'].values())))
w()
rows = [[b, v['n'], v['exact'], '%d%%' % round(100 * v['exact'] / v['n'])] for b, v in sorted(tst['by_bucket'].items(), key=lambda x: -x[1]['exact'] / x[1]['n'])]
table(['Slot (bucket)', 'Levelled entries', 'Coach rule = library level', '%'], rows)
w('Totals: %d of %d exact (%d%%), %d within one level (%d%%). Disagreements by cause:' % (tst['exact'], tst['n'], round(100 * tst['exact'] / tst['n']), tst['within_one_level'], round(100 * tst['within_one_level'] / tst['n'])))
w()
table(['Cause', 'Entries'], sorted(tst['by_class'].items(), key=lambda x: -x[1]))
for r in tst['reading']:
    w('- ' + r)
w()
w('**Operative-level overrides (where the coach\'s answer is explicit; the generator uses `lvl`, the library level is kept as `lvl_library`):**')
w()
table(['Cell', 'Exercise', 'Library', 'Operative', 'Basis'], [[o['cell'], o['name'], o['frm'], o['to'], o['basis']] for o in lm['operative_level_overrides']])
w('**Other sheet disagreements and coach clarifications:**')
w()
for x in lm['other_sheet_disagreements']:
    w('- ' + x)
w()
w('**Generator policy:**')
w()
for x in lm['generator_policy']:
    w('- ' + x)
w()

w('### 1.5 Segment changes from the coach\'s answers')
w()
sc = J['segment_changes']
lf = sc['leg_flexion']
w('**Leg flexion (CAT-09).** ' + lf['coach_answer'] + ' ' + lf['sheet_support'])
w()
w('- Bucket: `' + lf['bucket'] + '`. Moved cells: ' + ', '.join(f"{c} '{n}'" for c, n in lf['moved_cells'].items()) + '.')
w('- Effect: ' + lf['effect'])
w('- Sheet disagreement: ' + lf['sheet_disagreement'])
w()
w('**Biomechanics (CAT-03).** ' + sc['biomechanics']['coach_answer'] + ' ' + sc['biomechanics']['effect'])
w()
w('**Core (CAT-08, ATH-11).** ' + sc['core']['coach_answer'] + ' ' + sc['core']['equipment_effect'])
w()
w('**Big vs small muscles (CAT-02, VOL-17).** ' + sc['muscle_size']['coach_answer'] + ' ' + sc['muscle_size']['equipment_effect'])
w()

# =====================================================================================================================
w('## 2. Who gets what: client attributes → constraint, implements, zones')
w()
w('### 2.1 What the coach\'s programs actually use (OBSERVED, by population)')
w()
w('MASTER MODEL line items, tagged by `prog_mm_equipment` (INFERRED tags on OBSERVED cells). Constraint is converted to the canonical scale with the measured crosswalk. Shares of machine/medball come from the decode tables.')
w()
rows = []
for k, v in pop.items():
    rows.append([k, v['items'], v['mean_constraint_canonical'], v['mean_constraint_MM_scale'], '%d%%' % v['pct_constraint_4_5_MM'], '%d%%' % v['pct_fast_or_ballistic'], '%s%%' % v['pct_medball']])
table(['Population', 'Items with a constraint tag', 'Mean constraint (canonical)', 'Mean constraint (MM scale)', 'Constraint 4-5 (MM scale)', 'Fast / ballistic', 'Medball'], rows)
w('Top implements (prog_mm_equipment section 2.1): gen pop DB 33%, barbell 18%, machine 18%, cable 15%. Strength/powerlifting barbell 37%, DB 35%, machine 11%. Athletes DB 29%, bodyweight-ballistic 14.5%, barbell 13%, medball 13%, machine 0.5% (5 of 949 line items; 945 of them carry a constraint tag). Hybrid barbell 41%, DB 28%, machine 0%. Boxing weeks 1-2 are a gym template (14% machines); weeks 3-8 are athletic (56% fast/ballistic).')
w()
bf = J['population_benchmarks']['byop_families']
table(['BYOP template family', 'Machine + cable', 'Free weights', 'Bodyweight / field / props', 'Mean constraint (BYOP rubric)', 'Main slots with a no-equipment option', '... with a home kit'],
      [[k, f"{v.get('machine_plus_cable_pct', v.get('machine_share_pct'))}%", (str(v['free_weights_pct']) + '%') if 'free_weights_pct' in v else '', (str(v['bodyweight_field_props_pct']) + '%') if 'bodyweight_field_props_pct' in v else '',
        v.get('mean_constraint_byop_rubric', ''), v['slots_with_no_equipment_option'], v['with_home_kit']] for k, v in bf.items()])
w('"If you read the workouts you can understand them by their equipment usage" (COACH-CHAT) is confirmed. Athletic programs are near machine-free and medball-rich, gym/physique programs are about a quarter machine, and CrossFit is barbell-dominant: barbell is the only loaded implement it names (32% of its line items; the rest is cardio, WOD, pull-up bar/wall or unspecified; 96% of implement-word cells in the lib_resistance_notes keyword scan). The no-access row is machine + cable 30% (machine alone 26%). These are OBSERVED program shares; the BYOP "home kit" column was measured on the v0 home tier, which included bands.')
w()
w('### 2.2 Client rules')
w()
w('Each rule is `{id, if, then, evidence, basis}` in `client_rules`. The constraint bands are targets: options outside the band are penalised, not banned (GRD-1). CR-19 is kept only as a retired entry (ATH-09: no sex-based rules); CR-29..CR-36 are new in v1.')
w()
rows = []
for r in J['client_rules']:
    cond = '; '.join(f'{k}={v}' for k, v in r['if'].items())
    th = r['then']
    parts = []
    for k, v in th.items():
        if isinstance(v, dict):
            v = ', '.join(f'{a}: {b}' for a, b in v.items())
        elif isinstance(v, list):
            v = ' / '.join(str(x) for x in v)
        parts.append(f'**{k}**: {v}')
    rows.append([r['id'], cond, '<br>'.join(parts), r['basis']])
table(['ID', 'If', 'Then', 'Basis'], rows)

w('### 2.3 What the rules pick: top options per client family (INFERRED ranking)')
w()
w('`picks_by_client_family[slot][profile][family]` applies the rules to the ordered lists of section 3. Each family has a constraint band (main slots / isolation), level eligibility, penalties (machine for athletes, skill and ballistic for older/beginner, the EQ-03 never-list for older/injured/high-volume) and bonuses (barbell for strength/athlete, zone-1 free weights for beginners, lengthened isolation variants). v1: no bonus or penalty comes from the coach\'s sheet opinions on machines (EQ-11), and the hypertrophy family gets no throwing slot (ATH-05). Families: ' +
  '; '.join(f"**{k}** = {v['label']} (main {v['main']}, isolation {v['iso']}, levels {'/'.join(x for x in v['levels'] if x != 'any')})" for k, v in J['client_families'].items()) + '.')
w()


def _short(t, n=48):
    t = t.strip()
    return t if len(t) <= n else t[:n].rsplit(' ', 1)[0] + ' ...'


for prof in ['FULL_GYM', 'HOME_DB_BENCH', 'BODYWEIGHT']:
    w(f'**{prof}**')
    w()
    rows = []
    for b in ['AP_PLYO', 'AP_THROW', 'AP_TRIPLE_EXT', 'RP_BKD', 'RP_BHD', 'RP_UKD', 'RP_UHD', 'RP_HPULL', 'RP_VPULL', 'RP_HPUSH', 'RP_VPUSH', 'ISO_QUAD', 'ISO_LEG_FLEXION', 'ISO_SIDE_REAR_DELT', 'ISO_BICEP', 'ISO_TRICEP', 'ISO_CALF', 'CORE_ANY', 'COND_AEROBIC']:
        pk = J['picks_by_client_family'][b][prof]
        rows.append([b] + [' / '.join(_short(x.get('name') or x.get('note', '')) + (' (sub)' if x.get('substitute') else '') for x in pk[f][:2]) for f in J['client_families']])
    table(['Slot'] + list(J['client_families']), rows)

# =====================================================================================================================
w('## 3. Equipment access profiles and substitutions')
w()
w('### 3.1 The profiles the intake form should offer')
w()
rows = []
for p, v in sorted(J['access_profiles'].items(), key=lambda kv: kv[1].get('intake_option') or 99):
    rows.append([v.get('intake_option') or ('derived: ' + (v.get('derived_from') or '')), f'`{p}` ({ABBR[p]})', v['label'], v['typical_client'], ', '.join(v['ask_to_unlock']) or '-', ', '.join(v['slots_without_as_written_option']) or '-'])
table(['Intake option', 'Profile', 'Kit', 'Typical client', 'Ask about (add-ons)', 'Main slots with NO as-written option'], rows)
xs = J['_meta']['cross_check']
w("Kit tokens are defined in `kit_tokens` (no band, band-anchor or chains token in v1: COACH-ANSWER EQ-01/EQ-12); the full kit list per profile is `access_profiles[p].kit`. Every profile includes household items: floor, wall, step, chair/bench, towel/slider, a couch to anchor feet, and cones made of shoes or bottles. FIELD_TRACK_NO_KIT has no table or door. The profiles map onto the decode teams' tiers (`maps_to_team_profiles`). Cross-check of availability against those tiers: " +
  '; '.join(f"{k.split('|')[0]} / {k.split('|')[1]} {k.split('|')[2]} {v}" for k, v in xs['counts'].items()) + '. ' + xs['known_differences'])
w()
w('### 3.2 Intake form')
w()
it_ = J['intake']
w('1. **Pick the base profile:** ' + ', '.join(f"{i + 1} `{p}`" for i, p in enumerate(it_['step_1_pick_base_profile'])) + '. ' + it_['step_1_note'])
w('2. **Answer add-on questions.** For home clients, ranked by how many slot qualities they unlock (`intake.step_2_add_ons_ranked_for_home_clients`):')
w()
table(['Add-on', 'Asked against', 'New as-written options', 'Empty slots it fills', 'Slots improved (incl. substitutes)'],
      [[' + '.join(r['kit']), r['asked_against'], r['new_as_written_options'], ', '.join(r['empty_slots_filled']) or '-', ', '.join(r['slots_improved_incl_substitutes']) or '-'] for r in it_['step_2_add_ons_ranked_for_home_clients'][:14]])
w('3. **Space:** ' + '; '.join(it_['step_3_space']) + '.')
w('4. **Gym clients:** which specific machines (' + ', '.join(it_['step_4_specific_machines_for_gym_clients']) + '). Why: ' + it_['step_4_why'] + '.')
w('5. **Non-equipment fields that change equipment use:** ' + '; '.join(it_['step_5_non_equipment_fields_that_change_equipment_use']) + '.')
w('6. **Removed:** ' + it_['removed_fields'] + '.')
w()
w('**Rule:** ' + it_['rule'])
w()
w('### 3.3 Coverage matrix: as-written options per slot and profile')
w()
w('Number = distinct options doable **as written** (library items plus the coach-approved additions; the 14 excluded cells never count). Suffix: (L) a library level has no option; (t) thin, fewer than 3; S = no as-written option but a same-pattern/partial substitute exists; X = gap (only rule or pattern-gap fallbacks). Leg flexion uses the re-segmented bucket.')
w()
sym = {'full': '', 'level_gap': ' (L)', 'thin': ' (t)', 'substitute_only': 'S', 'gap': 'X'}
rows = []
for b, v in gm.items():
    cells = []
    for p in PROFILES:
        g = v[p]
        if g['as_written'] == 0:
            cells.append(sym[g['status']] if g['status'] in ('substitute_only', 'gap') else '0')
        else:
            cells.append(str(g['as_written']) + sym[g['status']])
    rows.append([b] + cells)
table(['Slot'] + [ABBR[p] for p in PROFILES], rows)
fac_not_full = [f"'{shown(v)}' {c}" for c, v in IDX.items() if 'FULL_FACILITY' in v['available_in'] and 'FULL_GYM' not in v['available_in'] and not v.get('excluded')]
full_not_basic = [f"'{shown(v)}' {c}" for c, v in IDX.items() if 'FULL_GYM' in v['available_in'] and 'BASIC_GYM' not in v['available_in'] and not v.get('excluded')]
_main = [c for c, v in IDX.items() if not v.get('excluded') and v['bucket'] in gm and not v['bucket'].startswith('FOCUS')]
_share = {p: round(100 * sum(1 for c in _main if p in IDX[c]['available_in']) / len(_main)) for p in ('HOME_DB_BENCH', 'BODYWEIGHT', 'BASIC_GYM', 'FULL_GYM')}
_hdb_missing = {b: v['HOME_DB_BENCH']['missing_levels'] for b, v in gm.items() if v['HOME_DB_BENCH']['missing_levels'] and not b.startswith('FOCUS')}
w('**Main reading.**')
w()
w("- **A basic commercial gym keeps %d%% of the menu** (a full gym %d%%). It lacks only specialty items and add-ons (%d options): %s. The derived performance profile adds %d more over a full gym: %s." % (
    _share['BASIC_GYM'], _share['FULL_GYM'], len(full_not_basic), ', '.join(full_not_basic), len(fac_not_full), ', '.join(fac_not_full)))
w("- **Home with DBs + bench keeps about half the menu (%d%%) - and without bands it now has no vertical pull as written** (DB pullover = partial; a doorway pull-up bar is the fix, EQ-02), no throws (no medball), no leg extension (DB leg extension on a box), no FBS chops (they need a cable) and these missing library levels: %s." % (
    _share['HOME_DB_BENCH'], '; '.join(f'{b} {"/".join(l)}' for b, l in _hdb_missing.items())))
w("- **Bodyweight only (%d%%)** has no vertical pull or biceps option (pattern gap) and no throws. Horizontal pull needs a sturdy table. Lateral/front raises have only a household-load stand-in." % _share['BODYWEIGHT'])
w("- **The coach's ideal home kit** (adjustable DBs + bench + pull-up bar + 8-10 lb medball, EQ-02) plus a box fills every main slot as written except leg extension (same-pattern DB substitute) and the cable chops.")
w("- **Two slots never survive without equipment as written:** 'Leg Extensions' (AM, 1 machine option) and the BYOP 'Leg Curls' wiring (AR, 2 machines). The leg-flexion segment gives a home client slider, ball, Nordic and DB curls; EQ-08 confirms the swaps (no bands).")
w('- **UNILATERAL KNEE DOMINANT is 13/13 everywhere,** because every lunge is written implement-free and loaded through the LOADING list (ALL ABOUT LUNGES!C22:C33; contra/ipsilateral choice per CR-32).')
w()
w('### 3.4 Ordered substitution lists, every slot × every profile')
w()
w("Order = `_meta.ordering_of_lists`. Within each profile: as-written options first (library + coach additions), in default progression order: operative level F → I → A, filing-problem items last within a level, easiest first by the coach's rule, then most constrained first (no machine is promoted or demoted for preference, EQ-11). Then curated substitutes (`substitute=true`) with a flag: same_pattern, partial, zone_shift, rule or pattern_gap; a substitute that repeats an option already in the list is dropped; no substitute needs a band. A misfiled library item that is not this movement pattern ('KB Face Pulls ' U20 under VERTICAL PULL) comes last of all, marked `misfiled_not_this_pattern`. Names show the generator's `display_name` where v1 sets one ('Squat Snatch' etc., or a 'cable or band' name with the cable route only). The table shows the first 6 entries; the JSON has the full list, each entry with cell, level, constraint, zone, laterality, axial load and flags. `client_rules` re-rank these lists per client (section 2.3).")
w()
SHOW = 6
for b, per in J['substitution_by_category'].items():
    meta = J['slot_meta'].get(b, {})
    w(f"**{b}** - coach labels {', '.join(meta.get('coach_labels', []))}; library {meta.get('library', '')}")
    w()
    rows = []
    for p in PROFILES:
        lst = per[p]
        g = gm[b][p]
        sh = []
        for o in lst[:SHOW]:
            if o.get('substitute'):
                sh.append(f"[{o['flag']}] {o['name']} ({o['basis']})")
            else:
                tag = o['lvl'] + (('*' if o.get('lvl_library') else ''))
                extra = ' (coach addition)' if o.get('src') == 'coach_addition' else ''
                sh.append(f"{shown(o)} {o['cell']} {tag}{extra}" + (' [misfiled: not this pattern, listed last]' if o.get('misfiled_not_this_pattern') else ''))
        more = len(lst) - SHOW
        rows.append([ABBR[p], g['status'], g['as_written'], '; '.join(sh) + (f' (+{more} more)' if more > 0 else '')])
    table(['Profile', 'Status', 'As written', 'Ordered options (first %d; * = operative level differs from library level)' % SHOW], rows)

w('### 3.5 Substitutions the coach wrote himself (OBSERVED)')
w()
w("The coach writes swaps into the cells as 'X or Y'. These are the first choice whenever a slot's implement is missing (10b EQ-7 step 1), with two v1 limits: the first-written option is not automatically the default (pick by client, and the client's preference can decide, EQ-10), and band routes are never used (EQ-01). Full list in `coach_alternates`. The most frequent:")
w()
alts = sorted(J['coach_alternates'], key=lambda a: -a['n'])[:24]
table(['Text (verbatim)', 'Kind', 'Cells (MM)', 'n'], [[a['text'] + (f" (v1: {a['v1_use']})" if a.get('v1_use') else ''), a['kind'], ', '.join(a['cells'][:3]), a['n']] for a in alts])
w("Also OBSERVED in the reference tabs: 'Double kb or Db' (RP!C30), '(rings/trx/barbell/smith machine)' (RP!G64), 'Foam roller or swiss ball wall assisted goblet' (RP!A12), 'HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row' (MM 05!C16: a cable → band → bodyweight ladder in one cell; v1 keeps the cable and Bird Dog routes), 'pull ups or banded assisted pull ups' (MM BASEBALL!CG53; v1 keeps the pull-ups), and 'leg press or just add 2 more rounds to front squats' (MM 4 TRACKS!W42:Z42: a missing machine becomes extra sets of the free-weight lift - now the fallback after the EQ-08 swap).")
w()

# =====================================================================================================================
w('## 4. Session equipment / intent sequencing')
w()
w('The coach\'s sentence: "Some workouts go: equipment for power first (athletics), then the power-strength training, then strength training, then the resistance movements / resistance patterns" (COACH-CHAT; ORD-03 RIGHT). It is written literally into the BYOP athletic skeleton: `NO ACCESS - ATHLETIC - FB - 4 t`!C3:D12 \'Plyo\', \'Plyo\', \'Throwing\', \'COD\', \'Tripple Extension\', \'Bilateral KD\', \'Horizontal Pull\', \'Unilateral KD\', \'Vertical Pull\', \'Leg Extensions\'. The only fully filled athletic day (JUSTICE LEAGUE!E3:E12 - "Justice League" was only a marketing name for a non-competitive athletic program, ATH-13; elsewhere in the tab only E13 \'SL Depth Drops\' and E35 \'Low Bar Back Squat\' are chosen) runs \'Medium Depth Drop\' → \'Ankle Hops \' → \'Situps to overhead throw\' → \'DIG/OUT\' → \'Power Clean\' → \'Front Squats\' → \'Cable Machine UL Rows\' → \'Front Foot Elevated Lunges (FFE)\' → \'Stricted Pull-ups feet in front \' → \'Leg Extensions\'. Its constraint by position is 1,1,3,1,1,2,3,1,1,5 on the BYOP program rubric (1,1,3,1,2,2,3,2,1,5 on the canonical scale of `exercise_index`) and its reps are 6-8 → 8-12 → MYO. **v1:** core now opens the session after the warm-up (ATH-11); field athletes off-season may reach 10-12 exercises (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance, VOL-08/VOL-17), resistance-only sessions about 5-7.')
w()
rows = []
for s in J['intent_sequence']:
    rows.append([s['order'], s['tier'], ', '.join(s['buckets']), ', '.join(s['implements']), s.get('constraint', ''), s.get('velocity_zone', s.get('intent', '')),
                 s.get('load', '') or s.get('reps_observed', ''), ' / '.join(s['evidence'][:2])])
table(['#', 'Tier', 'Buckets', 'Implements', 'Constraint', 'Velocity zone', 'Load / reps observed', 'Evidence'], rows)
w('**Sub-rules:**')
w()
table(['Rule', 'Status', 'Evidence'], [[r['rule'], r['status'], ' / '.join(r['evidence'])] for r in J['sequence_subrules']])
w('**Exceptions the generator must allow:**')
w()
table(['Exception', 'Allowed for', 'Evidence'], [[e['name'], e['allowed_for'], ' / '.join(e['evidence'])] for e in J['sequence_exceptions']])
w('**Exceptions retired in v1:**')
w()
table(['Former exception', 'Why it is no longer allowed'], [[e['name'], e['why']] for e in J['sequence_exceptions_retired_v1']])
w("**Why horizontal before vertical (INFERRED from CAT-04; the rule itself is COACH-ANSWER ORD-01).** The coach calls zone 2 (horizontal) \"high-pressure, but safer to push and pull\" and zone 3 (overhead) the position needing \"more positioning, stability and skill\". Putting the heavier, safer vector first is the ACSM higher-intensity-first rule [S80]. No study tests the order directly, so show it to the client as a house rule (10b ORD-5). The main lift ('the work') still goes first whatever its direction (ORD-02).")
w()

# =====================================================================================================================
w('## 5. Load-velocity prescriptions by intent (observed vs science)')
w()
lv = J['load_velocity']
w('**Principle.** ' + '; '.join(lv['principle']['coach']) + '. SCIENCE: ' + lv['principle']['science'] + '. **Generator rule:** ' + lv['principle']['generator_rule'])
w()
rows = []
for z in lv['zones']:
    rows.append([z['zone'], z.get('velocity_ms', ''), z.get('pct_1rm', ''), ', '.join(z.get('implements', [])), '; '.join(z.get('library', [])) if z.get('library') else '',
                 '; '.join(z.get('observed', [])), z.get('science_dose', '')])
table(['Zone', 'm/s', '%1RM', 'Implements', 'Library items', 'OBSERVED in the coach\'s sheets', 'SCIENCE dose'], rows)
mb = lv['medball_rule']
w('**Medball rule.** OBSERVED: ' + mb['observed'] + ' COACH-CHAT: ' + mb['coach_chat'] + ' ' + mb['coach_answer'])
w()
table(['Throw type', 'Ball (lb)'], [[k, v] for k, v in mb['generator_default_lb'].items()])
w('Modifiers: ' + '; '.join(f'{k}: {v}' for k, v in mb['modifiers'].items()) + '. Quality gate: ' + mb['quality_gate'] + '. ' + mb['science_note'] + ' No medball: ' + mb['no_medball'] + ' Status: ' + mb['status'] + '.')
w()
w('**Loaded jumps.** OBSERVED: ' + '; '.join(lv['loaded_jumps']['observed']) + '. Rule: ' + lv['loaded_jumps']['rule'] + '. Status: ' + lv['loaded_jumps']['status'] + '.')
w()
ph = lv['plyo_heights']
w('**Plyo heights and method (' + ph['status'] + ').** Depth drops: ' + '; '.join(f'{k} {v}' for k, v in ph['depth_drops'].items()) + '. Hurdles: ' + '; '.join(f'{k} {v}' for k, v in ph['hurdles'].items()) + '. Method: ' + ph['method_progression'] + '.')
w()
ol = lv['olympic']
w('**Olympic lifts (' + ol['status'] + ').** Who: ' + ol['who'] + ' Names: ' + ol['names'] + '. Start-position ladder: ' + ol['start_position_ladder'] + '. Catch ladder: ' + ol['catch_ladder'] + '. Percent progression (OBSERVED BASEBALL): ' + ' → '.join(ol['percent_progression']) + '. Equipment: ' + ol['equipment'] + '. No-barbell ladder: ' + ' → '.join(ol['no_barbell_ladder']) + '.')
w()
vr = lv['variable_resistance']
w('**Variable resistance: out of scope.** ' + vr['status'] + ' ' + vr['coach_answer'] + ' What the generator does instead:')
w()
for x in vr['what_the_generator_does']:
    w('- ' + x)
w()
w(vr['v0_reference'])
w()
w('**Tempo.** ' + lv['tempo']['observed'] + '. By zone: ' + '; '.join(f'{k}: {v}' for k, v in lv['tempo']['by_zone'].items()) + '. Rule: ' + lv['tempo']['rule'] + '.')
w()
w('**ROM.** OBSERVED: ' + '; '.join(lv['rom']['observed']) + '. COACH-CHAT: ' + lv['rom']['coach_chat'] + ' Rule: ' + lv['rom']['rule'] + '.')
w()
am = lv['aerobic_modality']
w('**Aerobic modality.** ' + am['rule'] + '. Sessions per week: ' + am['sessions_per_week'] + '. Library: ' + am['library_note'] + '.')
w()
w('**Speed bands written by the coach:** ' + lv['speed_endurance_bands'] + '. **Older adults:** ' + lv['older_adults'] + '.')
w()
w('**Failure gate (CR-23).** RIR 0-1, MYO sets and drop sets only at constraint ≥ 4 or on isolation, and only on the last exercise (VOL-15 RIGHT). Barbell compounds stay at RIR 1-3; never to failure on heavy compounds (GEN-08). Athletic and Olympic work is never taken near failure. OBSERVED: \'MYO SET\' only on the last slot (BYOP 03/04 G12); \'2 sets LEG PRESS MYO - 15-5-5-5-5-5\' (MM 4 TRACKS!W61).')
w()

# =====================================================================================================================
w("## 6. Machines: no ranking, constraint differences (COACH-ANSWER EQ-11)")
w()
mp = J['machine_preferences']
w('> ' + mp['coach_answer']['EQ_11'])
w()
w('**Ranking:** ' + mp['ranking'] + ' Other answers that shape machine use: ' + '; '.join(f"{k.replace('_', '-')}: {v}" for k, v in mp['coach_answer'].items() if k != 'EQ_11') + '.')
w()
table(['Machine', 'Set-up', 'Constraint', 'Spine', 'Note'], [[r['machine'], r['set_up'], r['constraint'], r['spine'], r['note']] for r in mp['constraint_differences']])
w("**The coach's sheet opinions (OBSERVED, informational only - they rank nothing in v1):**")
w()
table(['Machine', 'Verdict (cell)', 'Detail (verbatim)', 'Library', 'Generator'], [[r['machine'], r['verdict'] + ' ' + r['cell'], r['detail'], r['library'], r['generator']] for r in mp['sheet_opinions_informational']])
w('**Roles:** ' + '; '.join(f'**{k}** {v}' for k, v in mp['roles'].items()) + '.')
w()
w('**Other machines (neutral):** ' + '; '.join(mp['unrated']) + '. Rule: ' + mp['unrated_rule'] + '.')
w()
w('**Machine-first vs free-first:** ' + mp['machine_first_vs_free_first'])
w()
w('**Missing machine:** ' + mp['missing_machine_rule'] + '. Context: ' + mp['model_quote'] + '.')
w()
w('**How the generator uses machines:**')
w()
for r in mp['generator_rules']:
    w('- ' + r)
w()

# =====================================================================================================================
w('## 7. Open questions for the coach')
w()
oq = J['open_questions']
w('**Answered since v0** (%d of the 24 v0 questions; details in `open_questions.answered_v0`):' % len(oq['answered_v0']))
w()
table(['v0 question', 'Answered by', 'Result in v1'], [[q['q'], q['answered_by'], q['result']] for q in oq['answered_v0']])
w('**Still open:**')
w()
for i, q in enumerate(oq['still_open'], 1):
    w(f'{i}. {q}')
w()
w('**New questions raised by the answers:**')
w()
for i, q in enumerate(oq['new_from_answers'], 1):
    w(f'{i}. {q}')
w()

# =====================================================================================================================
w('## Appendix A. JSON field guide (`10_equipment_model.json`)')
w()
table(['Key', 'Content'], [
    ['`_meta`', 'sources, evidence labels, how to use, list ordering, cross-check (with the v1 difference list), changes from the coach answers, **v1** (applied changes with question IDs, pending, profile id changes, excluded cells, removed v0 substitutes, additions, verification), verification_log (v0 fact-check 2026-10-08)'],
    ['`implement_groups`, `implements`, `out_of_scope_implements`', 'taxonomy: group, kit tokens, constraint, skill, stability, zones reachable, velocity role, roles, library stats/examples, coach evidence, generator rules; bands/chains/releasers parked with the coach quotes and the v0 records'],
    ['`constraint_scale`', 'definition, coach approval (EQ-13), levels 1-5 with library examples, implement means, distribution, crosswalks, GRD rules (GRD-4 = EQ-11 order inside level 4)'],
    ['`level_model`', "coach answer text (CAT-04/05/06/10/11), zones 1-3 with rotation bias, guidance modifier, where 'ZONE' is written, estimator, test vs library (by bucket, by cause), conflicts, operative-level overrides, other disagreements, policy LV-1..8"],
    ['`segment_changes`', 'leg flexion (CAT-09), biomechanics (CAT-03), core (CAT-08, ATH-11), muscle size (CAT-02, VOL-17)'],
    ['`kit_tokens`, `access_profiles`, `intake`', 'intake vocabulary (no band/chain tokens); 10 profiles (8 intake options + 2 derived) with intake_option, derived_from, kit, add-on ranking, slot status counts, empty slots, level gaps; intake steps (training experience, body weight, preference; sex removed)'],
    ['`slot_meta`', 'per bucket: coach labels, library range, tier'],
    ['`substitution_by_category[bucket][profile]`', "ordered list; as-written entries {name, display_name?, cell, lvl, lvl_library?, c, skill, vel, fv, zone, laterality, src ('library' or 'coach_addition'), axial_load?, machine_role?, coach_pref? (informational), coach_description?, flag?, laterality_shift?, misfiled_not_this_pattern?, not_in_library?, source?}; substitutes {name, src, basis, substitute, flag, c, laterality, note?, laterality_shift?}"],
    ['`gap_matrix[bucket][profile]`', 'status (full / thin / level_gap / substitute_only / gap), as_written, by_level, missing_levels, best_substitute_flag'],
    ['`client_rules`', '[{id, if, then, evidence, basis}] CR-01..CR-36 (CR-19 retired)'],
    ['`client_families`, `picks_by_client_family`', 'six client families and the top-3 picks per slot × profile × family'],
    ['`population_benchmarks`', 'MM population stats (canonical constraint, fast %, medball %) and BYOP family mixes'],
    ['`intent_sequence`, `sequence_subrules`, `sequence_exceptions`, `sequence_exceptions_retired_v1`', 'tiers 0-9 (0b = core first) with buckets, implements, constraint, zone, load/reps observed, evidence; sub-rules; allowed and retired exceptions'],
    ['`load_velocity`', 'principle, zones (observed vs science), medball rule, loaded jumps, plyo heights, Olympic, variable_resistance (out of scope), tempo, ROM, aerobic modality, speed bands, older adults'],
    ['`machine_preferences`', 'coach answers, ranking (none), constraint differences, sheet opinions (informational), roles, rules'],
    ['`coach_alternates`', "every 'X or Y' string from the MASTER MODEL programs with cells; v1_use where a band route is excluded"],
    ['`exercise_index[cell]`', 'per library item (and ADD-* additions): bucket, levels (operative, library, coach rule), zone, rotation bias, guidance, constraint, skill, stability, velocity, F-V zone, implement, laterality, axial load, machine role, equipment needs (with semantics), profiles where available, usage, suitability, preference, flag, display_name, coach_description, excluded'],
    ['`open_questions`', 'answered_v0 (with the answer IDs), still_open, new_from_answers'],
])
w('## Appendix B. Reproduce')
w()
w('```')
w('.venv/bin/python synthesis/_build_10/build_10_equipment_model.py   # computed layer -> _computed.json')
w('.venv/bin/python synthesis/_build_10/build_10_assemble.py          # -> synthesis/10_equipment_model.json')
w('.venv/bin/python synthesis/_build_10/build_10_write_md.py          # -> synthesis/10_equipment_model.md')
w('```')
w()
w('The v1 changes live in the same three scripts (search for "v1" and "COACH-ANSWER"); before editing them the v0 scripts reproduced the published v0 files byte for byte.')
w()
VL = J['_meta'].get('verification_log')
w('## Verification log')
w()
w('**v1 (2026-10-08).** Rebuilt from the edited scripts. Checks run by the build and recorded in `_meta.v1.verification`: %d shown option names mention a band, chain or releaser; %d curated substitutes need an excluded token; %d profiles carry an excluded token. Cross-check against the decode tiers: ' % (
    vv['shown_names_mentioning_band_chain_or_releaser_in_any_list'], vv['curated_substitutes_needing_an_excluded_token'], len(vv['profiles_with_an_excluded_token_in_kit_or_add_ons'])) +
  '; '.join(f"{k.replace('|', ' vs ')}: {v['n']} differences, {'all' if v['all_band_or_chain_route'] else 'all but ' + ', '.join(v['other_cells'])} through a band/chain route" for k, v in vv['cross_check_vs_decode_tiers'].items()) +
  '. The level test (98 of 176 exact) is unchanged because it tests the library as written; additions are not part of it. Every COACH-ANSWER quote was checked against coach_answers_full.md.')
w()
if VL:
    w(f"**v0 ({VL['date']}).** {VL['scope']}")
    w()
    for head, key in [('Checked', 'checked'), ('Recomputed with python', 'recomputed'), ('Corrected (old -> new)', 'corrections'),
                      ('Checked and left as is', 'left_as_is')]:
        w(f'**{head}:**')
        w()
        for i, t in enumerate(VL[key], 1):
            w(f'{i}. {t}' if key == 'corrections' else f'- {t}')
        w()
out = os.path.join(ROOT, 'synthesis', '10_equipment_model.md')
open(out, 'w').write('\n'.join(L))
print('wrote', out, os.path.getsize(out), 'bytes')
