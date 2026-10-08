"""v1 verification pass (2026-10-08) for synthesis/10_equipment_model.json.

Adversarial check against coach_answers_full.md found problems that the v1 build left
in the JSON. This script fixes them in place and is idempotent (safe to re-run, and it
must be re-run after build_10_assemble.py, which does not contain these fixes).

Run:  .venv/bin/python synthesis/_build_10/patch_10_v1_verify.py
"""
import copy
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
PATH = os.path.normpath(os.path.join(HERE, "..", "10_equipment_model.json"))

d = json.load(open(PATH, encoding="utf-8"))
ei = d["exercise_index"]
log = []

# ---------------------------------------------------------------- helpers
def avail(needs, kit):
    if not needs:
        return True
    if needs["semantics"] == "AND of OR-groups":
        return all(any(t in kit for t in g) for g in needs["groups"])
    if needs["semantics"] == "OR of AND-kits":
        return any(all(t in kit for t in k) for k in needs["kits"])
    raise ValueError(needs["semantics"])

kits = {p: set(a.get("kit", [])) for p, a in d["access_profiles"].items()}

# ---------------------------------------------------------------- J1 band routes in needs / implement
before = {c: {p: avail(e.get("needs"), k) for p, k in kits.items()} for c, e in ei.items()}
j1 = []
for cell, e in ei.items():
    if e.get("excluded"):
        continue  # excluded cells keep their original needs as the record of why
    n = e.get("needs")
    changed = False
    if n and n.get("semantics") == "AND of OR-groups":
        new = [[t for t in g if t != "band"] for g in n["groups"]]
        if new != n["groups"]:
            if any(len(g) == 0 for g in new):
                sys.exit(f"{cell}: removing band empties an OR-group - check by hand")
            n["groups"] = new
            changed = True
    elif n and n.get("semantics") == "OR of AND-kits":
        new = [k for k in n["kits"] if "band" not in k]
        if new != n["kits"]:
            n["kits"] = new
            changed = True
    if e.get("implement") == "cable/band":
        e["implement"] = "cable"
        changed = True
    if changed:
        j1.append(cell)
after = {c: {p: avail(e.get("needs"), k) for p, k in kits.items()} for c, e in ei.items()}
assert before == after, "availability changed - band was a live route somewhere"
if j1:
    log.append(f"J1 band route removed from needs/implement of {len(j1)} non-excluded cells: {', '.join(j1)} (availability unchanged in all 10 profiles; COACH-ANSWER EQ-01)")

# ---------------------------------------------------------------- J2 athlete Olympic picks (ATH-10)
sb = d["substitution_by_category"]["AP_TRIPLE_EXT"]
pk = d["picks_by_client_family"]["AP_TRIPLE_EXT"]
BASIS = "COACH-ANSWER ATH-10 ('everyone gets Olympic lifts'; intermediate+ the full lifts, beginners hang/no-bumper and DB/KB versions) and CR-01 olympic - v1 verification fix"

def lib_entry(prof, cell, note=None):
    for e in sb[prof]:
        if e.get("cell") == cell:
            out = {"name": e["name"], "cell": cell, "c": e.get("c"), "lvl": e.get("lvl"), "zone": e.get("zone")}
            if e.get("display_name"):
                out["display_name"] = e["display_name"]
            out["basis"] = BASIS
            if note:
                out["note"] = note
            return out
    sys.exit(f"{cell} not in AP_TRIPLE_EXT/{prof}")

def sub_entry(prof, name):
    for e in sb[prof]:
        if e.get("substitute") and e.get("name") == name:
            out = {k: e[k] for k in ("name", "src", "substitute", "flag") if k in e}
            out["basis"] = BASIS
            return out
    sys.exit(f"{name} not a substitute in AP_TRIPLE_EXT/{prof}")

NO_BAR = "without bumpers lower the bar under control"
KB_NOTE = "done with a kettlebell in a KB-only kit (the coach writes 'db or kb' as interchangeable, RP!C24)"
NO_LOAD = {"note": "no Olympic-lift option without a load: everyone in athletic training gets Olympic work (COACH-ANSWER ATH-10) - flag pattern_gap and put a DB or KB on the buy list (DB/KB snatch, KB squat clean)"}
new_picks = {
    "FULL_FACILITY": [lib_entry("FULL_FACILITY", "C92"), lib_entry("FULL_FACILITY", "C91"), lib_entry("FULL_FACILITY", "ADD-ATH10-1")],
    "FULL_GYM": [lib_entry("FULL_GYM", "C92", NO_BAR), lib_entry("FULL_GYM", "ADD-ATH10-1"), lib_entry("FULL_GYM", "C95", NO_BAR)],
    "BASIC_GYM": [lib_entry("BASIC_GYM", "C92", NO_BAR), lib_entry("BASIC_GYM", "ADD-ATH10-1"), lib_entry("BASIC_GYM", "C95", NO_BAR)],
    "HOME_BARBELL": [lib_entry("HOME_BARBELL", "C92", NO_BAR), lib_entry("HOME_BARBELL", "ADD-ATH10-1"), lib_entry("HOME_BARBELL", "C95", NO_BAR)],
    "HOME_DB_BENCH": [lib_entry("HOME_DB_BENCH", "ADD-ATH10-2"), lib_entry("HOME_DB_BENCH", "ADD-ATH10-3"), sub_entry("HOME_DB_BENCH", "Staggered stance DB snatch")],
    "HOTEL_GYM": [lib_entry("HOTEL_GYM", "ADD-ATH10-2"), lib_entry("HOTEL_GYM", "ADD-ATH10-3"), sub_entry("HOTEL_GYM", "Staggered stance DB snatch")],
    "KB_ONLY": [lib_entry("KB_ONLY", "ADD-ATH10-3"), lib_entry("KB_ONLY", "ADD-ATH10-2", KB_NOTE), sub_entry("KB_ONLY", "Fast KB swings")],
}
MB_NOTE = {"note": "no barbell, DB or KB in this kit: everyone in athletic training gets Olympic work (COACH-ANSWER ATH-10); the nearest option is a heavy-medball hang clean (the coach names it as a use for a heavier ball, up to 20 lb, EQ-06) - PROPOSED - PENDING COACH APPROVAL; otherwise flag pattern_gap and put a DB or KB on the buy list"}
for prof in ("BODYWEIGHT", "FIELD_TRACK_KIT", "FIELD_TRACK_NO_KIT"):
    cur = [e for e in pk[prof]["athlete"] if "note" not in e or "name" in e]
    new_picks[prof] = cur + [dict(MB_NOTE if prof == "FIELD_TRACK_KIT" else NO_LOAD)]
changed = 0
for prof, L in new_picks.items():
    if pk[prof]["athlete"] != L:
        pk[prof]["athlete"] = L
        changed += 1
if changed:
    log.append(f"J2 athlete AP_TRIPLE_EXT picks rebuilt in {changed} profiles: Olympic-lift work first (v1 picks had bodyweight squat-to-calf-raise / lunge-to-high-knee first in every profile, contradicting ATH-10 and CR-01)")
fam = d["client_families"]["athlete"]
rule = "AP_TRIPLE_EXT: Olympic-lift work first (full lifts where the kit allows; hang cleans lowered under control without bumpers; DB/KB snatches and cleans at home); bodyweight triple extension only when there is no load, with a pattern_gap flag (COACH-ANSWER ATH-10, CR-01). The generic constraint score preferred constraint-1 bodyweight items, so this slot is set by rule."
if fam.get("olympic_rule") != rule:
    fam["olympic_rule"] = rule

# ---------------------------------------------------------------- J3 CR-11 vs EQ-03
cr = {r["id"]: r for r in d["client_rules"]}
r11 = cr["CR-11"]
new_then = {
    "default": "COACH-ANSWER EQ-03 - RIGHT: older clients lean machine/cable for compounds AND isolation ('If they're old ... I'd rather they collect that volume in a safe place with more constraints'); the EQ-04 machines are open to them",
    "block_1": {"constraint": [3, 5]},
    "block_2_plus": {"main_lifts_constraint": [3, 5], "accessories_constraint": [3, 5]},
    "free_weight_option": "PROPOSED - PENDING COACH APPROVAL: from block 2, a high-functioning client with a training foundation (ATH-09: 'age, foundation, goal, and injuries') and no pain may take 1-2 free-weight main lifts at constraint 2-3 if they prefer them (EQ-10); SCIENCE [S12]: high-functioning older adults gain more from free weights. Never the default.",
    "share_hard_sets_constraint_ge3": "most hard sets by default (EQ-03); 40-60% only under the PROPOSED free-weight option",
    "never": "the EQ-03 list still applies (overhead squat, snatch, low-bar squat, depth jumps)",
    "plyos": "few, unless the client asks for them (COACH-ANSWER ATH-09)",
}
if r11["then"] != new_then:
    r11["then"] = new_then
    r11["basis"] = "COACH-ANSWER EQ-03 (default), ATH-09; free-weight option PROPOSED - PENDING COACH APPROVAL (SCIENCE [S12]; EQ-10 preference)"
    log.append("J3 CR-11 (60+ high-functioning): v1 moved main lifts to free weights (constraint [2, 3]) in block 2+ by default, contradicting EQ-03; default is now machine/cable-leaning [3, 5] and the free-weight route is a PROPOSED option")

# ---------------------------------------------------------------- J4 LV-5 softened
pol = d["level_model"]["generator_policy"]
lv5 = "LV-5 (CAT-04, PER-06, CAT-05) When a slot moves up (end of a block, the exercise felt '8 - That was perfect' or easier and no pain - PER-06), the next option may be one step along the zone ladder - zone 1 (goblet, zercher, hex, suitcase) -> zone 2 (front rack, horizontal) -> zone 3 (back-loaded, overhead) - or one guidance step less (machine -> cable -> free; GRD-2). Optional, never required: the levels are 'still very theoretical' (CAT-05, LV-8)."
for i, s in enumerate(pol):
    if s.startswith("LV-5") and s != lv5:
        pol[i] = lv5
        log.append("J4 LV-5 no longer moves every client one zone per block; it applies only when PER-06 says the slot moves up, and stays optional (CAT-05)")

# ---------------------------------------------------------------- J5 stale override count
ch = d["_meta"]["changes_from_coach_answers"]
old0 = "level_model (CAT-04/05/06: Davidson load-position zones, guidance modifier, soft cumulative levels; operative-level overrides: 6 entries up to ADVANCED, 14 down to FOUNDATIONAL)"
new0 = "level_model (CAT-04/05/06/10: Davidson load-position zones with rotation bias, guidance modifier, soft cumulative levels; operative-level overrides v1: 4 up - back squats AI49/AI50 to ADVANCED, push jerks AA13/AA14 to INTERMEDIATE (LIB-13); 14 down to FOUNDATIONAL; GHD AN48/AN93 to 'any' (LIB-08). v0 had 6 up because it also raised the push presses and jerks to ADVANCED)"
if ch and ch[0] == old0:
    ch[0] = new0
    log.append("J5 _meta.changes_from_coach_answers said '6 entries up to ADVANCED' (v0); v1 has 4 up (2 to A, 2 to I), 14 down, 2 to 'any'")

# ---------------------------------------------------------------- J6 rotation bias for the hips/knees
LOWER = {"RP_BKD", "RP_BHD", "RP_UKD", "RP_UHD", "ISO_QUAD", "ISO_LEG_FLEXION", "ISO_CALF",
         "FOCUS_QUADS", "FOCUS_HAMSTRINGS", "FOCUS_GLUTES", "FOCUS_CALVES"}
SUFFIX = " - from where the arms hold the load (INFERRED); the hips and knees follow depth: deep squat = external-rotation bias, knee at hip height / half squat = internal-rotation bias (COACH-ANSWER CAT-10)"
j6 = 0
for cell, e in ei.items():
    rb = e.get("rotation_bias")
    if e["bucket"] in LOWER and rb and SUFFIX not in rb:
        e["rotation_bias"] = rb + SUFFIX
        j6 += 1
lm = d["level_model"]
scope = ("rotation_bias is read from the arm / load position (hands down = zone 1 external, hands in front = zone 2 internal, overhead = zone 3 external). "
         "For the hips and knees the coach ties the bias to depth, not to where the load sits: standing and deep squat = external-rotation bias, knee at hip height / half squat = internal-rotation bias, compressive (COACH-ANSWER CAT-10). "
         "So a lower-body exercise has both readings; the load-position zone sets the level (CAT-04) and the depth sets the hip bias. Zones do not apply to plyos (CAT-10). The levels built on zones are 'still very theoretical' (CAT-05).")
if lm.get("rotation_bias_scope") != scope:
    lm["rotation_bias_scope"] = scope
if j6:
    log.append(f"J6 rotation_bias on {j6} lower-body entries was mapped from the load-position zone only (e.g. a full-depth front squat tagged 'half squat / internal'); now also states the CAT-10 depth rule for hips and knees; level_model.rotation_bias_scope added")

# ---------------------------------------------------------------- J7 zone_shift is a velocity-zone flag
meta = d["_meta"]
fd = {
    "same_pattern": "the substitute is the same movement pattern with another implement",
    "partial": "the substitute covers part of the pattern",
    "zone_shift": "the substitute trains a different VELOCITY (force-velocity) zone than the slot, e.g. strength-speed -> reactive (broad jumps for a loaded clean); it is NOT a Davidson position zone (level_model) and NOT a plyo method stage (CAT-10/CAT-11)",
    "pattern_gap": "no real option with this kit: show the substitute and the buy list (the coach's ideal home kit, EQ-02)",
    "rule": "a coach rule replaces the slot (e.g. 'leg press or just add 2 more rounds to front squats')",
}
if meta.get("substitute_flag_definitions") != fd:
    meta["substitute_flag_definitions"] = fd
    log.append("J7 'zone_shift' defined as a velocity-zone flag (_meta.substitute_flag_definitions); 'zone' now also means Davidson position zone, so the flag needed a definition")
p20 = cr["CR-20"]["then"]
if "flag 'zone_shift')" in p20.get("power", "") and "velocity zone" not in p20["power"]:
    p20["power"] = p20["power"].replace("(flag 'zone_shift')", "(flag 'zone_shift' = a change of velocity zone, not of Davidson zone)")
lvn = "load_velocity.zones are velocity (force-velocity) zones: reactive, speed-strength, strength-speed, accelerative/absolute strength, hypertrophy, local-fatigue. They are not the Davidson position zones of level_model."
if d["load_velocity"].get("zones_note") != lvn:
    d["load_velocity"]["zones_note"] = lvn

# ---------------------------------------------------------------- J8 tab names are citations only
tn = ("Sheet tab names are cited only to locate cells. 'JUSTICE LEAGUE' was a marketing name (COACH-ANSWER ATH-13) and is never shown as a program name (FIX-03: names must be general and understandable): "
      "the generator calls that program 'All-around athletic / weekend warrior (non-competitive adults and youth)' (profile weekend_warrior, as in 01_taxonomy and 04_athlete_profiles).")
if meta.get("tab_names_note") != tn:
    meta["tab_names_note"] = tn
    log.append("J8 _meta.tab_names_note: JUSTICE LEAGUE kept only as a cell citation; generator name per ATH-13/FIX-03")

# ---------------------------------------------------------------- J9 ankle-hop zone basis
j9 = 0
for c in [f"C{i}" for i in range(126, 137)]:
    e = ei.get(c)
    if e and e.get("load_position_zone") is None and "CAT-10" not in (e.get("zone_basis") or ""):
        e["zone_basis"] = "COACH-ANSWER CAT-10: Davidson zones do not apply to plyos (ankle hops are plyometric contacts); progress by method, bilateral -> unilateral and contact speed"
        j9 += 1
if j9:
    log.append(f"J9 zone_basis of the {j9} ankle-hop items C126:C136 now cites CAT-10 (zones do not apply to plyos) instead of 'zone set by the LOADING list when loaded'")

# ---------------------------------------------------------------- J10 reverse band in evidence text
ce = d["implements"]["bodyweight"]["coach_evidence"]
for i, s in enumerate(ce):
    if "'REVERSE BANDED'" in s and "EQ-12" not in s:
        ce[i] = s + " - v1: the reverse band is out of scope (EQ-12); 'DELOAD WEIGHT' (the DB-release jump) stays"
        log.append("J10 implements.bodyweight evidence: 'REVERSE BANDED' marked out of scope (EQ-12)")

# ---------------------------------------------------------------- J11 new open question
q12 = "Older but fit clients (60+, years of training, no pain): machines and cables by default for the main lifts too (EQ-03), or may they keep 1-2 free-weight main lifts if they prefer (ATH-09 'foundation', EQ-10)? v1 keeps machines as the default and lists the free-weight route as PROPOSED (CR-11)."
nfa = d["open_questions"]["new_from_answers"]
if q12 not in nfa:
    nfa.append(q12)
    log.append("J11 open question 12 added (older but fit clients: machine default vs free-weight option, CR-11)")
pend = "PROPOSED - PENDING COACH APPROVAL (v1 verification): free-weight main lifts for fit 60+ clients (CR-11, open question 12); heavy-medball hang clean as the field-kit Olympic option (athlete picks, ATH-10 / EQ-06)."
if pend not in meta["v1"]["pending"]:
    meta["v1"]["pending"].append(pend)
    log.append("J13 _meta.v1.pending: the two new PROPOSED items added")
for a in meta["v1"]["applied"]:
    if a.get("ids") == "all" and "11 new questions come from the answers." in a["change"]:
        a["change"] = a["change"].replace("11 new questions come from the answers.",
                                          "12 new questions come from the answers (the 12th was added by the v1 verification, CR-11).")
        log.append("J12 _meta.v1.applied 'all': open-question count 11 -> 12")

# ---------------------------------------------------------------- record
rec = {
    "date": "2026-10-08",
    "scope": "Adversarial check of the v1 equipment update against coach_answers_full.md (all equipment-relevant answers) and a grep of the md/JSON/10b for retired ideas. JSON fixes applied by synthesis/_build_10/patch_10_v1_verify.py (idempotent; re-run it after build_10_assemble.py).",
    "fixes": log,
}
old = meta["v1"].get("verification_pass_2")
if log:
    if old:  # merge: keep earlier entries, replace an entry whose J-id is logged again
        ids = {f.split(" ", 1)[0] for f in log}
        rec["fixes"] = [f for f in old.get("fixes", []) if f.split(" ", 1)[0] not in ids] + log
        rec["fixes"].sort(key=lambda f: int(f.split(" ", 1)[0][1:]))
    meta["v1"]["verification_pass_2"] = rec
json.dump(d, open(PATH, "w", encoding="utf-8"), indent=1, ensure_ascii=False)
print("\n".join(log) if log else "nothing to change (already patched)")
