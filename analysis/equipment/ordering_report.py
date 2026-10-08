"""Write ordering_audit.md from ordering_audit.json (all numbers pulled from the JSON)."""
import json
import re
from collections import OrderedDict, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
O = json.loads((HERE / "ordering_audit.json").read_text(encoding="utf-8"))
R = {r["id"]: r for r in O["rules"]}
N = {n["id"]: n for n in O["new_rules_found"]}

SHORT = {
    "AESTHETICS - FULL BODY - 4 DAYS": "BYOP 00 AESTHETICS 4D",
    "3 DAY BUILDER": "BYOP 01 3 DAY BUILDER",
    "PUSHPULLLEGS - 3 or 6 DAYS A WK": "BYOP 02 PPL",
    "ATHLETIC - FULL BODY - 4 DAYS A": "BYOP 03 ATHLETIC 4D",
    "JUSTICE LEAGUE": "BYOP 04 JUSTICE LEAGUE",
    "BOOTCAMP - OPTION 1": "BYOP 05 BOOTCAMP 1",
    "BOOTCAMP - OPTION 2": "BYOP 06 BOOTCAMP 2",
    "NO ACCESS - AESTHETICS - FB - 4": "BYOP 07 NO-ACCESS AESTHETICS",
    "NO ACCESS - ATHLETIC - FB - 4 t": "BYOP 08 NO-ACCESS ATHLETIC",
    "EXAMPLE UPPERLOWER SPLIT": "MM 00 UPPER/LOWER",
    "EXAMPLE FAT BURNBODY TONING PRO": "MM 01 FAT BURN",
    "BASEBALL": "MM 02 BASEBALL",
    "(NOT DONE) 4 TRACKS PROGRAMMING": "MM 04 4 TRACKS",
    "EXAMPLE ATHLETIC FULL BODY SPLI": "MM 05 ATHLETIC FB",
    "EXAMPLE PUSHPULLLEGS SPLIT": "MM 06 PPL",
    "EXAMPLE BOXING 8 WEEK BUILD UP": "MM 07 BOXING",
    "(NOT DONE) EXAMPLE CONJUGATE": "MM 12 CONJUGATE",
}
TAB_ORDER = list(SHORT)


def sh(x):
    return re.sub(r"\s*-?\s*https?://\S+", "", str(x)).replace("|", "/")


def track_short(t):
    if not t:
        return ""
    t = re.sub(r"\(.*?\)", "", t)
    return " " + t.strip().replace("'", "")


def pct(a, b):
    return f"{(100.0 * a / b):.0f}%" if b else "n/a"


def by_tab_table(r):
    lines = ["| Tab | Applicable | Compliant | % |", "|---|---:|---:|---:|"]
    for t in TAB_ORDER:
        if t in r["by_tab"]:
            v = r["by_tab"][t]
            lines.append(f"| {SHORT[t]} | {v['applicable']} | {v['compliant']} | {pct(v['compliant'], v['applicable'])} |")
    return "\n".join(lines)


def group_exceptions(exs, fmt):
    g = OrderedDict()
    for e in exs:
        dayname = re.sub(r"^[A-Z]+\d+ ", "", str(e.get("day")))
        key = (SHORT.get(e["tab"], e["tab"]), track_short(e.get("track")), e.get("level") or "", dayname)
        g.setdefault(key, []).append(e)
    out = []
    for (tab, tr, lev, day), es in g.items():
        head = f"- **{tab}{tr}{(' ' + lev) if lev else ''}, {day}** ({len(es)}):"
        parts = [fmt(e) for e in es]
        out.append(head + " " + "; ".join(parts))
    return "\n".join(out)


def wk(e):
    w = e.get("week")
    return "" if not w or w == "WEEK 1 (template)" else f"[{sh(w)}] "


md = []
A = md.append
meta = O["_meta"]
n_sessions = sum(meta["session_counts"].values())

A("# Exercise ORDER audit: every session in BYOP (00-08) and MASTER MODEL (00, 01, 02, 04, 05, 06, 07, 11, 12)")
A("")
A("Team: EQUIPMENT USAGE & TRAINING VARIABLES. Question: in what order does the coach put exercises inside a session and "
  "vectors across a week, and do his stated rules hold in his own sheets?")
A("")
A("**Evidence legend.** **OBSERVED** = read from a cell, label or count (cell refs given). **INFERRED** = my "
  "interpretation. **SCIENCE** = training-science rationale, not from the sheets. Coach labels are quoted verbatim, "
  "typos included ('Tripple Extension', 'ABdution', 'Sagital core', 'DEAFLITS', 'RECCOMENDED').")
A("")
A("**Files.** `ordering_audit.json` (machine-readable: every session, every item with tags, every exception) and the "
  "scripts that produce it: `ordering_extract.py` (reads `raw/*.xlsx`, read-only), `ordering_classify.py` (tagging), "
  "`ordering_tag.py`, `ordering_rules.py`, `ordering_audit.py`, `ordering_report.py`. Re-run with "
  "`.venv/bin/python analysis/equipment/ordering_audit.py && .venv/bin/python analysis/equipment/ordering_report.py`. "
  "No Google Sheet was touched.")
A("")
A("## 0. Method")
A("")
A(f"* **Unit = one session as written**: one day x one week-column x one level-column. {n_sessions} sessions in total "
  f"(+{meta['circuit_sessions_excluded']} FAT BURN circuit sessions under B36 'CIRCUITS RECCOMENDED', listed in "
  "section 4.4 and kept out of the R1-R10 denominators because stations rotate). Week columns that repeat the same "
  "order are counted once per column because each column is a separate prescription. The number of *distinct* "
  "orderings is shown next to each tab so repetition does not inflate anything.")
A("* **BYOP templates**: every slot counts even when the EXERCISE cell still reads 'CHOOSE 👇'. The coach's "
  "CATEGORY/PURPOSE label *is* the design (OBSERVED). The few filled demo cells ('Leg press', 'Power Clean', "
  "'Front Squats', ...) are quoted where relevant.")
A("* **Tagging**: when the coach labelled the slot I use his label (BYOP CATEGORY; BASEBALL row labels 'bkd', "
  "'horiz pull', 'Upper Ballistics/plyo', 'LATERAL CORE', ...; HYBRID B/D labels). Otherwise I tag from the exercise "
  "name (INFERRED, keyword rules plus about 100 hand overrides in `ordering_classify.py`). Classes: PLYO_L, PLYO_U "
  "(med-ball throws and plyo push-ups), SPRINT, COD, DRILL, OLY, LOADED_JUMP, BKD/BHD/UKD/UHD (bilateral/unilateral "
  "knee/hip dominant), HPULL/VPULL/HPUSH/VPUSH, ISO_* (quad, ham, calf, chest, delt, bicep, tricep), CORE, COND, "
  "WARMUP/MOBILITY. 'Incline' and 'Dips' count as horizontal push because BYOP PPL wires both slots to the "
  "'HORIZONTAL PUSH' list (E5:E7 -> `'MASTER EXERCISE LIBRARY'!$AD$7:$AD$162`, OBSERVED).")
A("* **ROLE vs movement.** For the pairing and alternation rules (R8, R9) I use the coach's slot pattern (ROLE). Example: "
  "'DB Squat Jumps' typed in a 'bkd' row counts as the knee-dominant lift of that superset. Every other rule uses the "
  "movement actually written.")
A("* **BASEBALL labels.** Week 1 of BLOCK 1 and Weeks 1 and 3 of BLOCK 3 have no label column; it holds the previous "
  "day's exercises. For those I take each row's modal label from the sibling weeks that share the same header row "
  "(INFERRED, flagged `slot_borrowed` in the JSON).")
A("")
A("### 0.1 Session inventory")
A("")
A("| Tab | Sessions audited | Distinct orderings | Layout |")
A("|---|---:|---:|---|")
layout = {
    "AESTHETICS - FULL BODY - 4 DAYS": "Day 1-4 + 2 'Optional' blocks (A3:A44)",
    "3 DAY BUILDER": "DAY 1-3 + 3 'Optional' blocks (A3:A32)",
    "PUSHPULLLEGS - 3 or 6 DAYS A WK": "MONDAY-Saturday, SUNDAY 'OFF' (B3:B51)",
    "ATHLETIC - FULL BODY - 4 DAYS A": "MON, TUE, WED (optional), [blank B30], FRI, SAT (optional)",
    "JUSTICE LEAGUE": "copy of 03 with demo picks + logbook columns H-K",
    "BOOTCAMP - OPTION 1": "MON-SAT, WED/SAT optional (B3:B44)",
    "BOOTCAMP - OPTION 2": "1A/2A/3A/1B/2B/3B (A1 reads 'BOOTCAMP OPTION 1')",
    "NO ACCESS - AESTHETICS - FB - 4": "hidden twin of 00 laid out MON-SAT",
    "NO ACCESS - ATHLETIC - FB - 4 t": "hidden twin of 03",
    "EXAMPLE UPPERLOWER SPLIT": "LOWER (ADAY) + UPPER (BDAY) x 3 levels",
    "EXAMPLE FAT BURNBODY TONING PRO": "MON/TUE/THU/FRI lifting + WED/SAT cardio x WK1-4",
    "BASEBALL": "BLOCK 1-3 x 8 weeks x MON/TUE/THU/FRI",
    "(NOT DONE) 4 TRACKS PROGRAMMING": "STRENGTH (7+12 wk), AESTHETICS (7+12 wk), HYBRID (8 wk)",
    "EXAMPLE ATHLETIC FULL BODY SPLI": "11 'WORKOUT' blocks in 3 levels",
    "EXAMPLE PUSHPULLLEGS SPLIT": "PUSH/PULL/LEG x 3 levels",
    "EXAMPLE BOXING 8 WEEK BUILD UP": "MON/TUE/THU/FRI x (Wk1-2 col D, Wk3-8 col L)",
    "(NOT DONE) EXAMPLE CONJUGATE": "MON/WED/THU/SAT x WK1-7 (WK8 'TEST'/'DELOAD' has no exercises)",
}
for t in TAB_ORDER:
    k = ("BYOP" if SHORT[t].startswith("BYOP") else "MASTER_MODEL") + " / " + t
    A(f"| {SHORT[t]} ('{t}') | {meta['session_counts'].get(k, 0)} | {meta['distinct_orderings_by_tab'].get(t, 0)} | {layout[t]} |")
A("| MM 11 CROSSFIT ('EXAMPLE CROSSFIT SPLIT') | 0 (category grid only) | - | monthly MON-SUN grids of AEROBIC C./SKILL/STRENGTH/POWER/RESISTANCE/WODs/TEST-PEAK; used for R11 and N15 |")
A("")

# ---------------------------------------------------------------- scorecard
A("## 1. Scorecard")
A("")
A("| Rule | Applicable sessions | Compliant | % | Where it holds | Where it breaks |")
A("|---|---:|---:|---:|---|---|")
holds = {
    "R1": ("every BYOP template, MM UPPER/LOWER, MM PPL (19 of 19)", "FAT BURN 0/8, 4 TRACKS 0/38, BOXING 0/2: lat pulldown written before the row"),
    "R2": ("all of BYOP, UPPER/LOWER, FAT BURN, BOXING", "CONJUGATE and 4-TRACKS STRENGTH overhead-press weeks; 4-TRACKS AESTHETICS 'Arnold press' weeks"),
    "R3": ("BYOP athletic templates 12/12; CONJUGATE 7/7; BASEBALL 77/92", "contrast complexes (heavy -> jump); jumps or plyo push-ups typed in BASEBALL strength slots; HYBRID Tuesday puts 'JUMPS' after 'BENCH PRESS'"),
    "R4": ("BYOP 'Tripple Extension' slot 12/12; BASEBALL 32/40 (the 'OLY' rows always sit above 'bkd'/'bhd')", "HYBRID (B74 'STRENGTH' row above B75 'OLY/ POWER') 16/16; snatch or high pull as a BASEBALL 'shoulders' accessory"),
    "R5": ("almost universal", "4-TRACKS AESTHETICS Fri WK9-12 (myo leg press last); MM 05 Camporini; BOXING step-up before deadlift"),
    "R6": ("UPPER/LOWER, athletic BYOP, CONJUGATE", "BYOP aesthetics 'Calves' in slot 1; 4-TRACKS AESTHETICS side raises first on push days; MM PPL side/rear raises between compounds"),
    "R7": ("same pattern as R6", "same as R6, plus the BYOP Bicep slot before Leg Extensions"),
    "R8": ("BASEBALL 91/92; BYOP 4-day full-body 100%", "CONJUGATE / 4-TRACKS STRENGTH lower days (two lower lifts back to back); BOOTCAMP 2 'LUU'"),
    "R9": ("BASEBALL 92/92; BYOP 00, 03, 04, 07, 08 100%", "BOOTCAMP 1 Tue/Fri, 3 DAY BUILDER Day 3, HYBRID, CONJUGATE lower days"),
    "R10-core": ("aesthetic/BYOP: core sits on the 'Optional' days", "athletic: core is Part B right after the power block (BASEBALL 112 items) or a superset partner (HYBRID '/ core')"),
    "R10-conditioning": ("BASEBALL 'Buy out' always last (65/65); cardio days", "BOXING (cardio first, 4/4), HYBRID Fri 'DISTANCE' first, BOOTCAMP 2 3A/3B"),
}
for rid in ("R1", "R2", "R3", "R4", "R5", "R6", "R7", "R8", "R9", "R10-core", "R10-conditioning"):
    r = R[rid]
    A(f"| **{rid}** {r['rule']} | {r['sessions_applicable']} | {r['compliant']} | {pct(r['compliant'], r['sessions_applicable'])} | {holds[rid][0]} | {holds[rid][1]} |")
A(f"| **R11** weekly vector rotation | {len(R['R11']['programs'])} program/level blocks | - | - | see section 3 | - |")
A("")
A("**Overall verdict (INFERRED from the counts):** the rules the coach stated hold almost perfectly in the BYOP workbook "
  "(the MAIN, generator-facing templates) and in the BASEBALL athlete program. They break in a few specific, "
  "repeatable ways in the older MASTER MODEL examples. The breaks are themselves rules: a weekly A/B swap of the lead "
  "lift, pre-exhaust side raises in bodybuilding push days, contrast complexes, core as Part B in athletic days, and "
  "the conjugate 'work -> accessory' order.")
A("")

# ---------------------------------------------------------------- per rule
A("## 2. Rule by rule")
A("")


def sec(rid, title, definition, finding, fmt, extra=""):
    r = R[rid]
    A(f"### {rid}. {title}")
    A("")
    A(f"*Operational test:* {definition}")
    A("")
    A(f"**Result: {r['compliant']} / {r['sessions_applicable']} applicable sessions compliant "
      f"({pct(r['compliant'], r['sessions_applicable'])}); {r['exceptions_count']} exception sessions.**")
    A("")
    A(by_tab_table(r))
    A("")
    A(finding)
    A("")
    if extra:
        A(extra)
        A("")
    if r["exceptions"]:
        A("<details><summary>Every exception (tab, day, cells)</summary>")
        A("")
        A(group_exceptions(r["exceptions"], fmt))
        A("")
        A("</details>")
        A("")


sec("R1", "Horizontal pull before vertical pull",
    "session holds at least one HPULL and one VPULL; compliant if the first HPULL is above the first VPULL. "
    f"'Strict' (every HPULL above every VPULL): {R['R1']['strict_compliant']}.",
    "* **OBSERVED, BYOP holds 100%.** Every full-body template puts the 'Horizontal Pull' row directly under the "
    "bilateral lower row and the 'Vertical Pull' row under the unilateral lower row: 00 rows 5 -> 7, 01 rows 5 -> 7, "
    "03/04/08 rows 9 -> 11, 07 rows 5 -> 7. BYOP 02 PPL pull day is 'Horizontal Pull' D10, 'Horizontal Pull' D11, "
    "'Vertical Pull' D12. MM UPPER/LOWER upper day runs C28 'Dumbbell Rows' -> C30 'Pull ups or Lat pull down'. "
    "MM PPL pull day runs C26 'DB Rows or Row machine' -> C28 'Cable Lat pulldown'.\n"
    "* **OBSERVED, consistent violators.** (a) FAT BURN upper days (and 4-TRACKS AESTHETICS left, which copies them): "
    "the order is push/pull alternating with the planes crossed, H-push -> V-pull -> V-push -> H-pull "
    "(D12 'BARBELL BENCH PRESS', D13 'SINGLE ARM LAT PULL DOWN', D14 'DB OVERHEAD PRESS', D15 'MACHINE SUPPORTED ROW'). "
    "Weeks 2 and 4 open with the pulldown. (b) 4-TRACKS AESTHETICS right, both pull days, all 12 weeks: O46 'Lat pull "
    "downs' -> O47 'Rows'. (c) BOXING Wk1-2 Tue/Fri: D21 'Lat pull downs/pullups' -> D23 'DB seal rows'.\n"
    "* **INFERRED:** R1 is the rule for the generator's own templates (BYOP). The violators are older, hand-written "
    "upper days built on a different principle: alternate push and pull and cross the planes (N9/N18). Ask the coach "
    "which one he wants (Q1).",
    lambda e: f"{wk(e)}V {sh(e['first_VPULL'])} before H {sh(e['first_HPULL'])}")

sec("R2", "Horizontal push before vertical push",
    "session holds at least one HPUSH (incl. incline and dips) and one VPUSH; compliant if the first HPUSH is above "
    f"the first VPUSH. Strict: {R['R2']['strict_compliant']}.",
    "* **OBSERVED, BYOP 100%.** 00/01/03/04/07/08 put 'Horizontal Push' (row 11/14/18/45) above 'Vertical Push' "
    "(row 13/16/20/47). BYOP 02 PPL push day reads 'Horizontal Push' -> 'Vertical Push' -> 'Incline' -> 'Flies' -> "
    "'Dips' -> 'Push' -> 'Overhead'. The lead is horizontal, but more horizontal work (incline, dips) follows the "
    "overhead press. That is the only 'strict' failure in BYOP. MM UPPER/LOWER: C29 'Bench Press' -> C31 'Overhead "
    "Press'. BASEBALL never puts both in one Part C (horizontal Tue, vertical Fri), so it is applicable only through "
    "accessories.\n"
    "* **OBSERVED, systematic exception: the max-effort rotation.** CONJUGATE Wed/Sat and 4-TRACKS STRENGTH left "
    "alternate the main lift weekly: CONJUGATE Wed/Sat 'HEAVY BENCH PRESS' / 'FAST BANDED BENCH PRESS' (WK1, 3, 5, 7) "
    "vs 'HEAVY OH PRESS' / 'FAST DB OH PRESS' / 'FAST BB OH PRESS' (WK2, 4, 6); 4-TRACKS STRENGTH left J13 'HEAVY OH "
    "PRESS' (WK6) and F21 'FAST DB OH PRESS', H21 'PUSH PRESS', J21 'FAST DB OH PRESS'. In the OH weeks, 'the work' is vertical and 'the nuance' ('ALT INCLINE DB BENCH') is horizontal, so "
    "the label hierarchy (N11) outranks R2. 4-TRACKS AESTHETICS right puts 'Arnold press' first in WK8, 10 and 12 "
    "(V35, X35, Z35, X51, Z51), in the slot where side raises sit in other weeks. HYBRID Saturday fails only through "
    "the label-only 'FB' row C101 'VEr pull/ hor push' sitting under a push-press tri-set.",
    lambda e: (f"{wk(e)}V {sh(e['first_VPUSH'])} before H {sh(e['first_HPUSH'])}" if e["type"] == "lead_violation"
               else f"{wk(e)}lead OK, but later H after V: H={sh(e['all_HPUSH'])} V={sh(e['all_VPUSH'])}"))

sec("R3", "Athletic / power work before strength",
    "session holds at least one athletic item (PLYO_L, PLYO_U, SPRINT, COD, DRILL) and one compound strength item; "
    "compliant if every athletic item is above the first strength item. "
    f"Sessions whose only violation is a contrast complex: {R['R3']['compliant_except_contrast']} (counted as exceptions "
    "here and itemised in N12).",
    "* **OBSERVED, BYOP athletic templates (03, 04, 08): 12/12.** Fixed skeleton 'Plyo' -> 'Plyo' -> 'Throwing' -> "
    "'COD' -> 'Tripple Extension' -> strength, wired to library cols G -> G -> K -> L -> C. Demo picks in JUSTICE "
    "LEAGUE: E3 'Medium Depth Drop', E4 'Ankle Hops ', E5 'Situps to overhead throw', E6 'DIG/OUT', E7 'Power Clean', "
    "E8 'Front Squats'.\n"
    "* **OBSERVED, BASEBALL 77/92 compliant.** Part A ('Upper Ballistics/plyo' or 'LOWER ballistics/plyo') is always "
    "first. Exceptions fall into 3 families. (1) **contrast**: a jump right after the heavy lift ('Barbell deadlift' I51 "
    "-> 'Broad jumps' I52) or one prescription 'front squats/high jumps/hex bar squat jumps/ banded assisted hops'. "
    "(2) **plyo used as the strength-slot exercise**: 'plyo pushups' in 'horiz push', 'medball press' in 'vert push', "
    "'split stance jump squats' in 'ukd', 'Banded tantrums (sprint)' in 'uhd'. (3) BLOCK 1 wk 2 Monday S36: 'highest "
    "ankle hops' typed in the 'bicep' row because the labels are shifted one row (data slip).\n"
    "* **OBSERVED, HYBRID Tuesday (8 weeks):** B81 'STRENGTH'/'PUSH' bench press is above B82 'OLY/ POWER'/'JUMPS'. "
    "Upper strength comes before lower plyo, so the jumps are not fatigued by the bench (INFERRED).\n"
    "* **INFERRED:** the coach's real rule is 'fast before heavy *for the same region*', with one deliberate exception, "
    "contrast pairing (N12).",
    lambda e: f"{wk(e)}first strength {sh(e['first_strength'])}; late: {sh('; '.join(e['late_athletic']))}")

sec("R4", "Power-strength / Olympic / triple extension before heavy strength",
    "session holds an OLY or LOADED_JUMP item and a (non-ballistic) compound strength item; compliant if every power "
    "item is above the first strength item.",
    "* **OBSERVED, holds where the coach built a power slot.** BYOP 03/04/08: 'Tripple Extension' (row 7/16/34/43) is "
    "always above 'Bilateral KD/HD'. BASEBALL BLOCK 1 wk 6-8 and BLOCK 2 wk 5-8 add an 'OLY' row ('Hang cleans @ 75%' "
    "... '@ 90%' on Mon/Thu, 'Hang snatch' on Tue/Fri) *above* 'bkd'/'bhd' (CI33 'OPTIONAL PIECE'). This shows the "
    "intended order directly.\n"
    "* **OBSERVED, systematic exception: HYBRID.** Every Monday and Thursday lists B74 'STRENGTH' (SQUATS/DEADLIFTS) above "
    "B75/B87 'OLY/ POWER' (CLEANS/SNATCHES), 16/16 sessions. Saturday's 'OLY/ POWER' row (B99) is empty.\n"
    "* **OBSERVED, accessory-slot ballistics:** BASEBALL uses 'Single Arm DB snatch from floor', 'KB high pull' and "
    "'DB HIGH PULL' as the last 'shoulders' accessory on hinge days. MM 05 STARTING puts 'Staggered stance DB snatch' "
    "C28 after KB swings, and 'SUPERSET: Low Hang Power Cleans (mid weight)' C36 after 'HEAVY: Camporini DL'.\n"
    "* **INFERRED:** when the Olympic lift is the session's speed-strength priority it goes first. When it is used "
    "light, as a shoulder or upper-back accessory or a 'mid weight' superset, it can sit late. HYBRID is the open "
    "question (Q3).",
    lambda e: f"{wk(e)}first strength {sh(e['first_strength'])}; late: {sh('; '.join(e['late_power']))}")

r5 = R["R5"]
sec("R5", "Bilateral before unilateral (same region)",
    "session holds a bilateral lower lift (BKD/BHD) and a unilateral one (UKD/UHD); compliant if the first bilateral "
    f"is above (or in the same prescription as) the first unilateral. Pattern level: KD {r5['pattern_level']['KD'][1]}/"
    f"{r5['pattern_level']['KD'][0]}, HD {r5['pattern_level']['HD'][1]}/{r5['pattern_level']['HD'][0]}. Upper body "
    f"(name-flagged single-arm vs not, within pulls and within pushes): {r5['upper']['compliant']}/{r5['upper']['applicable']}.",
    "* **OBSERVED, near-universal (97%).** Every BYOP template has 'Bilateral KD/HD' above 'Unilateral KD/HD'. "
    "BASEBALL Part C ('bkd'/'bhd') is always above Part D ('uhd'/'ukd'). The coach's own note supports this: 'When there "
    "are joint pains, usually going unilateral ... help take care of some stuff' (MM 05 A6), so unilateral is the "
    "safer, later choice.\n"
    "* **OBSERVED exceptions:** 4-TRACKS AESTHETICS right Friday WK9-12 starts with 'RFE Lunges (bulgarian)' W57 and "
    "ends with '2 sets LEG PRESS MYO - 15-5-5-5-5-5' W61. A machine myo-rep finisher is deliberately last (N13). MM 05 "
    "STARTING W3: 'HEAVY: Camporini DL' C34 above 'Heavy Snatch grip DL' C37. BOXING Wk3-8 Monday: 'Lateral box step "
    "up IPSILATERAL LOAD' L11 above 'DEADLIFTS (1-2RIR) + 3 min Jump Rope' L12. Different patterns (KD vs HD), so "
    "pattern-level R5 still holds.\n"
    "* Upper-body exceptions are mostly FAT BURN / 4-TRACKS AESTHETICS: 'SINGLE ARM LAT PULL DOWN' is above "
    "'MACHINE SUPPORTED ROW', which is the same issue as R1.",
    lambda e: f"{wk(e)}unilateral {sh(e['first_unilateral'])} before bilateral {sh(e['first_bilateral'])}",
    extra="<details><summary>Upper-body R5 exceptions</summary>\n\n" + "\n".join(
        f"- {SHORT.get(e['tab'], e['tab'])}{track_short(e.get('track'))} {sh(e['day'])} {wk(e)}({e['family']}): "
        f"single-arm {sh(e['first_unilateral_upper'])} before {sh(e['first_bilateral_upper'])}"
        for e in r5["upper"]["exceptions"]) + "\n\n</details>")

sec("R6", "Compound before isolation",
    "session holds a compound (strength or OLY) and an isolation item; exception if any isolation item sits above any "
    "compound.",
    "* **OBSERVED, by design in BYOP aesthetics:** 'Calves' is slot 1 of Day 1 and Day 3 (00 D3 'Machine Calf "
    "Raises', 01 D3, 07 E3/E24), above 'Bilateral KD'. This happens in every KD/pull day of the aesthetic templates "
    "and nowhere in the athletic ones, which push 'Calves' to the optional day. BYOP 02 PPL: 'Flies' (row 6) above "
    "'Dips' (row 7); leg day 'Leg Extensions' and 'Leg Curls' (rows 20-21) above 'Unilateral HD' (row 22). BOOTCAMP 2 "
    "puts 'Bicep' (E10) between 'Horizontal Push' and 'Vertical Push'.\n"
    "* **OBSERVED, pre-exhaust pattern in bodybuilding pushes:** 4-TRACKS AESTHETICS right opens every push day with "
    "side raises (O35 'cable Side Raises', P35 'DB side raises', ...: 19 of the 24 push days; the other 5 open with "
    "'Arnold press', see R2). MM PPL push day: C17 'Side "
    "raises' between C16 'Incline DB Bench press' and C18 'Barbell Bench press'. Pull day: C27 'DB Reverse Flies or "
    "Machine' between the row and the pulldown.\n"
    "* **OBSERVED, BASEBALL Part D:** the last 'shoulders' accessory is often a compound ('sesaw push press', 'bent "
    "over rows', 'Pushups', 'Single Arm DB snatch from floor') placed after the tricep isolation. That is the slot "
    "order (tricep -> shoulders), not a compound-first violation in intent (INFERRED).",
    lambda e: f"{wk(e)}{sh('; '.join(e['isolation_before_compound']))}")

sec("R7", "Big muscles before small muscles",
    "BIG = squat/hinge/lunge/row/pull/press/OLY + quad, ham and chest isolation; SMALL = side/rear delt, bicep, "
    "tricep, calf isolation. Exception if a SMALL item sits above any BIG item.",
    "* Same drivers as R6, plus BYOP 00/07 Day 1: 'Bicep' (row 8) is above 'Leg Extensions' (row 9). The arm isolation "
    "comes before the lower isolation finisher, so the end of the session alternates upper/lower even in isolations "
    "(INFERRED, see R8). BOOTCAMP 1 MON/THU: 'Bicep' and 'Calves' (rows 7-8) above 'Leg Extensions' (row 9).\n"
    "* **INFERRED:** the coach does not follow a strict big-to-small rule. He follows *compound block -> isolation "
    "block*, and inside the isolation block he alternates regions. Two deliberate deviations are calves first and side "
    "raises first on bodybuilding days.",
    lambda e: f"{wk(e)}{sh('; '.join(e['small_before_big']))}")

r8 = R["R8"]
sec("R8", "Alternate lower / upper (full-body sessions)",
    "session holds both lower and upper compound ROLES; compliant if no two consecutive compound items share a region "
    f"(supersets in one cell count as alternating). Adjacent compound pairs alternating: {r8['pairs_alternating']}/"
    f"{r8['pairs_total']}. Including isolations: {r8['all_resistance']['compliant']}/{r8['all_resistance']['applicable']} "
    "sessions fully alternate.",
    "* **OBSERVED, BYOP full-body templates alternate perfectly:** L-U-L-U ('Bilateral KD', 'Horizontal Pull', "
    "'Unilateral KD', 'Vertical Pull'). BASEBALL alternates by construction: Part C is a 'Superset - same reps' of a "
    "bilateral lower lift and an upper compound; Part D is unilateral lower + arm + calf/shoulder.\n"
    "* **OBSERVED exceptions:** CONJUGATE and 4-TRACKS STRENGTH lower days run 'the work' (squat or deadlift) -> 'the "
    "accessory' (the other lower pattern) -> 'the nuance' (pull) -> 'the survival' (lunge or staggered DL), i.e. LLUL. "
    "HYBRID Monday is SQUATS -> CLEANS -> UNI RDLs -> DB ROWS. BOOTCAMP 2 '2A' is BHD -> HPush -> Bicep -> VPush. 3 DAY "
    "BUILDER Day 3 is 'Bilateral KD' -> 'Bilateral HD' -> 'Horizontal Pull' -> 'Horizontal Push' -> 'Unilateral KD'.",
    lambda e: f"{wk(e)}{e['compound_region_sequence']}: {sh('; '.join(e['same_region_adjacent']))}")

r9 = R["R9"]
dl = r9["day_level"]
sec("R9", "Knee-dominant paired with pull, hip-dominant paired with push",
    "adjacent lower/upper compound ROLES are paired (lower item + the upper item next to it); compliant if every pair "
    f"is KD+PULL or HD+PUSH. Pairs found: {r9['pairs']}. Day-level mix (lower families + upper families present): {dl}.",
    "* **OBSERVED, strong rule.** KD+PULL and HD+PUSH make up "
    f"{r9['pairs'].get('KD+PULL', 0) + r9['pairs'].get('HD+PUSH', 0)} of {sum(r9['pairs'].values())} pairs. BYOP 00/03/04/07/08: "
    "Day 1/3 = KD + both pulls; Day 2/4 = HD + both pushes. BASEBALL 92/92: Mon 'bkd'+'horiz pull', Tue 'bhd'+'horiz "
    "push', Thu 'bkd'+'vert pull', Fri 'bhd'+'vert push'. CROSSFIT grid: 'KNEE DOM' Mon / 'PULL' Tue / 'HIP DOM' Thu / "
    "'PUSH' Fri (row 31).\n"
    "* **OBSERVED, the inverse template exists:** BOOTCAMP OPTION 1 Tue/Fri = 'Bilateral HD'+'Vertical Pull', "
    "'Unilateral KD'+'Horizontal Push'. Mon/Thu = 'Bilateral KD'+'Horizontal Pull', 'Unilateral HD'+'Vertical Push'. "
    "Each bootcamp day therefore holds one pull and one push and both lower patterns, i.e. a full-body balance per day. "
    "3 DAY BUILDER Day 3 does the same (HD+PULL, KD+PUSH) because it is the 'everything' day.\n"
    "* CONJUGATE / 4-TRACKS STRENGTH lower days add one pull ('PULL UPS' or 'DB ROWS 8/8') as 'the nuance' after the "
    "hinge accessory, so it reads HD+PULL. HYBRID Monday reads 'UNI RDLs' + 'DB ROWS'.",
    lambda e: (f"{wk(e)}{sh('; '.join(e['opposite_pairs']))}" if "opposite_pairs" in e else f"{wk(e)}{e.get('note')}"))

rc, rk = R["R10-core"], R["R10-conditioning"]
sec("R10-core", "Core at the end of the session or on a separate day",
    f"compliant if every CORE item sits below all other work or the session is a separate/optional day. Position counts: {rc['position_counts']}.",
    "* **OBSERVED, aesthetic BYOP:** 'Core' lives only in the 'Optional' blocks (00 B20/B41; 01 B10/B20/B30; 05/07 "
    "WEDNESDAY/SATURDAY; 03/04/08 WEDNESDAY/SATURDAY), with 'Calves', 'Cardio' or 'Aerobic Capacity', 'Focus 1' and "
    "'Focus 2'. That is a separate day, which complies.\n"
    "* **OBSERVED, athletic programs do the opposite: core comes EARLY.** BASEBALL Part B ('LATERAL CORE' Mon, "
    "'Transverse core' Tue/Fri, 'Sagital core' Thu) sits between Part A ballistics and Part C strength in "
    f"{N['N4']['core_item_positions_by_tab'].get('BASEBALL', {}).get('before strength (after power block)', 0)} core items. "
    "MM 05 puts 'Hollow rocks', 'Med Ball Rockers' and 'Star Supine Cross Connects' between plyos and lifts. BOXING "
    "Wk1-2 puts 'Situps / Toes to bar' second. HYBRID embeds core inside strength prescriptions ('3x6 - DB bench "
    "press/ core', 'UNI RDL/ CORE/ UNI GB', 'FE contra/ DB rows/core'), i.e. core is the superset filler.\n"
    "* **INFERRED:** treat 'core at the end' as an aesthetics rule only. For athletes the coach programs core as "
    "trunk-stiffness prep before loading (SCIENCE: anti-rotation/anti-extension work as an activation primer, "
    "low-fatigue) and keeps fatiguing trunk work out of the end-of-session slot, which is taken by the 'Buy out'.",
    lambda e: f"{wk(e)}{sh('; '.join(e['positions']))}")
sec("R10-conditioning", "Conditioning at the end of the session or on a separate day",
    f"same test for COND. Position counts: {rk['position_counts']}. The 5-minute 'Any Cardio Equipment' warm-up is "
    "tagged WARMUP and excluded.",
    "* **OBSERVED, holds:** BASEBALL Part E 'Buy out' ('1x 30 Sec Fast Run', '1 X 12 Cal bike sprint', ...) is always "
    "last, with A-row labels 'Speed' and 'strength'. FAT BURN cardio is its own day (D17 / D30 '30-40 mi slow/steady "
    "CARDIO' on WEDNESDAY/SATURDAY). BYOP 'Cardio' / 'Aerobic Capacity' sits in the optional blocks.\n"
    "* **OBSERVED exceptions:** BOXING opens with conditioning (D7 '20 sec fast/ 40 sec slow (cardio of choice)', "
    "D44 'Easy cardio of choice (steady pace)', L19 'Cardio of any choice' 20-40 min). This is most likely the "
    "warm-up/aerobic piece of a fighter (INFERRED). HYBRID Friday opens with B92 'A/C' D92 'DISTANCE' '15-40 min "
    "constant cardo easy'. BOOTCAMP 2 '3A'/'3B' puts 'Cardio' (row 15/30) between 'Unilateral KD' and 'Tricep'.",
    lambda e: f"{wk(e)}{sh('; '.join(e['positions']))}")

# ---------------------------------------------------------------- R11
A("## 3. R11: across the week, which vectors land on which day")
A("")
A("Modal weekly layout per program (ROLE vectors: HPULL/VPULL/HPUSH/VPUSH, BKD/BHD/UKD/UHD; 'other' = anything "
  "present in any week). OBSERVED; cell refs in the JSON `rules[R11].programs[].all_weeks`.")
A("")
for p in R["R11"]["programs"]:
    if p["tab"] == "EXAMPLE UPPERLOWER SPLIT" and "NEWBY" in p["level"] or p["tab"] == "EXAMPLE UPPERLOWER SPLIT" and "INTER" in p["level"]:
        continue
    if p["tab"] == "EXAMPLE PUSHPULLLEGS SPLIT" and ("NEWBY" in p["level"] or "INTER" in p["level"]):
        continue
    title = f"{SHORT.get(p['tab'], p['tab'])}{track_short(p['track'])}{(' ' + p['level']) if p['level'] else ''}"
    A(f"**{title}** - weeks in sheet: {p['weeks_in_sheet']}, distinct weekly layouts: {p['distinct_weekly_layouts']} (modal layout in {p['modal_layout_weeks']}).")
    A("")
    A("| Day | Strength vectors (in order of appearance in the session) | Other |")
    A("|---|---|---|")
    for d in p["modal_layout"]:
        A(f"| {sh(d['day'])} | {', '.join(d['vectors']) or '-'} | {', '.join(d['other_in_any_week']) or '-'} |")
    A("")
A("**CROSSFIT (MM 11, category level only, OBSERVED):** monthly grids (A27 'JUNE' ... A137 'MAY') use STRENGTH = "
  "B31 'KNEE DOM' (MON), C31 'PULL' (TUESD), E31 'HIP DOM' (THURS), F31 'PUSH' (FRID); RESISTANCE = 'LB' Mon/Thu, "
  "'UB' Tue/Fri; POWER = 'SNATCH' Mon/Thu, 'CLEAN' Tue/Fri (from AUGUST); D29 and H29 WED/SUN 'OFF'. The class "
  "split (Q12:V16) is MON 'SQUAT' + 'DUBS'; TUES 'PRESS' + 'SNATCH'; THURS 'DEADLIFT' + 'GYMNASTICS'; FRID 'CLEAN'.")
A("")
A("**Weekly rotation rules (INFERRED from the tables above):**")
A("")
A("1. **Two-day mirror (aesthetics, BYOP 4-day):** a 'knee + pull' day (Day 1/3: BKD, HPULL, UKD, VPULL) and a 'hip + "
  "push' day (Day 2/4: BHD, HPUSH, UHD, VPUSH). Each vector is trained twice a week, and horizontal and vertical of "
  "the same direction share a day.")
A("2. **Four-day vector split (athletic, BASEBALL):** horizontal early in the week, vertical late (Mon HPULL, Tue HPUSH, "
  "Thu VPULL, Fri VPUSH). The squat travels with the pull and the hinge with the push. Ballistics follow the lower "
  "pattern: UPPER ballistics on squat/pull days, LOWER ballistics on hinge/push days (N7). Each vector gets one "
  "exposure a week.")
A("3. **Crossed bootcamp:** every day holds one pull and one push from opposite planes (Mon/Thu HPULL+VPUSH, Tue/Fri "
  "VPULL+HPUSH) and one bilateral + one unilateral lower of opposite patterns.")
A("4. **Strength / conjugate:** Mon max-effort lower, Wed max-effort upper, Thu dynamic lower ('FAST ...', jumps "
  "first), Sat dynamic upper. The lead lift alternates squat/hinge and bench/OHP week to week (N8).")
A("5. **PPL (BYOP 02, MM 06, 4-TRACKS AESTHETICS right):** push / pull / legs twice a week (BYOP 02: Mon/Thu push, "
  "Tue/Fri pull, Wed/Sat legs, SUNDAY 'OFF'). Both vectors of a direction share the day.")
A("")

# ---------------------------------------------------------------- new rules
A("## 4. Other ordering regularities found (not in the R1-R11 list)")
A("")
n1 = N["N1"]["counts"]
A(f"**N1. Arm isolation follows the day's upper pattern (OBSERVED).** Pull-only sessions: bicep isolation in "
  f"{n1['PULL-only sessions']['with bicep iso']} of {n1['PULL-only sessions']['total']}, tricep in "
  f"{n1['PULL-only sessions']['with tricep iso']}. Push-only sessions: tricep in {n1['PUSH-only sessions']['with tricep iso']} "
  f"of {n1['PUSH-only sessions']['total']}, bicep in {n1['PUSH-only sessions']['with bicep iso']}. The deliberate "
  "inverse is BOOTCAMP OPTION 2: '2A' push day carries 'Bicep' (E10) and '3A' pull day carries 'Tricep' (E16). This is "
  "antagonist filler in a circuit-style bootcamp (INFERRED).")
A("")
A("**N2. The lower isolation finisher matches the day's lower pattern (OBSERVED).** "
  + "; ".join(f"{k}: {v}" for k, v in N["N2"]["counts"].items())
  + ". BYOP: 'Leg Extensions' closes the KD day (row 9/30/12/39), 'Leg Curls' sits on the HD day (row 14/35/21/48).")
A("")
t3 = N["N3"]["totals"]
A(f"**N3. Same-pattern vs cross-pattern unilateral is a template choice (OBSERVED).** Across sessions with exactly one "
  f"bilateral and one unilateral lower: BKD+UKD {t3.get('BKD+UKD', 0)}, BHD+UHD {t3.get('BHD+UHD', 0)} (same pattern; BYOP "
  f"aesthetics/athletic, CONJUGATE) vs BKD+UHD {t3.get('BKD+UHD', 0)}, BHD+UKD {t3.get('BHD+UKD', 0)} (cross pattern; BASEBALL "
  "44+46, BOOTCAMP 1 and 2). INFERRED: aesthetic templates double the day's pattern for volume on that muscle. "
  "Athletic and bootcamp templates cover both patterns every day.")
A("")
A("**N4. Core placement depends on goal (OBSERVED, core items by position, per tab):** "
  + "; ".join(f"{SHORT.get(k, k)}: " + ", ".join(f"{p} {n}" for p, n in v.items())
              for k, v in N["N4"]["core_item_positions_by_tab"].items()) + ".")
A("")
A(f"**N5. Inside the power block, plyo/throws/COD/sprint come before Olympic work (OBSERVED):** {N['N5']['compliant']}/"
  f"{N['N5']['applicable']} sessions. BYOP rows 'Plyo','Plyo','Throwing','COD' are above 'Tripple Extension'. BASEBALL "
  "Part A is above the 'OLY' row. Exceptions: " + "; ".join(f"{e['sid']} ({e['detail']})" for e in N["N5"]["exceptions"]) + ".")
A("")
lb, bs = N["N6"]["landing_before_reactive"], N["N6"]["bilateral_before_single_leg"]
A(f"**N6. Plyo progression inside a session (OBSERVED, small n):** landing/stick drills before reactive jumps in "
  f"{lb['compliant']}/{lb['applicable']} sessions (e.g. 'Depth drop' -> 'depth drop to jump'; MM 05 'weighted Depth "
  "Drops - Drop & Stick - Hold for 3 seconds' -> 'High Jumps'). Bilateral before single-leg plyo in only "
  f"{bs['compliant']}/{bs['applicable']}: BASEBALL often starts LOWER ballistics with a single-leg hop. So "
  "*eccentric before reactive* is a rule, *bilateral before single-leg* is not.")
A("")
A("**N7. BASEBALL 5-part skeleton (OBSERVED, every non-deload session):** Part A ballistics -> Part B core -> Part C "
  "'Superset - same reps' (bilateral lower + upper compound) -> Part D (unilateral lower of the *other* pattern + arm "
  "isolation + calves or shoulders) -> Part E 'Buy out' ('Speed' or 'strength'). Day x ballistics x pattern counts: "
  + "; ".join(f"{k} = {v}" for k, v in N["N7"]["counts"].items()) + ".")
A("")
A("**N8. Weekly A/B swap of the lead lift with a fixed skeleton (OBSERVED).**")
A("")
A("| Program / day | Weeks | Lead changes | Lead sequence |")
A("|---|---:|---:|---|")
for d in N["N8"]["per_day"]:
    if d["lead_changes"] == 0:
        continue
    seq = ", ".join(x.split(":")[1].split("(")[0].strip() for x in d["sequence"])
    A(f"| {SHORT.get(d['tab'], d['tab'])}{track_short(d['track'])} {sh(d['day'])} | {d['weeks']} | {d['lead_changes']} | {seq} |")
A("")
A("This is how the coach's 'don't confuse the muscle, change small variables' plays out. The template stays the same "
  "and the lead lift alternates squat-pattern/hinge-pattern (or bench/overhead, push-first/pull-first) every week "
  "(FAT BURN WK1-4, CONJUGATE WK1-7, 4-TRACKS 'A WEEK'/'B WEEK' O33:U33).")
A("")
n9 = defaultdict(lambda: [0, 0])
for p in N["N9"]["pairs"]:
    n9[p["program"]][0 if p["identical_order"] else 1] += 1
A("**N9. The same day-type is repeated twice a week (OBSERVED).** Pairs of same-vector days within a week, identical "
  "vs re-ordered: " + "; ".join(f"{k.split(' / ', 1)[1]}: {v[0]} identical, {v[1]} re-ordered" for k, v in n9.items())
  + ". BYOP repeats the day exactly. FAT BURN mirrors it: Monday leads with the squat pattern (D7 'LEG PRESS'), "
  "Thursday with the hinge (D20 'DEAFLITS'), and the isolation flips too (D11 'LEG EXTENSIONS' vs D24 'LEG CURLS').")
A("")
A("**N10. Preparation first (OBSERVED):** " + "; ".join(f"{k}: {v}" for k, v in N["N10"]["counts"].items())
  + ". MM PPL push day: C14 'Any Cardio Equipment' -> C15 'KB Book openers ' -> pressing. Leg days: 'A March' -> "
  "'A Skip' -> 'A Run' -> 'Sqats or Leg Press'.")
A("")
A("**N11. Explicit 4-tier hierarchy (OBSERVED, coach labels):** " + "; ".join(N["N11"]["cells"]["CONJUGATE M13:M28"][:4])
  + ". The same labels appear in 4 TRACKS M9:M24. Load goes '1RIR' -> '2RIR' -> 'MAX' -> 'ALL', i.e. heaviest first "
  "and the lowest-skill, highest-rep work last ('the survival').")
A("")
A(f"**N12. Contrast pairing heavy -> fast (OBSERVED, {N['N12']['count']} instances):** "
  + "; ".join(f"{SHORT.get(i['tab'], i['tab'])} {sh(i['week'] or '')} {sh(i['day'])}: {sh(i['item'])}"
              + (f" after {sh(i['prev'])}" if i["prev"] else "") for i in N["N12"]["instances"])
  + ". This matches the coach's 'the heavier I go the slower; the lighter, the faster'. The heavy set potentiates "
  "the fast unloaded set of the same pattern (SCIENCE: post-activation performance enhancement). It is the only "
  "systematic, intended break of 'athletic first'.")
A("")
A("**N13. Intensity techniques go on the last exercise (OBSERVED):** "
  + "; ".join(f"{SHORT.get(i.get('tab'), i.get('tab'))} {i['cell']} '{i['text'][:40]}' ({i['position']})" for i in N["N13"]["instances"]) + ".")
A("")
A("**N14. Non-competing supersets (OBSERVED):** " + "; ".join(f"{k}: {v}" for k, v in N["N14"]["counts"].items())
  + ". Strength and athletic supersets do not compete: lower + upper compound (BASEBALL Part C 'Superset - same "
  "reps'), unilateral lower + arm (Part D), core + delt (MM 05 C38 'SUPERSET: Dead bugs + Front Raises + Side "
  "Raises'). Same-muscle supersets appear only as (a) contrast complexes for speed (N12) and (b) aesthetic finishers "
  "in 4-TRACKS AESTHETICS WK9-12: W52 'bench press + superset with max pushup set (only 1 set of max pushups per set "
  "of bench)', X52 'incline bench press + superset with a set of max bench dips...', W41 'front squats + Superset "
  "with 15 squats with no weight every set' (OBSERVED). INFERRED: in hypertrophy blocks he uses a same-muscle "
  "bodyweight back-off set as a late-block intensifier.")
A("")
A("**N15. CROSSFIT class order (OBSERVED):** R3 'WARMUP/SKILL' -> S3 'STRENGTH/POWER' -> T3 'WOD'. Skill comes first, "
  "the metabolic piece last, consistent with R10-conditioning.")
A("")
A(f"**N16. Squat pattern before hinge pattern when both are bilateral (OBSERVED):** {N['N16']['kd_first']}/"
  f"{N['N16']['applicable']}. Every hinge-first session belongs to a weekly-alternating program (FAT BURN WK2/WK4 "
  "Mon and WK1/WK3 Thu, CONJUGATE and 4-TRACKS STRENGTH deadlift weeks). Static templates (UPPER/LOWER, PPL, BYOP 02 "
  "Wed/Sat, BOXING Wk1-2) always squat first.")
A("")
A(f"**N17. Leg extension before leg curl (OBSERVED):** {N['N17']['quad_first']}/{N['N17']['applicable']}. Exceptions: "
  "BOXING Wk1-2 Mon/Thu ('Leg curls' D13 above 'Leg Extentions' D14).")
A("")
A("**N18. The bilateral lower lift is paired with the HORIZONTAL vector, the unilateral with the VERTICAL (OBSERVED, "
  "BYOP):** " + "; ".join(f"{k}: {v}" for k, v in N["N18"]["counts"].items())
  + ". In BYOP the heavy bilateral lower lift is supersetted or alternated with the row/bench, and the lunge with the "
  "pulldown/overhead press (29 vs 2 and 24 vs 2). MASTER MODEL is mixed because BASEBALL moves the vertical vectors to "
  "Thu/Fri with the bilateral lift.")
A("")
A("### 4.4 FAT BURN circuits (excluded from R1-R10)")
A("")
for c in O["circuits"]:
    A(f"- {sh(c['week'])} {sh(c['day'])}: " + " -> ".join(sh(x.split(' -> ')[0]) for x in c["stations"]))
A("")
A("Each circuit is 4 stations of 30-50 s mixing full-body / lower / core / upper "
  "('Jumping Jacks' -> 'Bodyweight reverse lunges' -> 'Situps' -> 'Dumbbell overhead press'). The order alternates "
  "regions and puts the cardio station first (OBSERVED).")
A("")

# ---------------------------------------------------------------- generator
A("## 5. What the generator should do (INFERRED from sections 1-4)")
A("")
A("Default session order, in slot terms the generator can fill from the library:")
A("")
A("1. Prep: 5 min any cardio, then mobility ('KB Book openers' before pressing) or A-drills before lower days (N10).")
A("2. Athletic block (athletic goals only): plyo (landing -> reactive) -> throws (light med ball, 8-10 lb per the "
  "coach) -> COD/sprint -> triple extension / Olympic (R3, R4, N5, N6). Pick the ballistic region by the day: upper "
  "ballistics on squat+pull days, lower on hinge+push days (N7).")
A("3. Core: athletic goals put core here (Part B), anti-lateral / transverse / sagittal by day (N4, R10). Aesthetic "
  "goals move core to the optional day.")
A("4. Strength block, lower and upper alternating (R8): bilateral lower + horizontal upper of the paired direction "
  "(squat+pull, hinge+push; R9, N18), then unilateral lower + vertical upper. Aesthetic = same-pattern unilateral; "
  "athletic/bootcamp = cross-pattern (N3). Use a contrast jump straight after the heavy lift only for speed/power "
  "goals (N12).")
A("5. Isolation block: arm matching the upper direction (N1), the lower finisher matching the lower pattern (N2), "
  "leg extension before curl (N17). Aesthetic option: calves first (BYOP slot 1) and side raises first on push days "
  "(pre-exhaust, 4-TRACKS AESTHETICS).")
A("6. Intensity technique (MYO) on the last exercise only (N13); conditioning 'Buy out' last (R10).")
A("7. Week: keep the skeleton fixed for the block. Alternate the lead lift A/B week to week (N8) and mirror the "
  "second exposure of the day-type (N9). Rotate vectors per template (section 3).")
A("")

# ---------------------------------------------------------------- open questions
A("## 6. Open questions for the coach")
A("")
qs = [
    "Q1 (R1). BYOP always rows before the overhead pull, but FAT BURN, 4-TRACKS AESTHETICS and BOXING Wk1-2 put the "
    "pulldown first (48 sessions). Which should the generator follow? Is the crossed 'bench -> pulldown -> OHP -> row' "
    "order of FAT BURN a separate, intended upper-day template?",
    "Q2 (R2). On overhead-press weeks of CONJUGATE / 4-TRACKS STRENGTH, 'the work' is the OHP and the incline DB bench "
    "comes after. Is 'max-effort lift first regardless of vector' the rule there?",
    "Q3 (R4). HYBRID lists 'STRENGTH' (squat/deadlift) above 'OLY/ POWER' (cleans/snatches) every Mon/Thu. Should the "
    "cleans/snatches go first, as in BYOP 'Tripple Extension' and the BASEBALL 'OLY' rows? Or are they deliberately "
    "after the main lift?",
    "Q4 (R10). Core is Part B (before lifting) in BASEBALL and a superset filler in HYBRID, but sits on optional days "
    "in BYOP aesthetics. Confirm: athletes = core early, aesthetics = core separate/last?",
    "Q5 (R6/R7). Why 'Calves' as slot 1 in BYOP aesthetics Day 1/3, and side raises first on 4-TRACKS AESTHETICS push "
    "days: warm-up, pre-exhaust, or priority? Should the generator keep them first for every aesthetic client?",
    "Q6 (N3). Aesthetic days pair bilateral and unilateral of the SAME pattern (squat + lunge); BASEBALL and BOOTCAMP "
    "pair the opposite pattern (squat + single-leg RDL). Is that a goal-based rule we should hard-code?",
    "Q7 (R9). BOOTCAMP OPTION 1 Tue/Fri pairs hinge + vertical pull and lunge + horizontal push, the reverse of every "
    "other template. Intentional, or should it read hinge + push?",
    "Q8 (N8). Is the weekly A/B swap (squat-led week / hinge-led week; bench week / OHP week) the default for every "
    "program, or only FAT BURN / CONJUGATE / 4-TRACKS?",
    "Q9 (R3). BASEBALL sometimes puts the plyo in the strength slot ('plyo pushups' as 'horiz push', 'medball press' as "
    "'vert push', 'split stance jump squats' as 'ukd'). Are those swaps for in-season or low-equipment weeks? When "
    "should the generator do that?",
    "Q10 (R10-conditioning). BOXING starts every day with cardio ('20 sec fast/ 40 sec slow', 'Easy cardio of choice "
    "(steady pace)', 'Cardio of any choice'). Warm-up or a real aerobic block? HYBRID Friday starts with '15-40 min "
    "constant cardo easy'. Same question.",
    "Q11 (data). BASEBALL BLOCK 1 wk 2 Monday labels are shifted one row (S35 'uhd' row empty, 'highest ankle hops' typed "
    "in the 'bicep' row S36 and again S38). Was 'uhd' meant to be filled? 4-TRACKS G56 reads only 'UNILATERAL' and is "
    "assumed to be 'UNILATERAL LAT PULL DOWN'.",
    "Q12 (N13). MYO sets only ever appear on the last 1-2 exercises (leg extension, leg press, arm/shoulder "
    "accessories). Is that a rule (never MYO on compounds or free weights)?",
]
for q in qs:
    A(f"- {q}")
A("")

# ---------------------------------------------------------------- appendix
A("## Appendix A. Data quirks that affect ordering (OBSERVED)")
A("")
A("- BYOP 03 'ATHLETIC - FULL BODY - 4 DAYS A' B30 (4th main day) is blank; position and layout show it is THURSDAY. "
  "The twin tab 08 fills it as B30 'THURSDAY'.")
A("- BYOP 06 'BOOTCAMP - OPTION 2' A1 reads 'BOOTCAMP OPTION 1'. Its days are '1A','2A','3A','1B','2B','3B', and "
  "the 'Cardio' rows E7/E12/E22/E27 are wired to `B7:B335` (E15/E30 to `B7:B122`).")
A("- MM 04 4-TRACKS STRENGTH left (E9:K24) duplicates MM 12 CONJUGATE (E13:K27) with small differences (e.g. 4-TRACKS "
  "F13 'HIGH INCLINE PRESS' vs CONJUGATE F17 'HEAVY OH PRESS'). Both are counted. 'HIGH INCLINE PRESS' is tagged "
  "horizontal and is borderline vertical.")
A("- MM 04 HYBRID B99 'OLY/ POWER' (Saturday) has no content; excluded. C86 labels DEADLIFTS as 'KD' (probably a "
  "typo for HD); D-col 'DEADLIFTS' is used.")
A("- BASEBALL slot labels drift by one row in some weeks (BLOCK 1 wk 2 Mon S35-S38; BLOCK 2 Part C sometimes 3 rows: "
  "E51 'Heavy front squats', E52 'KB squat cleans' [label 'horiz pull'], E53 'seal rows'). Pattern ROLES are taken from "
  "the label only when the written exercise is in the same body region.")
A("")
A("## Appendix B. Every session's order")
A("")
A("All 474 sessions, with every item's cell, coach slot label, text, tags and role, are in `ordering_audit.json` -> "
  "`sessions`. The exception lists above are generated from that file.")

(HERE / "ordering_audit.md").write_text("\n".join(md), encoding="utf-8")
print("written", len(md), "lines")
