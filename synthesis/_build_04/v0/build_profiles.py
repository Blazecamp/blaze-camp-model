# -*- coding: utf-8 -*-
import json, os, copy, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import profiles_data as D

ROOT = "/Users/blazecamp/Library/Application Support/Claude/scratch-workspaces/83ae7031-57e0-42ef-bdf5-367a4e003c8c/ad065e19-f0c9-4863-bdf7-041381884595/scratch-2026-10-07-304072/blaze-camp-model"
OUTDIR = os.path.join(ROOT, "synthesis")
os.makedirs(OUTDIR, exist_ok=True)

obs_rows = {r["program"]: r for r in json.load(open(os.path.join(HERE, "observed_emphasis.json")))["rows"]}
obs_table = json.load(open(os.path.join(HERE, "observed_table.json")))

BMAP = {"AP_PLYO": "PLYO", "AP_JUMP_LIMITED_KNEE": "JLK", "AP_THROW": "THROW", "AP_COD": "COD", "AP_SPRINT": "SPRINT", "AP_TRIPLE_EXT": "TE",
        "RP_BKD": "BKD", "RP_BHD": "BHD", "RP_UKD": "UKD", "RP_UHD": "UHD", "RP_HPUSH": "HPUSH", "RP_VPUSH": "VPUSH", "RP_HPULL": "HPULL", "RP_VPULL": "VPULL",
        "ISO_QUAD": "ISO_QUAD", "ISO_HAM": "ISO_HAM", "ISO_CHEST": "ISO_CHEST", "ISO_SIDE_REAR_DELT": "ISO_SIDE", "ISO_BICEP": "ISO_BICEP", "ISO_TRICEP": "ISO_TRICEP", "ISO_CALF": "ISO_CALF",
        "CT_CORE_THORAX": "CORE", "CP_CORE_PELVIS": "CORE", "CORE_OTHER": "CORE", "CT_CORE_THORAX_or_CP_CORE_PELVIS": "CORE", "FOCUS": "FOCUS", "FUNCTIONAL": "CORE"}

def from_row(name, extra=None):
    r = obs_rows[name]
    out = {}
    src = {}
    # rebuild bucket dict from athletic_by_type + need raw buckets -> reload json rows has only summaries; use raw file
    return r

RAW = json.load(open(os.path.join(HERE, "observed_emphasis.json")))
# raw buckets are not stored per row -> recompute from source JSONs here
PROG = os.path.join(ROOT, "analysis", "programs")
def L(f): return json.load(open(os.path.join(PROG, f)))

def mean(ds):
    keys = set().union(*[set(d) for d in ds])
    return {k: sum((d.get(k) or 0) for d in ds) / len(ds) for k in keys}

def mapb(b):
    o = {}
    for k, v in b.items():
        if k in BMAP and isinstance(v, (int, float)):
            o[BMAP[k]] = round(o.get(BMAP[k], 0) + float(v), 2)
    return {k: v for k, v in o.items() if v}

obs_buckets = {}
d = L("prog_byop_athletic.volume.json")
for p in d["programs"]:
    if p["tab"] == "JUSTICE LEAGUE": obs_buckets["athlete_generic"] = mapb(p["weekly_sets_by_bucket"]["assumed_2sets_all6"])
d = L("prog_byop_aesthetics.volume.json")
for p in d["programs"]:
    if p["tab"].startswith("AESTHETICS"):
        obs_buckets["bodybuilding_aesthetics"] = mapb({k: v.get("assumed_convention_plus_optional", 0) for k, v in p["weekly_sets_by_bucket"].items() if isinstance(v, dict)})
d = L("prog_mm_gym.volume.json")
obs_buckets["fat_loss"] = mapb(mean([p["weekly_sets_by_bucket_incl_circuits"] for p in d["programs"] if "FAT" in p["tab"]]))
d = L("prog_mm_athletic_boxing.volume.json")
for p in d["programs"]:
    if p["program_id"] == "MM_BOX_W3_8":
        obs_buckets["boxing"] = mapb(mean([p["weekly_sets_by_bucket_by_week"][w] for w in ("W3", "W4", "W5", "W6")]))
    if p["program_id"] == "MM_BOX_W1_2":
        obs_buckets["boxing_base"] = mapb(p["weekly_sets_by_bucket_by_week"]["W1"])
d = L("prog_mm_baseball.volume.json")
b1 = [w["weekly_sets_by_bucket_assumed"] for w in d["weeks"] if w["block"] == 1 and w["grid"] != "B1W8"]
bb = mapb(mean(b1)); bb["COD"] = bb.get("COD", 0) + 2; bb["SPRINT"] = round(bb.get("SPRINT", 0) + 2, 2)
obs_buckets["baseball_position"] = bb
d = L("prog_mm_crossfit_tracks.volume.json")
for p in d["programs"]:
    pid = p["program_id"]; b = p["weekly_sets_by_bucket"]
    if pid == "MM_CF_COMPETE_FULLTIME":
        obs_buckets["crossfit_competitor"] = mapb(b["JULY"]["assumed_res3"]); obs_buckets["crossfit_power_month"] = mapb(b["SEPT"]["assumed_res3"])
    if pid in ("MM_STRENGTH_CONJUGATE_8WK_v04", "MM_HYBRID_8WK"):
        weeks = [(v.get("assumed") or v.get("as_written")) if isinstance(v, dict) and ("assumed" in v or "as_written" in v) else v for wk, v in b.items()]
        weeks = weeks[:7]
        obs_buckets["powerlifting_strength" if "STRENGTH" in pid else "hybrid"] = mapb(mean(weeks))

PROFILES = copy.deepcopy(D.P)
for p in PROFILES:
    if p["id"] in obs_buckets:
        p["weekly_sets"] = {k: round(v, 1) for k, v in obs_buckets[p["id"]].items()}
        p["weekly_sets_source"] = "OBSERVED (computed from the program decode volume JSON)" + ("; COD +2 and SPRINT +2 INFERRED for position players" if p["id"] == "baseball_position" else "")
    else:
        p["weekly_sets_source"] = "INFERRED set budget (analyst), sized to the coach's observed session budget"
    if p["id"] == "boxing":
        p["base_phase_weekly_sets"] = {k: round(v, 1) for k, v in obs_buckets["boxing_base"].items()}
    if p["id"] == "crossfit_competitor":
        p["power_month_weekly_sets"] = {k: round(v, 1) for k, v in obs_buckets["crossfit_power_month"].items()}

def tier_of(scale, x):
    for t in ("T0", "T1", "T2", "T3", "T4", "T5"):
        lo, hi = scale[t]
        if lo <= x <= hi: return t
    return "T5+" if x > scale["T5"][1] else "T0"

def derive(ws, days):
    g = lambda k: float(ws.get(k, 0) or 0)
    ath = {k: g(k) for k in D.CATS_ATH}
    A = sum(ath.values()); RP = sum(g(k) for k in D.CATS_RP); ISO = sum(g(k) for k in D.CATS_ISO); CORE = g("CORE"); FOC = g("FOCUS")
    tot = A + RP + ISO + CORE + FOC
    pct = lambda x, den=tot: round(100 * x / den, 1) if den else 0
    muscles = {}
    for k, cr in D.CREDIT.items():
        for m, w in cr.items():
            muscles[m] = round(muscles.get(m, 0) + g(k) * w, 1)
    lb, lu = g("BKD") + g("BHD"), g("UKD") + g("UHD")
    push, pull = g("HPUSH") + g("VPUSH"), g("HPULL") + g("VPULL")
    nom = {k: round(g(k) * D.NOMINAL[k][0]) for k in D.NOMINAL}
    main = days.get("main", 4)
    return {
        "weekly_sets_total": round(tot, 1),
        "sets_by_family": {"athletic": round(A, 1), "athletic_excl_throws": round(A - ath["THROW"], 1), "resistance_compound": round(RP, 1), "resistance_isolation": round(ISO, 1), "core": round(CORE, 1), "focus": round(FOC, 1)},
        "share_pct": {"athletic": pct(A), "athletic_excl_throws_of_non_throw_sets": pct(A - ath["THROW"], tot - ath["THROW"]),
                      **{"ath_" + k: pct(v) for k, v in ath.items()}, "resistance_compound": pct(RP), "resistance_isolation": pct(ISO), "core": pct(CORE), "focus": pct(FOC)},
        "athletic_mix_pct": {k: (round(100 * v / A, 1) if A else 0) for k, v in ath.items()},
        "lower_bilateral_unilateral_sets": [round(lb, 1), round(lu, 1)], "unilateral_pct_of_lower_compound": pct(lu, lb + lu) if lb + lu else None,
        "push_pull_sets": [round(push, 1), round(pull, 1)], "pull_per_push": round(pull / push, 2) if push else None,
        "knee_hip_sets": [round(g("BKD") + g("UKD") + g("ISO_QUAD"), 1), round(g("BHD") + g("UHD") + g("ISO_HAM"), 1)],
        "compound_to_isolation": round(RP / ISO, 2) if ISO else None,
        "resistance_sets_by_muscle": muscles,
        "nominal_weekly_dose_from_sets": {"plyo_high_contacts": nom["PLYO"], "plyo_low_contacts": nom["JLK"], "throws": nom["THROW"], "cod_cuts": nom["COD"], "sprint_m": nom["SPRINT"], "triple_ext_reps": nom["TE"]},
        "tier_check_from_sets": {"plyo_high": tier_of(D.SCALES["plyo_high_contacts_wk"], nom["PLYO"]), "plyo_low": tier_of(D.SCALES["plyo_low_contacts_wk"], nom["JLK"]),
                                 "throws": tier_of(D.SCALES["throws_wk"], nom["THROW"]), "cod": tier_of(D.SCALES["cod_cuts_wk"], nom["COD"]), "triple_ext_sets": tier_of(D.SCALES["triple_ext_sets_wk"], g("TE"))},
        "avg_sets_per_main_day_if_all_on_main_days": round(tot / main, 1),
    }

for p in PROFILES:
    p["derived"] = derive(p["weekly_sets"], p["days"])
    for v in p.get("variants", []):
        if "weekly_sets_delta" in v:
            ws = dict(p["weekly_sets"])
            for k, dv in v["weekly_sets_delta"].items():
                ws[k] = max(0, round(ws.get(k, 0) + dv, 1))
            v["weekly_sets"] = ws
            v["derived"] = derive(ws, p["days"])

# ------------------------------------------------------------------ observed populations
EXTRA = {
 "BYOP AESTHETICS - FULL BODY - 4 DAYS (assumed_convention_plus_optional)": dict(label="BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated)", pop="aesthetics / physique", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="2 'Cardio' slots (client pick)", core="2 'Core' slots (client pick)"),
 "BYOP 3 DAY BUILDER (assumed_convention_plus_optional)": dict(label="BYOP 3 DAY BUILDER (+optional)", pop="aesthetics 3-day", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="3 'Cardio' slots", core="3 'Core' slots"),
 "BYOP PUSHPULLLEGS - 3 or 6 DAYS A WK @3 sets": dict(label="BYOP PPL 6-day @3 sets", pop="bodybuilding split", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="none", core="none"),
 "BYOP BOOTCAMP - OPTION 1 @3 sets": dict(label="BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3", pop="bootcamp / general fitness", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="2 cardio slots", core="2"),
 "BYOP BOOTCAMP - OPTION 2 @3 sets": dict(label="BYOP BOOTCAMP 2 (6 sessions) @3", pop="bootcamp / conditioning", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="6 cardio bouts (one per session)", core="2"),
 "BYOP ATHLETIC - FULL BODY - 4 DAYS A @2 sets all 6 days": dict(label="BYOP ATHLETIC 4-day @2 (coach dose)", pop="generic athlete", contacts="72-96 high (est.)", throws="64-96", cod="48-64 cuts", sprint="none", te="8 sets", cond="2 'Aerobic Capacity' (client colour)", core="2 slots (client pick)"),
 "BYOP JUSTICE LEAGUE @2 sets all 6 days": dict(label="BYOP JUSTICE LEAGUE (partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots)", pop="athlete (partly filled example)", contacts="~60-80 high + ~12-16 low (est.: PLYO 10 / JLK 2 sets x '6 to 8 Reps')", throws="64-96", cod="48-64", sprint="none", te="8 ('Power Clean')", cond="2 slots", core="2 slots"),
 "BYOP NO ACCESS - ATHLETIC - FB - 4 t @2 sets all 6 days": dict(label="BYOP NO ACCESS ATHLETIC (as wired)", pop="athlete (hidden copy; UHD miswired to LEG CURLS)", contacts="72-96 (est.)", throws="64-96", cod="48-64", sprint="none", te="8", cond="2", core="2"),
 "MM EXAMPLE UPPERLOWER SPLIT NOVICE ": dict(label="MM UPPER/LOWER NOVICE (4d)", pop="general gym", contacts="A-drills 72 per leg per lower day (144/wk at 2 lower days)", throws="0", cod="0", sprint="T1 drills 12 sets", te="0", cond="5-min warm-up + optional C Wed/Sat max 40 min", core="0"),
 "MM EXAMPLE UPPERLOWER SPLIT NEWBY ": dict(label="MM UPPER/LOWER NEWBY (4d)", pop="general gym", contacts="A-drills 90 per leg per lower day (180/wk)", throws="0", cod="0", sprint="T1 18 sets", te="0", cond="as above", core="0"),
 "MM EXAMPLE UPPERLOWER SPLIT INTERMEDIATE ": dict(label="MM UPPER/LOWER INTERMEDIATE (4d)", pop="general gym", contacts="A-drills 64 per leg per lower day (128/wk)", throws="0", cod="0", sprint="T1 16 sets", te="0", cond="as above", core="0"),
 "MM EXAMPLE PUSHPULLLEGS SPLIT NOVICE ": dict(label="MM PPL NOVICE (6d)", pop="bodybuilding split", contacts="A-drills", throws="0", cod="0", sprint="T1", te="0", cond="as above", core="'KB Book openers' 1 set/push day"),
 "MM EXAMPLE PUSHPULLLEGS SPLIT NEWBY ": dict(label="MM PPL NEWBY (6d)", pop="bodybuilding split", contacts="A-drills", throws="0", cod="0", sprint="T1", te="0", cond="as above", core="1 set"),
 "MM EXAMPLE PUSHPULLLEGS SPLIT INTERMEDIATE ": dict(label="MM PPL INTERMEDIATE (6d)", pop="bodybuilding split", contacts="A-drills", throws="0", cod="0", sprint="T1", te="0", cond="as above", core="1 set"),
 "FAT BURN WK1-4 mean": dict(label="MM FAT BURN wk1-4 mean (lifting + circuits)", pop="fat loss / toning", contacts="jacks/burpees only", throws="0", cod="0", sprint="0", te="0", cond="C 2 x 30-40 min + 2 circuits (12 -> 33 min work)", core="circuits only (9-15 sets)"),
 "MM MM_ATH_STARTING": dict(label="MM ATHLETIC STARTING (3d)", pop="athlete off-season block 1", contacts="146 high + 0 low (+210 high-knee est.) + 48 upper", throws="210 (ASSUMED: cell says only 'ALL LIST'; read as the 19-throw ballistics 'MEDBALL CHEAT SHEET', 17x10 + 2x20)", cod="0", sprint="2 sets high-knee runs", te="6", cond="optional C Wed/Sat max 40 min", core="20 sets (thorax/pelvis/both, frontal side planks)"),
 "MM MM_ATH_MID": dict(label="MM ATHLETIC MID (4d)", pop="athlete off-season block 2", contacts="71 high + 120 low", throws="400 (10 rotational x 2x10, 2 days)", cod="0", sprint="0", te="4", cond="optional C", core="14 sets"),
 "MM MM_ATH_ADVANCED": dict(label="MM ATHLETIC ADVANCED (4d)", pop="athlete off-season block 3", contacts="32 high + 100 low", throws="420 (ASSUMED: 2 x 'ALL LIST')", cod="0", sprint="0", te="4 ('Power Cleans' 3x3)", cond="optional C", core="26 sets"),
 "MM MM_BOX_W1_2 W1": dict(label="MM BOXER wk1-2 (base)", pop="boxer", contacts="0", throws="190", cod="0", sprint="0", te="0", cond="A '20 sec fast/ 40 sec slow' x1 + C '20 min' x1", core="14 sets"),
 "BOX W3-6 mean": dict(label="MM BOXER wk3-6 mean (conversion)", pop="boxer", contacts="113-129 high + 177 low + rope ~1080 est. (wk3-6; wk7 116 + 142, wk8 116 + 167)", throws="380", cod="0", sprint="3 sets (high knees in complex)", te="9", cond="A 'Sprint 20/ Recover 40' x5-6 + C 20-40 min + 3 min rope x3", core="16-18 sets"),
 "MM MM_BOX_W3_8 W7": dict(label="MM BOXER wk7 (mini-deload)", pop="boxer", contacts="116 high + 142 low + rope ~720", throws="380", cod="0", sprint="4", te="9", cond="A x7 rounds + C", core="16"),
 "MM MM_BOX_W3_8 W8": dict(label="MM BOXER wk8 (peak)", pop="boxer", contacts="116 high + 167 low + rope ~1440", throws="380", cod="0", sprint="6", te="12", cond="A x8 rounds + C", core="20"),
 "MM BASEBALL B1 mean": dict(label="MM BASEBALL Block 1 (off-season)", pop="baseball", contacts="103 high + 97 low", throws="178 (45% transverse)", cod="0", sprint="1 set", te="0.6 (+16 optional OLY wk6-7)", cond="buy-outs ~3.3 bouts/wk (A, 10-39 s)", core="11 sets/wk; Mon frontal, Tue/Fri transverse, Thu sagittal"),
 "MM BASEBALL B2 mean": dict(label="MM BASEBALL Block 2 (pre-season)", pop="baseball", contacts="151 high + 89 low", throws="192 (63% transverse)", cod="0", sprint="3.1 sets", te="0.6 (+16 optional OLY wk5-8)", cond="buy-outs ~3.3/wk", core="16 sets"),
 "MM BASEBALL B3 mean": dict(label="MM BASEBALL Block 3 (in-season)", pop="baseball", contacts="135 high + 66 low", throws="176 (60% transverse)", cod="0", sprint="1.8 sets", te="1.0, no OLY", cond="buy-outs ~3.8/wk ('1x 30 Sec Fast Run', cal sprints)", core="16 sets"),
 "MM BASEBALL deload/recovery B2W8 mean": dict(label="MM BASEBALL B2 'DELOAD WEEK'", pop="baseball", contacts="90 total", throws="104", cod="0", sprint="0", te="0", cond="no buy-out", core="7 sets"),
 "CF COMPETE strength months JUN/JUL/NOV mean": dict(label="MM CROSSFIT competitor - strength months", pop="CrossFit competitor", contacts="DU skill", throws="WOD only", cod="0", sprint="0", te="0", cond="aerobic 2-3 sessions + WODs 0-3", core="T2B skill"),
 "CF COMPETE power months AUG/SEPT/DEC mean": dict(label="MM CROSSFIT competitor - power months", pop="CrossFit competitor", contacts="DU skill", throws="WOD only", cod="0", sprint="0", te="20-24 Olympic sets", cond="aerobic 3-4 sessions + WOD days 2-4 (AUG 2 at WOD level 3; SEPT/DEC 4)", core="skill"),
 "MM MM_CF_CLASS_HALFTIME_8WK mean loading weeks": dict(label="MM CROSSFIT class (HALF TIME)", pop="CrossFit class member", contacts="DUBS skill", throws="WOD", cod="0", sprint="0", te="6", cond="WOD every class day + aerobic LVL 3-4", core="skill"),
 "MM MM_STRENGTH_CONJUGATE_8WK_v04 mean loading weeks": dict(label="MM STRENGTH-8 conjugate", pop="strength / powerlifting", contacts="18 ('EASY' 3x6)", throws="0", cod="0", sprint="0", te="0", cond="none", core="none"),
 "MM MM_STRENGTH_CONJUGATE_12WK mean loading weeks": dict(label="MM STRENGTH-12 (% + RPE)", pop="strength", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="none", core="none"),
 "MM MM_AESTHETICS_8WK mean loading weeks": dict(label="MM AESTHETICS-8 (upper/lower)", pop="aesthetics", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="C 2 x 30-40 min", core="none (accessories)"),
 "MM MM_AESTHETICS_12WK_PPL mean loading weeks": dict(label="MM AESTHETICS-12 PPL", pop="aesthetics (high volume)", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="none written", core="none"),
 "MM MM_HYBRID_8WK mean loading weeks": dict(label="MM HYBRID-8", pop="hybrid", contacts="~36 (3x6 x2, ASSUMED - no sets/reps on the JUMPS rows; the tab's SETS/REPS rows 71-72 would give 24-60, mean ~41)", throws="0", cod="0", sprint="A: 10-15 x 15-30 s", te="4-8 'heavy'", cond="A sprint day + C '15-40 min' + 'AMRAP' 12 -> 20 (row 70, not tied to a day; Sat placement INFERRED)", core="integrated tri-sets ~13 sets"),
}
OBS = []
for r in obs_table:
    e = EXTRA.get(r["program"])
    if not e: continue
    OBS.append({"program": e["label"], "source_key": r["program"], "population": e["pop"], "weekly_sets": r["tot"],
                "share_pct": {"athletic_incl_throw_sets": r["ath_incl"], "athletic_excl_throws": r["ath_excl"], "resistance_compound": r["rp"], "resistance_isolation": r["iso"], "core": r["core"], "focus": r["focus"]},
                "athletic_sets_by_type": r["mix"], "lower_bilateral_unilateral": [r["bi"], r["uni"]], "unilateral_pct": r["unipct"], "knee_hip_sets": r["knee_hip"], "push_pull_sets": r["push_pull"],
                "compound_to_isolation": r["rp_iso"], "contacts_wk": e["contacts"], "throws_wk": e["throws"], "cod_wk": e["cod"], "sprint_wk": e["sprint"], "triple_ext": e["te"], "conditioning": e["cond"], "core_detail": e["core"],
                "evidence": "OBSERVED slots/sets (assumed set counts flagged in source decode)"})
# half marathon
OBS.append({"program": "MM Sheet24 HALF MARATHON (borrowed: 'by CHRIS HINSHAW')", "population": "distance runner", "weekly_sets": 0, "share_pct": {}, "athletic_sets_by_type": {}, "contacts_wk": "0 (no lifting written)", "throws_wk": "0", "cod_wk": "0",
            "sprint_wk": "hill sprints 6-10 reps x 8-20 s (wk 1/2/4/6/12) / flat sprints 40-80 m (wk 3/5/8) on some days", "triple_ext": "0", "conditioning": "2 runs/week x 21 weeks: long (C), progression (B/C), intervals (B/A), mile tests wk 10/14, cut-backs wk 3/6/8/12/18, taper wk 21", "core_detail": "none", "evidence": "OBSERVED"})

# ------------------------------------------------------------------ meta / rules
LEVEL_MODIFIERS = {
    "athlete_ladder": {"evidence": "OBSERVED MM 'EXAMPLE ATHLETIC FULL BODY SPLI' STARTING -> MID -> ADVANCED", "per_step": {"working_sets": "-19% then -18%", "high_amplitude_contacts": "-51% then -55%", "low_amplitude_contacts": "0 -> 120 -> 100", "throws": "+90% then +5% (STARTING 210 and ADVANCED 420 rest on reading 'ALL LIST' as the 19-throw MEDBALL CHEAT SHEET; only MID's 400 is fully written)", "resistance_sets": "0% then -45%", "core_sets": "-30% then +86%", "main_lift_reps": "6-8 -> 6-8 -> 1 (deadlift 3x6 / 2x'6/8' / 'DEADLIFTS (1RIR)' 3x1)", "sets_per_line": "STARTING mostly 3 (range 1-5) -> MID mostly 2 (range 1-4) -> ADVANCED 1-3"},
                       "rule": "for athletes, a higher level = LESS volume, MORE intensity, more single-leg/reactive and more throws (INFERRED from OBSERVED)"},
    "gym_ladder": {"evidence": "OBSERVED MM UPPER/LOWER and PPL NOVICE -> NEWBY -> INTERMEDIATE", "per_step": {"weekly_resistance_sets": "+18-23% then +13-14%", "compound_reps": "NOT one direction: UL lower 2x12 -> 3x10 -> 4x8 (reps down) but UL upper bench/pulldown/OHP 3x8 -> 3x10 -> 4x12 (reps UP); PPL push/pull 3x15 -> 3-4x10 -> 4x8 (down) except pull-ups 3x15 -> 4x10 -> 5x12 and dips 3x8 -> 3x10 -> 4x'MAX'; PPL legs 2x8 -> 3x10 -> 4x8", "isolation": "arms 20 / 'MAX REPS', leg ext/curl 20 and calves 'MAX REPS' fixed in both tabs; UL side raises/upright rows fixed 3x20; but PPL delt isolation is NOT fixed (side raises 3x15 -> 4x8 -> 4x8, reverse flies and upright rows 3x15 -> 3x10 -> 4x8)"},
                   "rule": "for physique/general clients, a higher level = MORE sets (OBSERVED in every tab); compound reps move both ways (lower-body/PPL compounds down, UL upper compounds up), arm/leg isolation stays at 20/MAX"},
    "library_level_per_slot": {"evidence": "OBSERVED JUSTICE LEAGUE + AESTHETICS fills", "rule": "level is chosen per slot (FOUNDATIONAL / MODERATE / ADVANCED blocks inside each dropdown), not once per athlete; a power-cleaning athlete still gets FOUNDATIONAL landings"},
}
ASSEMBLY = [
    "1. Pick profile (+ variant/position), season phase, client level and plan length (6 / 8 / 12 weeks).",
    "2. Weekly set budget per category = profile.weekly_sets (off-season build baseline) x season multiplier (season_families) x level modifier (athlete ladder or gym ladder).",
    "3. Respect the coach's session budget (OBSERVED): athletic days <= 10 exercises and ~20-30 working sets (BYOP ATHLETIC / JUSTICE LEAGUE; BASEBALL median 9 exercises / 29 sets); physique days ~7 exercises / ~20 sets; optional days 5 slots / ~12 sets. If the budget is exceeded, cut sets per slot first (coach drops 3 -> 2 sets on athletic templates), then isolation slots, never the athletic prefix of an athlete profile.",
    "4. Place slots in the OBSERVED order: plyo -> throw -> COD -> (sprint) -> triple extension -> bilateral lower -> horizontal upper -> unilateral lower -> vertical upper -> isolation (BYOP; core lives on the Wed/Sat optional days); BASEBALL instead puts CORE second: Part A ballistics -> Part B core -> OPTIONAL OLY -> Part C bilateral + upper superset -> Part D unilateral + 2 isolations -> Part E buy-out; knee+pull / hip+push (BYOP) or bkd+uhd / bhd+ukd (BASEBALL); upper ballistics and lower ballistics on different days when athletic volume is high (BASEBALL Part A).",
    "5. Fill each slot from the library column, filtered by: library level for that slot, equipment, injury rules (injury_library), and the profile's plyo direction / laterality / plane targets.",
    "6. Dose reps from the category and the profile rep zone (VOL 1/2/3, STRENGTH, POWER, MYO); athletic slots in contacts / throws / cuts / metres (NOT the BYOP REPS menu, which cannot express them).",
    "7. Progress with the plan-length shapes (OBSERVED 4 TRACKS): 8 weeks = 7 loading + deload/test; 12 weeks = 6 + deload (wk 7) + 5; 6 weeks = the first 6 of the 12-week shape (INFERRED). Athletic blocks step every 2 weeks (boxer); hypertrophy blocks add whole sets every 2-3 weeks (+4.75-5.2%/week average).",
    "8. Audit: resistance sets per muscle vs the profile's sets_big_wk / sets_small_wk; contacts / throws / cuts vs tier ranges; conditioning colours (never the same colour twice in a week for clients on the cheat-sheet rule).",
]
GAPS = [
    {"gap": "No SPRINT slot in any BYOP template", "evidence": "OBSERVED: in BYOP only ' Max velocity running (top speed)' (PLYOS ADVANCED G128 and FULL JUMPING J11). In MASTER_MODEL sprint work does exist: Sheet23 '✅ MACH DRILLS' / '✅ Acceleration starts' (B48/B49), the cheat-sheet 'RUNNING WARMUP' ('A March', 'A Skip', 'A Runs', 'Falling start accelerations' 5 x '10 yards'), UL/PPL A-drills, BASEBALL '30m acceleration sprint' / 'accelerations baseball starts'", "needed_by": "soccer, football skill, track, basketball, baseball position players"},
    {"gap": "REPS menu cannot express contacts, throws per side, metres, seconds or 1-3 reps", "evidence": "OBSERVED AW8:AW14 '4 to 6 Reps' .. '20 Reps', 'MYO SET'", "needed_by": "every athletic profile"},
    {"gap": "No neck exercises", "evidence": "OBSERVED: none in the library or programs", "needed_by": "wrestling, BJJ, MMA, football, Muay Thai, hockey"},
    {"gap": "CARRY and DRAGS headings have no exercises", "evidence": "OBSERVED BA/BB columns hold only sub-headings (CARRY: 'PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; DRAG: 'SAGITAL', 'FRONTAL'). Carries ARE programmed elsewhere: BASEBALL 'Single side KB carry' (E47, S65) and 'KB Single arm farmer walk carry' (W49), CONTROL PATTERNS 'single side carry' (B10); no drag appears anywhere", "needed_by": "wrestling, BJJ, MMA, linemen, general population (grip/anti-lateral flexion)"},
    {"gap": "Rear-delt / external-rotation work has no own slot", "evidence": "OBSERVED: reverse flies share the 'ABdution' list; PPL has 'Reverse Flies' slot only", "needed_by": "every overhead / throwing sport"},
    {"gap": "Reactive agility is defined but not programmed", "evidence": "OBSERVED AGILITYCOD tab ('Agility: Reactive in nature - Incognitive Competence' vs 'COD: Proactive in nature - Cognitive Competence'; it also lists empty headings 'HOPS IN PLACE', 'KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'RUNNING ROUTES', 'ROUTE TREE' with no drills or doses); the COD list is pre-planned only: 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'Shuffles' (EASY TURN), 'DIG/OUT', 'LEFT TEST' (MOD. TURN), 'COMEBACK/CURL' + date cell L92 = 5-10-5 (HARD TURN)", "needed_by": "basketball, soccer, football, tennis, combat"},
    {"gap": "No observed COD in any MASTER_MODEL program", "evidence": "OBSERVED AP_COD = 0 in athletic, boxing, baseball", "needed_by": "decide whether sport practice covers COD"},
    {"gap": "No equipment tags on the library", "evidence": "OBSERVED", "needed_by": "home / no-gym clients; youth; older adults"},
]
REFS = [
    ("S1", "Basketball time-motion (jumps per game by position; ~1,050 activities, 5.3% of live time sprinting): Ben Abdelkrim et al. 2007 BJSM and related", "https://bjsm.bmj.com/content/41/2/69"),
    ("S2", "Basketball jumps backcourt 41 +/- 6 vs frontcourt 79 +/- 5 per game (search result, video time-motion)", "https://ojs.ub.uni-konstanz.de/cpa/article/view/6622/5981"),
    ("S3", "Volleyball jump counts per match by position (hitters 19.7-80, middles 52.5-77.2, setter ~104.5)", "https://reference-global.com/article/10.1515/tperj-2017-0032"),
    ("S4", "NSCA plyometric volume guide 80-100 / 100-120 / 120-140 contacts per session (Potach & Chu 2008), up to ~200 for trained adults (Chu & Myer 2013)", "https://ojs.ub.uni-konstanz.de/cpa/article/view/6015/5496"),
    ("S5", "Soccer: 726 +/- 203 turns per EPL match, 609 of 0-90 degrees (Bloomfield et al. 2007)", "https://jssm.org/06-1-63.p_d_f"),
    ("S6", "Tennis: ~1.6 changes of direction per point, every ~2.7-3.1 s", "https://jssm.org/tablejssm-16-489.xml/table004.xml"),
    ("S7", "MMA: high:low intensity 1:2-1:4; grappling ~1:1, striking up to 1:7", "https://pmc.ncbi.nlm.nih.gov/articles/PMC8439691"),
    ("S8", "Amateur boxing: predominantly aerobic; activity:rest elite 18:1; post-bout lactate ~11.8 mmol/L", "https://lida.sport-iat.de/ta/Record/4042892?lng=en"),
    ("S9", "Karate kumite / taekwondo effort-pause (karate HIA 1.5 s, 10 s effort : 16 s rest; TKD 8 s : 8 s)", "https://pmc.ncbi.nlm.nih.gov/articles/PMC4009084"),
    ("S10", "Elite kickboxing time-motion: HIA 2.2 s, LIA 2.3 s, pauses 5.4 s; fighting:non-fighting 1:1 (Ouergui)", "https://paulogentil.com/pdf/Time-Motion%20Analysis%20of%20Elite%20Male%20Kickboxing%20Competition.pdf"),
    ("S11", "Ice hockey shifts 30-80 s with 4-5 min recovery; skating = hip extension, abduction, external rotation", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6224850"),
    ("S12", "Hockey groin: pre-season adduction strength 18% lower in later-injured players", "https://mikereinold.com/groin-injuries-in-hockey-players/"),
    ("S13", "American football: plays ~5.3-5.7 s, ~33 s between plays, exercise:rest ~1:5.9", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11701232/"),
    ("S14", "Nordic hamstring exercise programmes reduce hamstring injuries by up to 51% (van Dyk et al. 2019)", "https://bjsm.bmj.com/content/53/21/1362"),
    ("S15", "Copenhagen adduction programme: 41% fewer groin problems (Harøy et al. 2019)", "https://bjsm.bmj.com/content/53/3/150.abstract"),
    ("S16", "Strength + plyometric training 2-3x/week for 8-12 weeks improves running economy (meta-analysis)", "https://www.ncbi.nlm.nih.gov/pmc/articles/PMC11052887/"),
    ("S17", "Youth plyometrics: 2 sessions/week for low training age, 3-4 when competent (Lloyd & Oliver)", "https://pure.cardiffmet.ac.uk/en/publications/plyometric-training-for-young-athletes/"),
    ("S18", "Wrestling neck injury and cervical strength", "https://scholars.georgiasouthern.edu/en/publications/the-effectiveness-of-cervical-strengthening-in-decreasing-neck-in/"),
    ("S19", "BJJ physical demands (grip, isometric back strength) - NSCA Coach", "https://www.nsca.com/contentassets/246f9b22016841e68ad57b43efe15f32/coach-10.2.6-developing-strength-power-and-endurance-in-the-brazilian-jiu-jitsu-athlete.pdf"),
    ("S20", "Neuromuscular training cuts ACL injury risk ~50% in female athletes", "https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf"),
    ("S21", "Jumper's knee prevalence: volleyball 44.6%, basketball 31.9% (Lian et al. 2005)", "https://pubmed.ncbi.nlm.nih.gov/15722279/"),
    ("S22", "NSCA older adults: 2-3 days/week, 2-3 sets per major muscle group, power at 40-60% 1RM (Fragala et al. 2019)", "https://www.unm.edu/~lkravitz/Article%20folder/NSCApositionstand.html"),
    ("S23", "Golf: rotational power and lower-body RFD vs clubhead speed", "https://bmcsportsscimedrehabil.biomedcentral.com/track/pdf/10.1186/s13102-017-0086-9"),
    ("S24", "Golf low back injury and lead-hip load", "https://pmc.ncbi.nlm.nih.gov/articles/PMC12358233"),
    ("S25", "Baseball pitchers: up to 60% of shoulder and 40% of elbow injuries (college/pro); posterior cuff weakness and ROM deficits", "https://pmc.ncbi.nlm.nih.gov/articles/PMC11545345"),
    ("S26", "CrossFit injury locations: shoulder 6.7-40.6%, low back 12.9-36%", "https://www.germanjournalsportsmedicine.com/archive/archive-2021/issue-7/musculoskeletal-injuries-in-crossfitr-a-systematic-review-and-meta-analysis-of-injury-rates-and-locations/"),
    ("S27", "Tennis injuries: elbow 21.4%, shoulder 19.4%, lumbar 17.3%", "https://pmc.ncbi.nlm.nih.gov/articles/PMC10594564/"),
    ("S28", "Volleyball shoulder injuries mostly overuse from spiking", "https://lida.sport-iat.de/ta/Record/4005400"),
    ("S29", "Softball windmill pitching shoulder/elbow loads comparable to baseball; biceps eccentric load", "https://pmc.ncbi.nlm.nih.gov/articles/PMC6704423"),
    ("S30", "Hamstring injury mechanism in sprinting (late swing / early stance)", "https://bmcmusculoskeletdisord.biomedcentral.com/track/pdf/10.1186/s12891-017-1716-9"),
    ("S31", "Schoenfeld et al. 2017 dose-response: 10+ weekly sets per muscle > 5-9 > <5", "https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf"),
]

json.dump({"_profiles_cache": PROFILES, "_obs": OBS}, open(os.path.join(HERE, "built_cache.json"), "w"), indent=1, ensure_ascii=False)
print("profiles", len(PROFILES), "observed rows", len(OBS))
for p in PROFILES:
    dd = p["derived"]
    print(f"{p['id']:24s} tot {dd['weekly_sets_total']:6.1f} ATH {dd['share_pct']['athletic']:5.1f}% (exThr {dd['share_pct']['athletic_excl_throws_of_non_throw_sets']:5.1f}) RP {dd['share_pct']['resistance_compound']:5.1f} ISO {dd['share_pct']['resistance_isolation']:5.1f} CORE {dd['share_pct']['core']:5.1f} | uni {dd['unilateral_pct_of_lower_compound']} | pull/push {dd['pull_per_push']} | nominal {dd['nominal_weekly_dose_from_sets']} | tiers {dd['tier_check_from_sets']} | /day {dd['avg_sets_per_main_day_if_all_on_main_days']}")
