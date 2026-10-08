# -*- coding: utf-8 -*-
"""Load every exercise-like record from the decode outputs into one uniform list (read-only)."""
import re, json, sys
from common import *

BYOP = 'BYOP'
MM = 'MASTER_MODEL'
MEL = 'MASTER EXERCISE LIBRARY'

def col(c):
    m = re.match(r'([A-Z]+)', c or '')
    return m.group(1) if m else ''

def lvl(v):
    if isinstance(v, dict):
        return v.get('normalized')
    return v

def lvl_raw(v):
    if isinstance(v, dict):
        for k in ('raw_block_label', 'raw', 'label_verbatim', 'raw_zone_label_row3'):
            if v.get(k):
                return v.get(k)
    return None

def base(**kw):
    d = dict(sid=None, file=None, workbook=None, tab=None, cell=None, raw=None, raw_value=None, decoder_clean=None,
             kind='exercise', role=None, family=None, category_verbatim=None, category_canon=None, sub_pattern=None,
             zone_code=None, level_raw=None, level_norm=None, laterality=None, plane=None, primary=[], secondary=[],
             size_class=None, exercise_class=None, equipment=[], no_eq=None, load_ceiling=None, skill=None, impact=None,
             reps_guess=None, in_dropdown=False, dropdown_range=None, slot_labels=[], observed_in_programs=[],
             video_url=None, coach_opinion=None, notes=None, inferred_fields=[], extra={})
    d.update(kw)
    return d

def load_L1():
    out = []
    for r in load(AN + '/library/L1_cardio_athletic.json'):
        supp = str(r.get('record_scope', '')).startswith('SUPPLEMENTARY')
        tab = 'Sheet23' if supp else MEL
        wb = MM if supp else BYOP
        c = col(r['cell'])
        if supp:
            role = 'reference_sheet23'
        elif r.get('is_dropdown_source'):
            role = 'byop_master_stack'
        else:
            role = 'byop_level_view'
        eff = r.get('effective_header_rows') or {}
        slots = []
        for s in r.get('dropdown_slots') or []:
            slots.append(s)
        extra = {k: r.get(k) for k in ('progression_track', 'ballistic_vs_plyometric_inferred', 'contact_type_inferred',
                                         'ssc_zone_inferred', 'coach_pattern_description', 'turn_angle_inferred',
                                         'energy_system_guess', 'aerobic_band_guess', 'work_s', 'rest_s', 'work_rest_ratio',
                                         'distance_mi', 'distance_m', 'calories', 'side', 'stance', 'hip_emphasis',
                                         'sub_pattern_canonical', 'sheet23_twin', 'mirror_cell', 'cell_bold', 'cell_bg')
                 if r.get(k) is not None}
        extra['effective_header_rows'] = eff or r.get('column_header_rows')
        out.append(base(sid=f"L1|{wb}|{tab}!{r['cell']}", file='analysis/library/L1_cardio_athletic.json', workbook=wb,
                        tab=tab, cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'], decoder_clean=r.get('name_clean'),
                        kind=r.get('record_type') or 'exercise', role=role, family=r.get('family'),
                        category_verbatim=r.get('category'), category_canon=r.get('category_canonical'),
                        sub_pattern=r.get('sub_pattern'), zone_code=(eff.get('row3') if eff else (r.get('column_header_rows') or {}).get('row3')),
                        level_raw=lvl_raw(r.get('level')), level_norm=lvl(r.get('level')), laterality=r.get('laterality'),
                        plane=r.get('plane'), primary=r.get('primary_muscles') or [], secondary=r.get('secondary_muscles') or [],
                        size_class=r.get('muscle_size_class'), equipment=r.get('equipment') or [], no_eq=r.get('no_equipment_ok'),
                        load_ceiling=r.get('load_ceiling'), skill=r.get('skill_demand'), impact=r.get('impact_or_plyo_intensity'),
                        reps_guess=r.get('typical_rep_range_guess'), in_dropdown=bool(r.get('is_dropdown_source')),
                        dropdown_range=(slots[0]['source_range'] if slots else None),
                        slot_labels=sorted({s['template_tab'] + ' ' + s['slot_cells'] for s in slots}),
                        observed_in_programs=r.get('observed_in_programs') or [], notes=r.get('notes'),
                        inferred_fields=r.get('inferred_fields') or [], extra=extra))
    return out

def load_L2():
    out = []
    for r in load(AN + '/library/L2_core_upper.json'):
        copy = 'Copy of Copy' in r.get('source', '')
        tab = 'Copy of Copy of MASTER EXERCISE' if copy else MEL
        rr = r.get('record_role', '')
        if copy:
            role = 'byop_copy_tab_only'
        elif rr.startswith('dropdown_master_stack'):
            role = 'byop_master_stack'
        elif rr.startswith('level_view'):
            role = 'byop_level_view'
        else:
            role = 'byop_unwired_column'  # column R (CORE PELVIS original)
        z = r.get('zone') or {}
        extra = {k: r.get(k) for k in ('canonical_id', 'record_role', 'slot_tags', 'coach_rep_bucket_guess',
                                         'observed_prescriptions_byop', 'program_tabs_slot_count', 'dedupe_key',
                                         'duplicate_of_cell', 'levels_all', 'categories_all', 'cell_bg') if r.get(k) not in (None, [], {})}
        extra['sheet23_zone_code'] = z.get('sheet23_zone_code')
        extra['canonical_zone'] = z.get('canonical_zone')
        extra['column_header_rows'] = r.get('column_header_rows')
        out.append(base(sid=f"L2|{BYOP}|{tab}!{r['cell']}", file='analysis/library/L2_core_upper.json', workbook=BYOP, tab=tab,
                        cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'], decoder_clean=r.get('name_clean'),
                        kind='exercise', role=role, family=r.get('family'), category_verbatim=r.get('category'),
                        category_canon=r.get('category_canonical'), sub_pattern=r.get('sub_pattern'),
                        zone_code=z.get('row3_label'), level_raw=lvl_raw(r.get('level')), level_norm=lvl(r.get('level')),
                        laterality=r.get('laterality'), plane=r.get('plane'), primary=r.get('primary_muscles') or [],
                        secondary=r.get('secondary_muscles') or [], size_class=r.get('muscle_size_class'),
                        equipment=r.get('equipment') or [], no_eq=r.get('no_equipment_ok'), load_ceiling=r.get('load_ceiling'),
                        skill=r.get('skill_demand'), impact=r.get('impact_or_plyo_intensity'),
                        reps_guess=r.get('typical_rep_range_guess'), in_dropdown=bool(r.get('in_program_dropdown')),
                        dropdown_range=r.get('dropdown_range'), slot_labels=r.get('program_slot_labels') or [],
                        notes=r.get('notes'), inferred_fields=r.get('inferred_fields') or [], extra=extra))
    return out

def load_L3():
    out = []
    for r in load(AN + '/library/L3_lower_isolation.json'):
        ps = r.get('program_slot') or {}
        mirror = bool(r.get('mirror_of'))
        role = 'byop_level_view' if mirror else ('byop_master_stack' if ps.get('referenced_by_program_dropdowns') else 'byop_unwired_column')
        slot = []
        if ps.get('purpose_label'):
            slot = [f"{ps.get('purpose_label')} / {ps.get('category_label')}"]
        vids = [x.get('video') for x in (r.get('cross_refs') or []) if isinstance(x, dict) and x.get('video')]
        extra = {k: r.get(k) for k in ('exercise_class', 'rep_dropdown_options_hint', 'difficulty_guess', 'copies', 'cross_refs',
                                         'squat_posture_scale', 'laterality_options', 'load_laterality', 'ballistic',
                                         'position_in_level_block', 'global_order_index', 'mirror_of', 'column_purpose_row6') if r.get(k) not in (None, [], {})}
        extra['column_header_rows'] = r.get('column_header_rows')
        out.append(base(sid=f"L3|{BYOP}|{MEL}!{r['cell']}", file='analysis/library/L3_lower_isolation.json', workbook=BYOP, tab=MEL,
                        cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'], decoder_clean=r.get('name_clean'),
                        kind='exercise', role=role, family=r.get('family'), category_verbatim=r.get('category'),
                        category_canon=r.get('category_canonical'), sub_pattern=r.get('sub_pattern'),
                        zone_code=(r.get('zone_code') or {}).get('raw'), level_raw=lvl_raw(r.get('level')), level_norm=lvl(r.get('level')),
                        laterality=r.get('laterality'), plane=r.get('plane'), primary=r.get('primary_muscles') or [],
                        secondary=r.get('secondary_muscles') or [], size_class=r.get('muscle_size_class'),
                        exercise_class=r.get('exercise_class'), equipment=r.get('equipment') or [], no_eq=r.get('no_equipment_ok'),
                        load_ceiling=r.get('load_ceiling'), skill=r.get('skill_demand'), impact=r.get('impact_or_plyo_intensity'),
                        reps_guess=r.get('typical_rep_range_guess'), in_dropdown=(role == 'byop_master_stack'),
                        dropdown_range=ps.get('dropdown_source') if role == 'byop_master_stack' else None,
                        slot_labels=slot if role == 'byop_master_stack' else [], video_url=(vids[0] if vids else None),
                        coach_opinion=r.get('coach_opinion'), notes=r.get('notes'), inferred_fields=r.get('inferred_fields') or [],
                        extra=extra))
    return out

def load_L4():
    out = []
    for r in load(AN + '/library/L4_focus_functional.json'):
        c = col(r['cell'])
        rt = r.get('record_type')
        if c == 'AZ':
            role = 'byop_focus_list'
        else:
            role = 'byop_unwired_column'
        kind = {'exercise': 'exercise', 'taxonomy_placeholder': 'taxonomy_placeholder', 'integration_label': 'taxonomy_placeholder'}[rt]
        extra = {k: r.get(k) for k in ('group_header_raw', 'group_header_cell', 'main_library_equivalent', 'category_header_cell',
                                         'integration_label', 'position', 'chop_direction', 'position_progression_rank', 'axis',
                                         'present_in_copies', 'level_block_colour') if r.get(k) not in (None, [], {})}
        extra['record_type_L4'] = rt
        out.append(base(sid=f"L4|{BYOP}|{MEL}!{r['cell']}", file='analysis/library/L4_focus_functional.json', workbook=BYOP, tab=MEL,
                        cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'], decoder_clean=r.get('name_clean'),
                        kind=kind, role=role, family=r.get('family'), category_verbatim=r.get('category'),
                        category_canon=r.get('category'), sub_pattern=r.get('sub_pattern'), level_raw=lvl_raw(r.get('level')),
                        level_norm=lvl(r.get('level')), laterality=r.get('laterality'), plane=r.get('plane'),
                        primary=r.get('primary_muscles') or [], secondary=r.get('secondary_muscles') or [],
                        size_class=r.get('muscle_size_class'), equipment=r.get('equipment') or [], no_eq=r.get('no_equipment_ok'),
                        load_ceiling=r.get('load_ceiling'), skill=r.get('skill_demand'), impact=r.get('impact_or_plyo_intensity'),
                        reps_guess=r.get('typical_rep_range_guess'), in_dropdown=(c == 'AZ'),
                        dropdown_range=("'MASTER EXERCISE LIBRARY'!$AZ$7:$AZ$335" if c == 'AZ' else None),
                        slot_labels=(['Focus 1 / (no category)', 'Focus 2 / (no category)'] if c == 'AZ' else []),
                        notes=r.get('notes'), inferred_fields=r.get('inferred_fields') or [], extra=extra))
    return out

def load_S23():
    out = []
    for r in load(AN + '/reference/sheet23.json'):
        hp = r.get('header_parsed') or {}
        extra = {k: r.get(k) for k in ('row_zone', 'plyo_zone_default_inferred', 'ssc_speed_tier', 'coach_target_muscles_byop',
                                         'coach_description_other_tab', 'duplicate_of', 'byop_cross_reference', 'byop_equivalent_column') if r.get(k) not in (None, [], {})}
        out.append(base(sid=f"S23|{MM}|Sheet23!{r['cell']}", file='analysis/reference/sheet23.json', workbook=MM, tab='Sheet23',
                        cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'], decoder_clean=r.get('name_clean'),
                        kind='exercise', role='reference_sheet23', family=r.get('family'),
                        category_verbatim=r.get('category_header_verbatim'), category_canon=r.get('category'),
                        sub_pattern=r.get('sub_pattern'), zone_code=(r.get('column_header_rows') or {}).get('row1'),
                        level_raw=lvl_raw(r.get('level')), level_norm=lvl(r.get('level')),
                        level_basis=(r.get('level') or {}).get('source') if isinstance(r.get('level'), dict) else None,
                        laterality=r.get('laterality'),
                        plane=r.get('plane'), primary=r.get('primary_muscles') or [], secondary=r.get('secondary_muscles') or [],
                        size_class=r.get('muscle_size_class'), equipment=r.get('equipment') or [], no_eq=r.get('no_equipment_ok'),
                        load_ceiling=r.get('load_ceiling'), skill=r.get('skill_demand'), impact=r.get('impact_or_plyo_intensity'),
                        reps_guess=r.get('typical_rep_range_guess'), notes=r.get('notes'),
                        inferred_fields=r.get('inferred_fields') or [], extra=extra))
    return out

def load_RP():
    d = load(AN + '/reference/resistance_patterns.json')
    out = []
    for r in d['exercises']:
        extra = {k: r.get(k) for k in ('body_region', 'base_pattern', 'laterality_options', 'joint_action', 'equipment_detail',
                                         'grammar', 'video_cell', 'byop_crossref', 'duplicate_of', 'section_path', 'level') if r.get(k) not in (None, [], {})}
        out.append(base(sid=f"RP|{MM}|(NOT DONE) RESISTANCE PATTERNS!{r['cell']}", file='analysis/reference/resistance_patterns.json',
                        workbook=MM, tab='(NOT DONE) RESISTANCE PATTERNS', cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'],
                        decoder_clean=r.get('name_clean'), kind='exercise', role='reference_resistance_patterns',
                        family=r.get('family'), category_verbatim=r.get('category'), category_canon=r.get('category_canonical'),
                        sub_pattern=r.get('sub_pattern'), level_raw=(r.get('level') or {}).get('colour_meaning'),
                        level_norm=lvl(r.get('level')), level_basis=(r.get('level') or {}).get('basis'),
                        laterality=r.get('laterality'), plane=r.get('plane'),
                        primary=r.get('primary_muscles') or [], secondary=r.get('secondary_muscles') or [],
                        size_class=r.get('muscle_size_class'), exercise_class=r.get('joint_action'), equipment=r.get('equipment') or [],
                        no_eq=r.get('no_equipment_ok'), load_ceiling=r.get('load_ceiling'), skill=r.get('skill_demand'),
                        impact=r.get('impact_or_plyo_intensity'), reps_guess=r.get('typical_rep_range_guess'),
                        video_url=r.get('video_url'), notes=r.get('notes'), inferred_fields=r.get('inferred_fields') or [], extra=extra))
    for r in d['variable_modifiers']:
        out.append(base(sid=f"RPMOD|{MM}|(NOT DONE) RESISTANCE PATTERNS!{r['cell']}", file='analysis/reference/resistance_patterns.json',
                        workbook=MM, tab='(NOT DONE) RESISTANCE PATTERNS', cell=r['cell'], raw=disp(r['name_raw']), raw_value=r['name_raw'],
                        decoder_clean=r.get('value_canonical'), kind='modifier', role='reference_resistance_patterns',
                        family='MODIFIER', category_verbatim=r.get('group_header_verbatim'), category_canon=r.get('variable_canonical'),
                        sub_pattern=r.get('parent_header'), level_raw=r.get('difficulty_label_verbatim'),
                        level_norm=r.get('difficulty_normalized'), level_basis=r.get('difficulty_basis'), video_url=r.get('video_url'), notes=r.get('effect'),
                        extra={k: r.get(k) for k in ('applies_to', 'difficulty_colour', 'difficulty_basis', 'effect_basis', 'group_header_cell', 'value_canonical', 'variable_canonical')}))
    return out

SPEC_TAB = [
    ("ALL ABOUT SQUATS", 'ALL ABOUT SQUATS'), ("ALL ABOUT BALLISTICS", '(NOT DONE) ALL ABOUT BALLISTICS'),
    ("CONTROL PATTERNS", 'CONTROL PATTERNSCORE'), ("Sheet24", 'Sheet24'), ("OLYMPIC", '(NOT DONE) ALL ABOUT OLYMPIC LI'),
    ("LUNGES", '(NOT DONE) ALL ABOUT LUNGES'), ("Sheet25", 'Sheet25'), ("AGILITY", 'AGILITYCOD PATTERNS'),
    ("AEROBIC", 'AEROBIC CAPACITY CHEAT SHEET'),
]

def spec_tab(src):
    for k, v in SPEC_TAB:
        if k in src:
            return v
    return src

def load_SPEC():
    d = load(AN + '/reference/specialty.json')
    out = []
    seen = {}
    for r in d['exercises']:
        tab = spec_tab(r['source'])
        rt = r['record_type']
        kind = {'exercise': 'exercise', 'workout': 'conditioning_prescription', 'session': 'program_session',
                'lunge_variable': 'modifier', 'derived_variant': 'exercise', 'drill': 'drill',
                'loading_variation': 'modifier', 'machine_variation': 'exercise', 'variant_rule': 'variant_rule'}[rt]
        key = f"SPEC|{MM}|{tab}!{r['cell']}"
        seen[key] = seen.get(key, 0) + 1
        sid = key if seen[key] == 1 else f"{key}#{seen[key]}"
        lev = r.get('level') or {}
        extra = {k: v for k, v in r.items() if k not in ('id', 'record_type', 'name_raw', 'name_clean', 'source', 'cell',
                 'family', 'category', 'category_canonical', 'sub_pattern', 'laterality', 'plane', 'level', 'primary_muscles',
                 'secondary_muscles', 'muscle_size_class', 'equipment', 'no_equipment_ok', 'load_ceiling', 'skill_demand',
                 'impact_or_plyo_intensity', 'typical_rep_range_guess', 'notes', 'inferred_fields', 'column_header_rows') and v not in (None, [], {})}
        extra['specialty_record_type'] = rt
        extra['specialty_id'] = r['id']
        out.append(base(sid=sid, file='analysis/reference/specialty.json', workbook=MM, tab=tab, cell=r['cell'],
                        raw=disp(r['name_raw']), raw_value=r['name_raw'], decoder_clean=r.get('name_clean'), kind=kind,
                        role='reference_specialty', family=r.get('family'), category_verbatim=r.get('category'),
                        category_canon=r.get('category_canonical'), sub_pattern=r.get('sub_pattern'),
                        level_raw=lev.get('label_verbatim') if isinstance(lev, dict) else None, level_norm=lvl(lev),
                        level_basis=lev.get('basis') if isinstance(lev, dict) else None,
                        laterality=r.get('laterality'), plane=r.get('plane'), primary=r.get('primary_muscles') or [],
                        secondary=r.get('secondary_muscles') or [], size_class=r.get('muscle_size_class'),
                        equipment=r.get('equipment') or [], no_eq=r.get('no_equipment_ok'), load_ceiling=r.get('load_ceiling'),
                        skill=r.get('skill_demand'), impact=r.get('impact_or_plyo_intensity'), reps_guess=r.get('typical_rep_range_guess'),
                        coach_opinion=r.get('coach_opinion_verbatim'), notes=r.get('notes'),
                        inferred_fields=r.get('inferred_fields') or [], extra=extra))
    return out

def equipment_index():
    idx = {}
    for r in load(AN + '/equipment/lib_athletic_core.json'):
        idx[('ATH', r['cell'])] = r
    for r in load(AN + '/equipment/lib_resistance.json'):
        idx[('RES', r['cell'])] = r
    return idx

def load_all():
    S = load_L1() + load_L2() + load_L3() + load_L4() + load_S23() + load_RP() + load_SPEC()
    return S

if __name__ == '__main__':
    from collections import Counter
    S = load_all()
    print(len(S))
    print(Counter(s['role'] for s in S))
    print(Counter(s['kind'] for s in S))
    ids = Counter(s['sid'] for s in S)
    print([k for k, v in ids.items() if v > 1][:20])
    dump(S, SCR + '/src_records.json')
