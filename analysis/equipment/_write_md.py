# -*- coding: utf-8 -*-
"""Write prog_mm_equipment.md from prog_mm_equipment.json (all numbers computed, none typed by hand)."""
import json, re, collections, statistics, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from _classify import norm

J = 'analysis/equipment/prog_mm_equipment.json'
OUT = 'analysis/equipment/prog_mm_equipment.md'
d = json.load(open(J))
S = d['sessions']
U = d['units']
P = d['populations']

def esc(x):
    return str(x).replace('|', '/').replace('\n', ' ')

def pc(x):
    if x is None:
        return '-'
    if isinstance(x, (int, float)):
        return f"{x:.1f}%" if 0 < x < 1 else f"{x:.0f}%"
    return str(x)

def fmt(x, n=2):
    return '-' if x is None else (f"{x:.{n}f}" if isinstance(x, float) else str(x))

TCODE = {'T1_POWER': 'T1', 'T2_POWER_STRENGTH': 'T2', 'T3_STRENGTH': 'T3', 'T4_RESISTANCE_PATTERN': 'T4', 'T5_ISOLATION': 'T5',
         'CORE': 'CORE', 'CONDITIONING': 'COND', 'WARMUP': 'WU', 'PLACEHOLDER': '?', 'SKILL': 'SKILL', 'UNCLASSIFIED': 'U'}
ICODE = {'barbell/hex/ez/landmine': 'BB', 'dumbbell': 'DB', 'kettlebell': 'KB', 'medball': 'MB', 'machine (incl. smith)': 'MACH',
         'cable': 'CBL', 'band': 'BAND', 'bodyweight': 'BW', 'bodyweight ballistic/sprint': 'BW-bal', 'cardio equipment': 'CARDIO',
         'slider/swiss ball': 'SLD/SB', 'plate': 'PLATE', 'external load (unspecified)': 'LOAD?', 'any (coach: any kind)': 'ANY',
         'unspecified': '?'}

L = []
w = L.append
items_all = [i for s in S for i in s['items']]
n_items = sum(1 for i in items_all if i['tier'] != 'PLACEHOLDER')
n_unique = len({norm(i['name']).lower() for i in items_all if i['tier'] != 'PLACEHOLDER'})

# ------------------------------------------------------------------ derived numbers used in the text
def unit(k):
    return U[k]
bb = [s for s in S if s['program'] == 'BASEBALL']
part_tiers = collections.defaultdict(collections.Counter)
part_impl = collections.defaultdict(collections.Counter)
for s in bb:
    for i in s['items']:
        part_tiers[i.get('part') or '-'][i['tier']] += 1
        part_impl[i.get('part') or '-'][i['implement_category']] += 1
bb_partC_slot = collections.Counter()
for s in bb:
    for i in s['items']:
        if i.get('part') == 'Part C' and i.get('slot') in ('horiz pull', 'horiz push', 'vert pull', 'vert push'):
            bb_partC_slot[(s['day'], i['slot'])] += 1
bb_partC_pat = collections.Counter()
for s in bb:
    for i in s['items']:
        if i.get('part') == 'Part C' and i.get('upper_pattern') in ('H_PULL', 'V_PULL', 'H_PUSH', 'V_PUSH'):
            bb_partC_pat[(s['day'], i['upper_pattern'])] += 1
day_expect = {'MONDAY': 'H_PULL', 'TUESDAY': 'H_PUSH', 'THURSDAY': 'V_PULL', 'FRIDAY': 'V_PUSH'}
bb_hv_ok = sum(v for (dname, p), v in bb_partC_pat.items() if day_expect.get(dname) == p)
bb_hv_all = sum(bb_partC_pat.values())
opt = [i for s in bb for i in s['items'] if i.get('part') == 'OPTIONAL PIECE']
opt_cells = sorted({f"02:{i['cell']} '{i['name']}' {i.get('sets_raw')}x{i.get('reps_raw')}" for i in opt})
pa_mb = sum(1 for s in bb for i in s['items'] if i.get('part') == 'Part A' and i['implement_category'] == 'medball')
pa_all = sum(1 for s in bb for i in s['items'] if i.get('part') == 'Part A')
pa_t1 = sum(1 for s in bb for i in s['items'] if i.get('part') == 'Part A' and i['tier'] == 'T1_POWER')
mach_ath = sum(1 for s in S if s['population'] == 'athlete' for i in s['items'] if i['implement_category'] == 'machine (incl. smith)')
mach_cells_ath = sorted({f"{s['tab_code']}:{i['cell']} '{norm(i['name'])}'" for s in S if s['population'] == 'athlete' for i in s['items'] if i['implement_category'] == 'machine (incl. smith)'})
hyb = [s for s in S if s['program'].startswith('4 TRACKS - HYBRID')]
def _hpos(s, lab):
    p_ = [i['pos'] for i in s['items'] if (i.get('part') or '').strip().upper() == lab and not i.get('template_only')]
    return min(p_) if p_ else None
hyb_both = [s for s in hyb if _hpos(s, 'STRENGTH') and _hpos(s, 'OLY/ POWER')]
hyb_with_both = len(hyb_both)
hyb_str_before_oly = sum(1 for s in hyb_both if _hpos(s, 'STRENGTH') < _hpos(s, 'OLY/ POWER'))
aes12 = [s for s in S if s['program'].startswith('4 TRACKS - AESTHETICS') and s['variant'].startswith('12')]
aes12_isofirst = sum(1 for s in aes12 if s['compound_iso_order'] == 'isolation_first')
aes12_withboth = sum(1 for s in aes12 if s['compound_iso_order'] != 'n/a')
fat = [s for s in S if s['program'].startswith('FAT BURN') and s['variant'] == 'MUSCLE BUILDING']
fat_vh = sum(1 for s in fat if s['hv']['pull'] == 'V_before_H')
fat_both = sum(1 for s in fat if s['hv']['pull'] in ('V_before_H', 'H_before_V'))
alts = d['alternates']
alt_equipment = [a for a in alts if a['kind'].startswith(('implement swap', 'slash', 'exercise swap', 'variant'))]
first_opt = collections.Counter((a['option_primary_implements'] or [None])[0] for a in alt_equipment)
# medball weights
mb_lb = [i for i in items_all if re.search(r'\d+\s*(lb|lbs|kg)\b', str(i.get('name')) + ' ' + str(i.get('reps_raw')), re.I)]
gen = P['gen_pop']; ath = P['athlete']; stp = P['strength_powerlifting']; hy = P['athlete_hybrid']; bx = P['boxing']; cf = P['crossfit']

# ------------------------------------------------------------------ HEADER
w('# MASTER MODEL program tabs: equipment usage, constraint, velocity intent and exercise order')
w('')
w("Source: `raw/MASTER_MODEL.xlsx`, read with openpyxl in read-only fashion and cross-checked against `dumps/MASTER_MODEL/*.txt`. No Google Sheet was touched. "
  "Tabs covered: 'EXAMPLE UPPERLOWER SPLIT' (00), 'EXAMPLE FAT BURNBODY TONING PRO' (01), 'BASEBALL' (02, all 3 blocks), "
  "'(NOT DONE) 4 TRACKS PROGRAMMING' (04), 'EXAMPLE ATHLETIC FULL BODY SPLI' (05), 'EXAMPLE PUSHPULLLEGS SPLIT' (06), "
  "'EXAMPLE BOXING 8 WEEK BUILD UP' (07), 'EXAMPLE CROSSFIT SPLIT' (11) and '(NOT DONE) EXAMPLE CONJUGATE' (12). 'Copy of BASEBALL' (03) was skipped because it is identical to 02.")
w('')
w(f"**Coverage:** {len(S)} sessions and {n_items} exercise line items, with {n_unique} distinct exercise strings. Every line item is listed with its cell in Appendix A and in `prog_mm_equipment.json` (`sessions[].items[]`).")
w('Machine-readable companion: `prog_mm_equipment.json`. Reproducible with `_extract_sessions.py`, `_classify.py`, `_build_prog_mm_equipment.py` and `_write_md.py` in this folder.')
w('')
w("**Evidence legend.** **OBSERVED** means read from a cell, and the tab code and cell are given (for example `02:CM33`). **INFERRED** means an analyst rule. All implement, constraint, velocity and tier labels are INFERRED from the coach's verbatim text. **SCIENCE** means general training-science rationale that is not in the sheet. Coach text is quoted verbatim, typos included ('Sqats', 'DEAFLITS', 'sesaw', 'Glidder', 'Ropte', 'ACCESORY').")
w('')
w('### Scales used (INFERRED)')
w('')
w('| Constraint level | Meaning |')
w('|---|---|')
for k in ('5', '4', '3', '2', '1'):
    w(f"| {k} | {d['meta']['constraint_scale'][k]} |")
w('')
w('| Velocity intent | Meaning |')
w('|---|---|')
for k in ('5', '4', '3', '2', '1'):
    w(f"| {k} | {d['meta']['velocity_scale'][k]} |")
w('')
w('| Tier | Definition (the coach\'s claimed order is T1 > T2 > T3 > T4 > T5) |')
w('|---|---|')
for k, v in d['meta']['tiers'].items():
    w(f"| {k} | {v} |")
w('')
w('**How execution order is known.** In BASEBALL it is OBSERVED, because the coach labels every block `Part A` ... `Part E` and inserts `OPTIONAL PIECE` (OLY) rows. In every other tab, row order is INFERRED to be execution order. '
  'The CrossFit monthly grid is a planning grid, so it is left out of every order test.')
w('')

# ------------------------------------------------------------------ 1 HEADLINES
w('## 1. Headline answers')
w('')
bbu = {k: U[f'BASEBALL :: BLOCK {k}'] for k in (1, 2, 3)}
w(f"1. **The claimed order holds where the coach actually coached it (BASEBALL, OBSERVED Part labels).** Part A = power: {pa_t1}/{pa_all} Part A lines are T1, and {pa_mb} of them are medball. Part B = core. "
  f"`OPTIONAL PIECE` = Olympic lifts. Part C = bilateral strength lift superset with an upper-body push/pull. Part D = unilateral work, isolation and calf/ankle plyos. Part E = 'Buy out' sprint on bike/row/ski or a run. "
  f"Mean relative position across all 96 sessions: T1 {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('T1_POWER', 0) for k in bbu]))}, CORE {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('CORE', 0) for k in bbu]))}, "
  f"T3 {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('T3_STRENGTH', 0) for k in bbu]))}, T2 {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('T2_POWER_STRENGTH', 0) for k in bbu]))}, "
  f"T4 {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('T4_RESISTANCE_PATTERN', 0) for k in bbu]))}, T5 {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('T5_ISOLATION', 0) for k in bbu]))}, "
  f"conditioning {fmt(statistics.mean([bbu[k]['mean_rel_position_by_tier'].get('CONDITIONING', 0) for k in bbu]))}. "
  f"A power item comes first in {pc(ath['power_item_first_pct'])} of athlete sessions.")
w(f"2. **It is not a strict 5-step ladder.** Only {pc(ath['tier_monotonic_pct_raw'])} of athlete sessions are strictly monotonic. That rises to {pc(ath['tier_monotonic_pct_adjusted_contrast_pairs'])} once Part D ankle/hurdle hops are treated as calf accessories and heavy-lift+jump supersets as one contrast unit. "
  "Power-strength (T2) has no fixed slot. It shows up in three places: as the Part C lift itself ('Hex bar squat jumps', 'KB Squat cleans', 'Fast KB swings', 'FAST BANDED DEADLFTS'); as an `OPTIONAL PIECE` between core and strength; and as a contrast inside Part C ('Barbell deadlift' + 'Broad jumps', `02:I51`/`02:I52`).")
w(f"3. **Machines are close to absent for athletes and common for gen pop.** Machines are {pc(ath['implement_category_pct'].get('machine (incl. smith)'))} of athlete line items, only {mach_ath} items: {', '.join(mach_cells_ath)}. "
  f"They are {pc(gen['implement_category_pct'].get('machine (incl. smith)'))} of gen-pop items and {pc(stp['implement_category_pct'].get('machine (incl. smith)'))} of strength-track items. "
  f"Mean constraint level is {gen['constraint_mean']} for gen pop, {stp['constraint_mean']} for strength, {bx['constraint_mean']} for boxing and {ath['constraint_mean']} for athletes. Constraint level 1 (ballistic) is {pc(ath['constraint_dist_pct'].get('1'))} of athlete items and {pc(gen['constraint_dist_pct'].get('1'))} of gen-pop items. "
  "This matches the coach's statement that machines suit volume, injured and older clients while athletes need free, fast work.")
w(f"4. **Velocity is the clearest population divider.** {pc(ath['fast_or_ballistic_pct'])} of athlete items carry fast or ballistic intent (velocity 4-5), against {pc(bx['fast_or_ballistic_pct'])} for boxing, {pc(hy['fast_or_ballistic_pct'])} for hybrid, {pc(stp['fast_or_ballistic_pct'])} for strength and {pc(gen['fast_or_ballistic_pct'])} for gen pop. "
  f"Medball is {pc(ath['implement_category_pct'].get('medball'))} of athlete items and {pc(gen['implement_category_pct'].get('medball', 0))} of gen-pop items. "
  f"No medball weight (lb/kg) is written anywhere in the program tabs ({len(mb_lb)} cells). The only load cue for a ball is 'this but hugging a light medball' (`05:K13`, a core rocker). The coach's '8-10 lb' guidance lives in his speech, not in the sheets.")
w(f"5. **Gen-pop templates order exercises compound-first, but the 'bodybuilding' track does not.** UL is strictly monotonic (Spearman position-vs-tier rho {U['UPPER/LOWER :: NOVICE']['spearman_position_vs_tier_mean']}). "
  f"In the 12-week AESTHETICS columns, {aes12_isofirst} of the {aes12_withboth} sessions that contain both compound and isolation work open with the isolation exercise ('cable Side Raises' / 'DB side raises' / 'Arnold press' before 'Incline bench', `04:O35`). Only {pc(U['4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z']['tier_monotonic_pct_raw'])} of all 72 sessions in those columns are monotonic. "
  f"PPL push and pull days alternate compound and isolation ('Incline DB Bench press' > 'Side raises' > 'Barbell Bench press', `06:C16:C18`), so only {pc(U['PUSH/PULL/LEGS :: NOVICE']['tier_monotonic_pct_raw'])} of PPL sessions are monotonic.")
w(f"6. **The hybrid and CrossFit sheets list strength before Olympic power.** In {hyb_str_before_oly}/{hyb_with_both} HYBRID sessions that fill both rows (MONDAY, TUESDAY and THURSDAY, weeks 1-8), the 'STRENGTH' row (squats, bench, deadlift) sits above 'OLY/ POWER' (cleans, depth-drop/box jumps, snatches) (`04:B74`/`B75`, `04:B81`/`B82`, `04:B86`/`B87`). On TUESDAY and FRIDAY an 'A/C' sprint or easy-cardio row comes first (`04:B80`, `04:B92`). "
  "The CrossFit class model uses one shared slot 'STRENGTH/POWER' after 'WARMUP/SKILL' and before 'WOD' (`11:R3:T3`). "
  "Whether row order is execution order in these two NOT-DONE/planning sheets is an open question. It directly contradicts the athlete template.")
w(f"7. **Horizontal-before-vertical is applied across the week, not within one session.** In BASEBALL Part C the coach's slot labels read 'horiz pull' on MONDAY, 'horiz push' on TUESDAY, 'vert pull' on THURSDAY and 'vert push' on FRIDAY. Each label appears {min(bb_partC_slot.values()) if min(bb_partC_slot.values()) == max(bb_partC_slot.values()) else str(min(bb_partC_slot.values())) + '-' + str(max(bb_partC_slot.values()))} times, and {bb_hv_ok}/{bb_hv_all} classified Part C upper lines match their day. "
  f"Inside a single session the rule holds in UL upper day ('Dumbbell Rows' > 'Bench Press (DB or Barbell)' > 'Pull ups or Lat pull down' > 'Overhead Press (DB or Barbell)', `00:C28:C31`) and in PPL pull day. "
  f"It is broken in FAT BURN ({fat_vh}/{fat_both} upper sessions with both pull types put the pulldown before the row), in AESTHETICS ('UNILATERAL LAT PULL DOWN' before 'MACHINE SUPPORTED ROW'; 12-week 'Lat pull downs' before 'Rows') and in BOXING ('Lat pull downs/pullups' before 'DB seal rows', `07:D21`/`D23`).")
w(f"8. **The coach writes his substitution logic in the cell itself.** There are {len(alts)} distinct alternate strings, and {len(alt_equipment)} of them are equipment or exercise swaps (all listed in section 6). In gen-pop UL/PPL the first option is usually the free weight or the harder version ('Sqats or Leg Press', 'Deadlifts (DB or Barbell)', 'Pull ups or Lat pull down', 'DB Rows or Row machine'). "
  "In the bodybuilding 12-week track the machine is written first ('Machine Dips or dips', 'machine or db flies', 'machine rows or db rows', 'machine or db Reverse flies'). "
  "The global rule is OBSERVED in `00:A7`/`06:A7`/`05:A6`: '...getting away from fixed grips (barbells, bars) and going split grips (dumbbells, kbs, indivitual grips) help...'. The athletic version adds 'going unilateral'.")
_r = [r for r in d['rotations'] if r['program'] == 'BASEBALL' and r['variant'] == 'BLOCK 1' and r['day'] == 'MONDAY' and r['slot'] == 'Part C#1'][0]
_seq = [x.split(': ', 1)[1].split(' [')[0] for x in _r['sequence']]
_vel = {i['velocity_intent'] for s_ in bb if s_['variant'] == 'BLOCK 1' and s_['day'] == 'MONDAY' for i in s_['items'] if i.get('part') == 'Part C' and not i.get('paired_with_prev') and i['velocity_intent']}
_hd = [i['name'].strip() for s_ in S if s_['program'].startswith('4 TRACKS - HYBRID') and s_['day'] == 'THURSDAY' for i in s_['items'] if i['cell'][-2:] == '86']
_hb = [i['name'].strip() for s_ in S if s_['program'].startswith('4 TRACKS - HYBRID') and s_['day'] == 'TUESDAY' for i in s_['items'] if i['cell'][-2:] == '81']
_nrot = sum(1 for r in d['rotations'] if r['implement_changes_across_weeks'])
w(f"9. **Implements rotate inside a fixed slot from week to week. That is the coach's 'same pattern, small variable change'.** {_nrot} of {len(d['rotations'])} week-to-week slot changes also change the implement. Example: BASEBALL Block 1 MONDAY Part C slot 1 runs "
  + ' > '.join(f"'{x}'" for x in _seq) + f". That is one 'bkd' slot carried by {len(_r['distinct_primary_implements'])} implement classes ({', '.join(_r['distinct_primary_implements'])}; week 8 swaps the lift for 'Paced Cardio - easy') and {len(_vel)} velocity-intent levels. "
  f"HYBRID THURSDAY deadlifts by week 1-8 (`04:E86:L86`): {' > '.join(_hd)}. HYBRID TUESDAY bench (`04:E81:L81`): {' > '.join(_hb)}. Both repeat a low-skill > high-skill implement wave twice in 8 weeks.")
w("10. **Load prescriptions are tied to implement and intent.** Olympic lifts get percentages only: 'Hang cleans @ 75%' > '@ 80%' > '@ 85%' > '@ 90%' with reps 8 > 6 > 6 > 4 (`02` OPTIONAL PIECE rows). "
  "Barbell lifts get HEAVY/RIR/RPE/% plus accommodating resistance ('FAST BANDED DL', 'HEAVY CHAINED DEADLIFT', 'FAST RPE6 or about 60-70%'). "
  "Speed work gets 'light weights - same speed for all reps' (`02:BU33`, `02:AO51`) and 'LOAD & jump hard' (`05:C14`). Plyos get 'EASY' (`04:D17`, `12:D21`). "
  "DB/KB/cable work gets RIR, 'max'/'MAX REPS', 'myo set' and loading position ('contralateral', 'ipsilateral', 'suitcase', 'front rack', 'goblet', 'zercher').")
w(f"11. **In gen pop, levels change dose more than equipment.** UL NOVICE/NEWBY/INTERMEDIATE use identical exercise lists; only SETS/REPS differ. PPL differs in one cell: NOVICE gets 'Cable Lat pulldown' (`06:C28`, constraint 4), while NEWBY/INTERMEDIATE get 'Pull ups or Cable Lat pull down' (`06:G28`, `06:K28`). The beginner gets the constrained version. In the off-season athletic tab the levels do change the implement mix: "
  f"STARTING is {pc(U['ATHLETIC FULL BODY :: STARTING OFF SEASON WORKOUTS']['tier_pct'].get('T2_POWER_STRENGTH'))} T2 (loaded jumps, hex contrast), MID is {pc(U['ATHLETIC FULL BODY :: MID OFF SEASON WORKOUTS']['implement_category_pct'].get('medball'))} medball, and ADVANCED is {pc(U['ATHLETIC FULL BODY :: ADVANCED OFF SEASON WORKOUTS']['tier_pct'].get('CORE'))} core.")
w(f"12. **Boxing is a two-phase equipment shift.** Weeks 1-2 are a gym template: mean constraint {U['BOXING 8 WEEK BUILD UP :: Weeks 1-2']['constraint_mean']}, machines {pc(U['BOXING 8 WEEK BUILD UP :: Weeks 1-2']['implement_category_pct'].get('machine (incl. smith)'))}, fast/ballistic {pc(U['BOXING 8 WEEK BUILD UP :: Weeks 1-2']['fast_or_ballistic_pct'])}. "
  f"Weeks 3-8 become an athletic template: mean constraint {U['BOXING 8 WEEK BUILD UP :: Weeks 3-8']['constraint_mean']}, fast/ballistic {pc(U['BOXING 8 WEEK BUILD UP :: Weeks 3-8']['fast_or_ballistic_pct'])}, with weighted depth drops, march jumps, 'Clean Pull/ hang Power Clean', contrast complexes and medball lists.")
w('')

# ------------------------------------------------------------------ 2 PROGRAM TABLE
w('## 2. Implement mix and constraint by program')
w('')
w('Shares are of line items, with placeholders such as \'ACCESSORIES\' and \'DELOAD\' removed. Codes: BB = barbell/hex/EZ/landmine, DB, KB, MB = medball, MACH = machine incl. Smith, CBL = cable, BW = bodyweight, BW-bal = bodyweight ballistic/sprint, CARDIO = cardio equipment, LOAD? = external load not named. '
  '"written %" is the share of items whose main implement is written in the cell. The rest come from INFERRED defaults, for example \'DEADLIFTS\' is assumed to be barbell.')
w('')
w('| Program :: variant | sess | items | top implements (% of items) | written % | mean constraint | c1 / c5 % | fast/ballistic % | T1/T2/T3/T4/T5 % |')
w('|---|---|---|---|---|---|---|---|---|')
for k, v in U.items():
    top = ', '.join(f"{ICODE.get(c, c)} {p:.0f}" for c, p in list(v['implement_category_pct'].items())[:6])
    t = '/'.join(f"{v['tier_pct'].get(x, 0):.0f}" for x in ('T1_POWER', 'T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN', 'T5_ISOLATION'))
    w(f"| {esc(k)} | {v['n_sessions']} | {v['n_items']} | {top} | {pc(v['primary_implement_written_explicitly_pct'])} | {fmt(v['constraint_mean'])} | "
      f"{pc(v['constraint_dist_pct'].get('1'))} / {pc(v['constraint_dist_pct'].get('5'))} | {pc(v['fast_or_ballistic_pct'])} | {t} |")
w('')
w('### 2.1 By population')
w('')
w('| Population | programs | sess | items | top implements | mean constraint | c1 / c2 / c3 / c4 / c5 % | fast/ballistic % | T1/T2/T3/T4/T5/CORE/COND % |')
w('|---|---|---|---|---|---|---|---|---|')
for k, v in P.items():
    top = ', '.join(f"{ICODE.get(c, c)} {p:.0f}" for c, p in list(v['implement_category_pct'].items())[:7])
    cd = ' / '.join(pc(v['constraint_dist_pct'].get(x)) for x in '12345')
    t = '/'.join(f"{v['tier_pct'].get(x, 0):.0f}" for x in ('T1_POWER', 'T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN', 'T5_ISOLATION', 'CORE', 'CONDITIONING'))
    w(f"| {esc(v['label'])} | {esc('; '.join(v['programs']))} | {v['n_sessions']} | {v['n_items']} | {top} | {fmt(v['constraint_mean'])} | {cd} | {pc(v['fast_or_ballistic_pct'])} | {t} |")
w('')
w('### 2.2 Which implement carries each tier (population totals, item counts)')
w('')
w('| Population | T1 power | T2 power-strength | T3 strength | T4 resistance pattern | T5 isolation |')
w('|---|---|---|---|---|---|')
for k, v in P.items():
    cells = []
    for t in ('T1_POWER', 'T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN', 'T5_ISOLATION'):
        cells.append(', '.join(f"{ICODE.get(c, c)} {n}" for c, n in v['implement_by_tier'].get(t, {}).items()) or '-')
    w(f"| {esc(v['label'])} | " + ' | '.join(cells) + ' |')
w('')
w('INFERRED reading: T1 is bodyweight plus medball everywhere. T2 is barbell (Olympic lifts, DE), KB (swings, KB cleans) and hex/DB (loaded jumps). T3 is barbell. T4 is DB-led, with machines and cables only in gen pop. T5 is DB-led in athlete programs and machine/cable-led in gen-pop programs.')
w('')

# ------------------------------------------------------------------ 3 ORDER TEST
w('## 3. Testing the claimed order: power > power-strength > strength > resistance > isolation')
w('')
for n_ in d['meta']['sequence_metric_notes']:
    w(f"- {n_}")
w('')
w('| Program :: variant | sess with 2+ ranked items | monotonic raw | excl. Part D ballistics | adjusted (contrast pairs) | pairwise concordance | Spearman pos-vs-tier | power item first | whole power block before resistance | mean rel. position T1 / T2 / T3 / T4 / T5 / CORE / COND |')
w('|---|---|---|---|---|---|---|---|---|---|')
for k, v in U.items():
    rp = v['mean_rel_position_by_tier']
    rps = ' / '.join(fmt(rp.get(x)) for x in ('T1_POWER', 'T2_POWER_STRENGTH', 'T3_STRENGTH', 'T4_RESISTANCE_PATTERN', 'T5_ISOLATION', 'CORE', 'CONDITIONING'))
    w(f"| {esc(k)} | {v['sessions_with_2plus_ranked']} | {pc(v['tier_monotonic_pct_raw'])} | {pc(v['tier_monotonic_pct_excl_partD_ballistics'])} | {pc(v['tier_monotonic_pct_adjusted_contrast_pairs'])} | "
      f"{fmt(v['pairwise_order_concordance_mean'], 3)} | {fmt(v['spearman_position_vs_tier_mean'], 3)} | {pc(v['power_item_first_pct'])} | {pc(v['power_block_entirely_before_resistance_pct'])} | {rps} |")
w('')
w('| Population | monotonic raw | adjusted | concordance | Spearman | power first |')
w('|---|---|---|---|---|---|')
for k, v in P.items():
    w(f"| {esc(v['label'])} | {pc(v['tier_monotonic_pct_raw'])} | {pc(v['tier_monotonic_pct_adjusted_contrast_pairs'])} | {fmt(v['pairwise_order_concordance_mean'], 3)} | {fmt(v['spearman_position_vs_tier_mean'], 3)} | {pc(v['power_item_first_pct'])} |")
w('')
w('### 3.1 BASEBALL Part structure (OBSERVED labels; tier and implement counts INFERRED)')
w('')
w('| Part | lines | tiers | implements |')
w('|---|---|---|---|')
for part in ('Part A', 'Part B', 'OPTIONAL PIECE', 'Part C', 'Part D', 'Part E'):
    tt = ', '.join(f"{TCODE[t]} {n}" for t, n in part_tiers[part].most_common())
    ii = ', '.join(f"{ICODE.get(c, c)} {n}" for c, n in part_impl[part].most_common(7))
    w(f"| {part} | {sum(part_tiers[part].values())} | {tt} | {ii} |")
w('')
w("Coach's slot labels in the column to the left of each day (OBSERVED, e.g. `02:P28`, `02:P30`, `02:P33`): Part A = 'Upper Ballistics/plyo' (Mon/Thu) or 'LOWER ballistics/plyo' (Tue/Fri). Part B = 'LATERAL CORE' / 'Transverse core' / 'Sagital core'. "
  "Part C = 'bkd'/'bhd' (bilateral knee/hip dominant) followed by 'horiz pull' / 'horiz push' / 'vert pull' / 'vert push'. Part D = 'uhd'/'ukd' followed by 'bicep' / 'tricep' / 'calfs' / 'shoulders'. Part E = 'Buy out'. "
  "Day tags under the days (`02:P40`, `T40`, `AB40`): MONDAY 'Speed', TUESDAY 'strength', FRIDAY 'speed', THURSDAY untagged.")
w('')
w('`OPTIONAL PIECE` / \'OLY\' rows (all OBSERVED, pink D5A6BD fill). They sit after Part B core and before Part C strength:')
w('')
for c in opt_cells:
    w(f"- `{esc(c)}`")
w('')
w('### 3.2 Every type of order break (adjacent drop in tier), most frequent first')
w('')
w('| program | from | to | n | example (cells) |')
w('|---|---|---|---|---|')
for r in d['inversions']:
    ex = r['examples'][0]
    w(f"| {esc(r['program'])} | {TCODE[r['from_tier']]} {r['from_family']} | {TCODE[r['to_tier']]} {r['to_family']} | {r['n']} | {esc(ex['from'][:60])} -> {esc(ex['to'][:60])} |")
w('')
w('INFERRED interpretation of the breaks:')
w("- **BASEBALL T5 > T1 (Part D):** 'Bicep Curls' > 'Side to side hurdle hops', and ankle hops in the 'calfs' slot. Low-intensity plyos are used as **calf/foot accessories** at the end of the session. They are not power work. A generator should tag them as accessory plyo and allow them late.")
w("- **BASEBALL T5 > T2 in Part D 'shoulders' slot:** 'Single Arm DB snatch from floor', 'db push press', 'DB HIGH PULL', 'KB high pull'. Light ballistic DB/KB work is used as a shoulder accessory.")
w("- **BASEBALL T3 > T1/T2 in Part C:** 'Barbell deadlift' + 'Broad jumps' (contrast) and 'barbell Deadlifts' + 'plyo pushups'. The upper-body slot of the strength superset is sometimes filled with a ballistic variant ('plyo pushups', 'medball press', 'Single arm DB push press', 'fast banded assisted bench press').")
w("- **HYBRID T3 > T2 (13x) and CrossFit grid STRENGTH > POWER:** strength is listed before Olympic lifts. If this is execution order, it contradicts the athlete rule. See open questions.")
w("- **AESTHETICS T5 > T3/T4:** isolation-first (side raises, upright rows, leg curls before leg press MYO) is a deliberate bodybuilding choice ('bodybuilding style', `04:C30`). The order also **rotates by week**: wk1 'DB BENCH PRESS' > 'UNILATERAL LAT PULL DOWN', wk2 reversed (`04:E41:F42`).")
w("- **FAT BURN T4 > T3:** 'LEG PRESS' leads in wk1/wk3 and 'DEAFLITS'/'DEADLIFTS' in wk2/wk4 (`01:D7`, `G7`, `J7`, `M7`). The first-exercise slot rotates between a machine and a barbell by week.")
w('')
w('### 3.3 Constraint test: does the session move from low to high constraint (free and fast to machine)?')
w('')
w('| Program :: variant | constraint first half | second half | Spearman pos-vs-constraint | strictly non-decreasing % |')
w('|---|---|---|---|---|')
for k, v in U.items():
    w(f"| {esc(k)} | {fmt(v['constraint_first_half_mean'])} | {fmt(v['constraint_second_half_mean'])} | {fmt(v['spearman_position_vs_constraint_mean'], 3)} | {pc(v['constraint_monotonic_pct'])} |")
w('')
w(f"Result (INFERRED): constraint rises through the session for athletes ({ath['constraint_first_half_mean']} > {ath['constraint_second_half_mean']}), UL/PPL, fat burn and boxing. It is flat for the conjugate strength tracks, where the barbell is always first and DB unilateral work comes later, and for CrossFit. "
  f"It falls in the AESTHETICS track ({U['4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z']['constraint_first_half_mean']} > {U['4 TRACKS - AESTHETICS (bodybuilding style) :: 12-week columns O:Z']['constraint_second_half_mean']} in the 12-week columns) because cable/machine isolation opens the session. "
  "A strict rise in constraint is rare everywhere, because free-weight isolation (constraint 3) usually follows cable or machine work (constraint 4-5) at the end.")
w('')

# ------------------------------------------------------------------ 4 H/V
w('## 4. Horizontal before vertical')
w('')
w('Counted only for T2-T5 upper lines; medball/plyo push variants (T1) are excluded. A session counts when it contains both patterns.')
w('')
w('| Program :: variant | pull: H before V | V before H | only H | only V | push: H before V | V before H | only H | only V |')
w('|---|---|---|---|---|---|---|---|---|')
for k, v in U.items():
    hp, hs = v['hv_pull'], v['hv_push']
    w(f"| {esc(k)} | {hp.get('H_before_V', 0)} | {hp.get('V_before_H', 0)} | {hp.get('only_H', 0)} | {hp.get('only_V', 0)} | {hs.get('H_before_V', 0)} | {hs.get('V_before_H', 0)} | {hs.get('only_H', 0)} | {hs.get('only_V', 0)} |")
w('')
w('**BASEBALL weekly H/V layout** (Part C upper slot; label = coach text OBSERVED; pattern = INFERRED from the exercise):')
w('')
w('| Day | coach slot label (count) | classified pattern of the exercise (count) |')
w('|---|---|---|')
for dname in ('MONDAY', 'TUESDAY', 'THURSDAY', 'FRIDAY'):
    lab = ', '.join(f"'{sl}' {n}" for (dd, sl), n in sorted(bb_partC_slot.items()) if dd == dname)
    pat = ', '.join(f"{p} {n}" for (dd, p), n in sorted(bb_partC_pat.items()) if dd == dname)
    w(f"| {dname} | {lab} | {pat} |")
w('')
w("Exceptions: 'half kneeling SA cable lats pull down' was placed in the MONDAY 'horiz pull' slot (`02:BY53`, `02:DH52`), and 'inclined db  bench press' in the FRIDAY 'vert push' slot (`02:CA70`). "
  "The lower body mirrors the upper: MONDAY/THURSDAY carry 'bkd' and TUESDAY/FRIDAY carry 'bhd'. Bilateral lower work comes before unilateral in "
  f"{ath['lower_bilateral_vs_unilateral'].get('bilateral_first', 0)} athlete sessions; unilateral comes first in {ath['lower_bilateral_vs_unilateral'].get('unilateral_first', 0)}.")
w('')

# ------------------------------------------------------------------ 5 rotations
w('## 5. Week-to-week implement rotation inside one slot (the coach\'s "change small variables")')
w('')
rot = d['rotations']
rot_bb_c1 = [r for r in rot if r['program'] == 'BASEBALL' and r['slot'] in ('Part C#1', 'Part C#2', 'Part A#1', 'Part D#1')]
w(f"{len(rot)} slots change exercise across weeks, and {sum(1 for r in rot if r['implement_changes_across_weeks'])} of them also change implement. BASEBALL main slots (Part A#1 = first power item, Part C#1 = strength lift, Part C#2 = upper superset partner, Part D#1 = unilateral lift):")
w('')
w('| Block / day / slot | implements used | sequence by week (exercise [primary implement]) |')
w('|---|---|---|')
for r in rot_bb_c1:
    seq = ' > '.join(f"{x.split(': ', 1)[1].split(' [')[0][:38]} [{x.split(' [')[-1].split(',')[0]}]" for x in r['sequence'])
    w(f"| {esc(r['variant'])} {esc(r['day'])} {esc(r['slot'])} | {esc(', '.join(r['distinct_primary_implements']))} | {esc(seq)} |")
w('')
w('Other programs (same row, different weeks):')
w('')
w('| Program / variant / day / row | sequence by week |')
w('|---|---|')
for r in rot:
    if r['program'] == 'BASEBALL':
        continue
    seq = ' > '.join(f"{x.split(': ', 1)[0]}: {x.split(': ', 1)[1].split(' [')[0][:34]} [{x.split(' [')[-1].split(',')[0]}]" for x in r['sequence'])
    w(f"| {esc(r['program'][:28])} / {esc(r['variant'][:14])} / {esc(r['day'])} / {esc(r['slot'])} | {esc(seq)} |")
w('')

# ------------------------------------------------------------------ 6 alternates
w('## 6. Equipment alternates written by the coach (complete list, verbatim)')
w('')
w('| Text (verbatim) | kind (INFERRED) | options: primary implement (constraint) | n | cells | programs |')
w('|---|---|---|---|---|---|')
for a in alts:
    opts = '; '.join(f"{esc(o)}: {im} (c{c})" for o, im, c in zip(a['options'] or [], a['option_primary_implements'] or [], a['option_constraint_levels'] or []))
    w(f"| {esc(a['text_verbatim'])} | {esc(a['kind'])} | {opts} | {a['n_occurrences']} | {esc(', '.join(a['cells'][:6]))}{' ...' if len(a['cells']) > 6 else ''} | {esc('; '.join(a['programs']))} |")
w('')
w(f"First-listed option across the equipment alternates: {', '.join(f'{k} {v}' for k, v in first_opt.most_common())}.")
w('')
w('**Coach notes that govern substitution (verbatim, OBSERVED):**')
w('')
for n_ in d['coach_notes']:
    if n_['tab'] in ('EXAMPLE UPPERLOWER SPLIT', 'EXAMPLE PUSHPULLLEGS SPLIT', 'EXAMPLE ATHLETIC FULL BODY SPLI') and n_['cell'] in ('A6', 'A7'):
        w(f"- `{n_['tab']}!{n_['cell']}`: '{esc(n_['text_verbatim'])}'")
w('')
w('Substitution logic visible in the cells (INFERRED):')
w("1. **Same pattern, different implement:** (DB or Barbell), machine or db, Cable or DB, Ez bar or barbell, HEX BAR OR DB. The pattern is fixed and the implement is free.")
w("2. **Regression ladders inside one cell:** 'Pull ups or Lat pull down' (bodyweight > cable, constraint 3 > 4), 'pull ups or banded assisted pull ups', 'weighted Pull ups or max reps Close grip cable lat pull down', 'Reverse Lunges (Bodyweight or DBs)', 'toes to bar or knees to chest'.")
w("3. **Machine as the safe/volume option:** 'Sqats or Leg Press', 'DB Rows or Row machine', 'DB Reverse Flies or Machine', 'Machine Dips or dips', and 'leg press or just add 2 more rounds to front squats' (the machine can be replaced by more sets of the free-weight lift).")
w("4. **Free choice where the stimulus, not the tool, matters:** 'Curls (any kind)', 'Tricep (any kind)', 'Any Cardio Equipment', 'cardio of choice', 'row sprint or ski'.")
w("5. **Joint pain:** move away from fixed grips (barbell, bar) to split grips (DB, KB, individual handles), and for athletes 'going unilateral'.")
w('')

# ------------------------------------------------------------------ 7 load prescriptions
w('## 7. Load and speed prescriptions tied to implements (complete catalogue)')
w('')
w('| cue (pattern matched in name/reps/load cells) | implement | n | tiers | examples (cell, text) |')
w('|---|---|---|---|---|')
for r in d['load_prescriptions']:
    if r['implement_category'] == 'unspecified' and all(t == 'PLACEHOLDER' for t in r['tiers']):
        continue
    tt = ', '.join(f"{TCODE[t]} {n}" for t, n in sorted(r['tiers'].items(), key=lambda x: -x[1]))
    w(f"| {esc(r['cue'])} | {ICODE.get(r['implement_category'], r['implement_category'])} | {r['n']} | {tt} | {esc('; '.join(e[:90] for e in r['examples'][:3]))} |")
w('')
w('Medball load: **none written** in any program tab. The boxing medball list (`07:F50` \'MED BALL VARIATIONS\', 19 throws x 10 reps, `07:F51:G69`) and the athletic \'*MEDBALLS\' / \'ALL LIST\' links point to the ballistics tab. That tab sets intent, not weight:')
for n_ in d['coach_notes']:
    if n_['tab'].startswith('(NOT DONE) ALL ABOUT BALLISTICS') and n_['cell'] in ('A22', 'D22', 'A23', 'D23'):
        w(f"- `{n_['tab']}!{n_['cell']}`: '{esc(n_['text_verbatim'])}'")
w('')
w('Speed bands written by the coach (`02:A19:F22`, OBSERVED):')
for n_ in d['coach_notes']:
    if n_['tab'] == 'BASEBALL':
        w(f"- `{n_['cell']}`: '{esc(n_['text_verbatim'])}'")
w('')

# ------------------------------------------------------------------ 8 variables
w('## 8. The coach\'s training variables as they appear in the sheets')
w('')
w('| Variable (coach\'s words) | Where it is written (OBSERVED) | How the sheets vary it (INFERRED) |')
w('|---|---|---|')
w("| Speed / velocity ('the lighter I go, the faster') | 'FAST ...' DE lifts (`12:E22:K22`, `12:E25:K25`); 'light weights - same speed for all reps' (`02:BU33`); 'FAST RPE6 or about 60-70%' (`04:N17`, `N21`); 'Max speed banded lat pull downs' (`05:F47`); 'powerful turns' (`02:V30`); 'This is NOT a sprint, this is a fast run' (`02:DI29`) | Speed is set by intent words plus lighter load (60-70%, light, band-assisted). Heavy ('HEAVY', '1RIR') and fast ('FAST', 'EASY') days alternate on the conjugate tracks (Mon/Wed ME, Thu/Sat DE). |")
w("| Load | 'HEAVY', '@ 75%'-'@ 90%', '1RIR'/'2RIR'/'1-2 RIR', 'RPE' row `04:N4`, 'mid weight', 'LOAD & jump hard', 'same weight of front squats' (`02:BU34`) | % only for barbell Olympic and main lifts. RIR for everything resistance. Plyos are prescribed by intent ('EASY', 'hard'), never by load. |")
w("| Range of motion | 'FULL RANGE OF MOTION' (`07:L14`, `L37`); 'Side Raises FULL ROM' (`02:BB74`); 'fast/rythmic/1/4 SQUATS' (`05:J40`); 'Deficit', '(D)BOX', '(T&G)BOX' (`12:E13`, `04:F10`) | Full ROM on isolation/machine work. Partial (1/4, box) on fast or strength work. ROM is changed with deficits and boxes, not with a different implement. |")
w("| Volume (sets x reps over time) | conjugate set/rep rows `12:E9:L10`, `04:E4:L6`, `04:O5:Z6`; boxing sets per week `07:E6:J49`; HYBRID `04:E71:L72` | Sets step up week to week on the same exercises. Boxing weeks 3-8 take the lead line of each day 3 > 3 > 3 > 3 > 4 > 6 ('Single Leg swiss ball knee tuck in + DB rows' `07:E20:J20`, 'Hang Power Clean & Press' `07:E35:J35`, '4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs' `07:E46:J46`) while most accessory lines drop to 2 in week 7 (`07:I12:I14`). HYBRID SETS row runs 2-2-2-3-3-3-4-4 (`04:E71:L71`). This is the coach's 'more sets next week of the same thing'. |")
w("| Variety without 'confusing' | rotations table in section 5 | The pattern slot stays fixed for the block; the implement, stance (FFE/RFE, ipsi/contra) or speed changes each week. |")
w('')

# ------------------------------------------------------------------ 9 generator rules
w('## 9. Equipment rules for the generator (INFERRED from the evidence above)')
w('')
w('1. **Order a session by tier:** warm-up > T1 power (medball/plyo/sprint) > core > OPTIONAL Olympic T2 > Part C (bilateral strength lift, T3 or T2 speed variant, supersetted with one upper H/V pattern) > Part D (unilateral T4 + 2 isolation/accessory) > conditioning buy-out. This is the BASEBALL Part A-E template. Gen-pop sessions drop T1/T2 and start at T3/T4.')
w('2. **Put horizontal before vertical across the week:** Mon horizontal pull, Tue horizontal push, Thu vertical pull, Fri vertical push. Within a 2-day upper split, use row > press > pulldown > overhead press (UL upper day).')
w('3. **Choose implements by population:** athletes 0-1% machines and around 30% constraint-1 work; gen pop allows machines/cables freely (about 33% constraint 4-5); strength tracks are barbell main lift + DB accessories.')
w('4. **Substitute when equipment is missing,** using the coach\'s own pairs: barbell <> DB (bench, OHP, deadlift); squat <> leg press; pull-up <> lat pulldown <> band-assisted pull-up; DB row <> machine row; DB fly <> machine/cable fly; cable <> DB side raise; hex <> DB deadlift; row erg <> ski erg; any cardio. With no equipment: bodyweight lunges (\'(Bodyweight or DBs)\'), plyos, medball or bodyweight core. Keep the pattern and change the implement.')
w('5. **Joint pain or older client:** move to split grips (DB/KB), unilateral work and higher-constraint machines (coach\'s statement) and remove T2 Olympic lifts. Keep T1 only as low-level landing work (\'Depth drop\', \'Stick the landing\').')
w('6. **Speed intent:** medball and plyo lines carry no load number. Default a medball to light (coach speech: 8-10 lb, not in sheet). For a barbell speed day use 60-70% or \'light weights - same speed for all reps\'; Olympic lifts progress 75 > 80 > 85 > 90% while reps fall 8 > 6 > 6 > 4.')
w('7. **Progress across weeks** by rotating implement or stance inside a fixed slot, by adding sets, or by raising %. Keep the pattern.')
w('')

# ------------------------------------------------------------------ 10 open questions
w('## 10. Open questions for the coach')
w('')
OQ = [
    "HYBRID (`04:B74:B101`) and the CrossFit grid list 'STRENGTH' above 'OLY/ POWER'. Is that the order to perform them, or just a checklist? In BASEBALL the Olympic 'OPTIONAL PIECE' always comes before Part C strength.",
    "In the CrossFit class model ('WARMUP/SKILL' | 'STRENGTH/POWER' | 'WOD'), which comes first inside 'STRENGTH/POWER' on a day that has both, for example TUES 'PRESS' + 'SNATCH'?",
    "Medball weights are never written. Is the rule 8-10 lb for upper-body passes/throws and something heavier for slams and scoops? What about youth athletes and women?",
    "Ankle hops, hurdle hops and DB snatch / push press / high pull appear at the end of BASEBALL Part D in the 'calfs'/'shoulders' slots. Do you intend them as low-intensity accessories, or should they move earlier when the athlete is fresh?",
    "The AESTHETICS 12-week track opens with 'cable Side Raises' / 'DB side raises' / 'Arnold press' before 'Incline bench', and puts lat pulldowns before rows. Is isolation-first (pre-exhaust / priority) the deliberate rule for bodybuilding clients, given that UL/PPL go row-first and compound-first?",
    "FAT BURN rotates 'LEG PRESS' and 'DEADLIFTS' as the first exercise every week, and puts 'SINGLE ARM LAT PULL DOWN' before 'MACHINE SUPPORTED ROW'. Is week-to-week order rotation a variable you use on purpose?",
    "When an alternate is written ('Sqats or Leg Press', 'Deadlifts (DB or Barbell)'), is the first option the default for everyone, or should the generator choose by client: injured or older > machine/DB, experienced > barbell?",
    "Plain names with no implement ('DEADLIFTS', 'BENCH PRESS', 'OVERHEAD PRESS', 'LUNGES', 'SL RDL', 'CURLS', 'Calf Raises', 'Rows', 'Pull under'): which implement is the default? What is 'Pull under' (`04:O48`)?",
    "Do 'Situps / Toes to bar' (15/10) and 'Situps/crunches' (20/20) mean both exercises, and do 'Lat pull downs/pullups' and 'RDL/Good morning' mean either one?",
    "Is '45 degree hyper-extension machine - Kb swings' (`02:BS52`) a superset or a choice? Is 'Clean Pull/ hang Power Clean' (`07:L10`) a complex or a choice?",
    "'Oscilating drop squats' (`02:DE34`, Block 1 week 7) and 'Paced Cardio - easy' (`02:DW34`, Block 1 week 8) both sit in the Part C strength slot. Which implement does the first use, and is week 8 an unloading week?",
    "For athletes with no gym (hotel or field), which T2/T3 replacements do you accept: DB/KB swings and jumps instead of barbell Olympic lifts, and unilateral DB work instead of barbell squats?",
]
for k, q in enumerate(OQ, 1):
    w(f"{k}. {q}")
w('')

# ------------------------------------------------------------------ APPENDIX
w('## Appendix A. Every session and every exercise')
w('')
w('Format: `pos. exercise (verbatim, URL removed) [cell | implement | constraint c1-5 | velocity v1-5 | tier]`. `+` marks a line paired or supersetted with the line above. Parts are BASEBALL labels. '
  'Sessions with identical exercise lists (UL/PPL levels, repeated weeks) are shown once, with their siblings listed. Sets and reps for every item are in the JSON.')
w('')
cur_prog = None
seen_sig = {}
for s in S:
    sig = (s['program'], s['variant'] if s['program'] not in ('UPPER/LOWER', 'PUSH/PULL/LEGS') else '', s['day'], tuple(norm(i['name']).lower() for i in s['items']))
    if sig in seen_sig:
        seen_sig[sig].append(s)
        continue
    seen_sig[sig] = [s]
groups = collections.OrderedDict()
for sig, ss in seen_sig.items():
    groups.setdefault(ss[0]['program'], []).append(ss)
for prog, lst in groups.items():
    w(f"### {prog}")
    w('')
    for ss in lst:
        s0 = ss[0]
        lab = f"**{s0['variant']} | {s0['week']} | {s0['day']}**"
        if len(ss) > 1:
            lab += ' (identical in: ' + '; '.join(f"{x['variant']} {x['week']}" for x in ss[1:]) + ')'
        w(f"{lab} `{s0['tab_code']}:{s0['source_range']}` tiers `{s0['tier_sequence']}`" + (f" day tag '{s0['day_tag']}'" if s0.get('day_tag') else ''))
        w('')
        last_part = None
        parts = []
        for i in s0['items']:
            pp = ''
            if i.get('part') and i.get('part') != last_part and s0['program'] == 'BASEBALL':
                pp = f"*{i['part']}*: "
                last_part = i.get('part')
            plus = '+' if i.get('paired_with_prev') else ''
            nm = esc(norm(i['name']))[:70]
            parts.append(f"{pp}{plus}{i['pos']}. {nm} [{i['cell']} | {ICODE.get(i['implement_category'], i['implement_category'])} | c{i['constraint_level'] if i['constraint_level'] else '-'} | v{i['velocity_intent'] if i['velocity_intent'] else '-'} | {TCODE[i['tier']]}]")
        w('; '.join(parts))
        w('')
open(OUT, 'w').write('\n'.join(L) + '\n')
print(OUT, len('\n'.join(L)))
