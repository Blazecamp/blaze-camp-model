# -*- coding: utf-8 -*-
import json, os, copy, sys
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
import profiles_v1 as D  # v1 overlay (coach answers) on top of profiles_data (v0)

ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
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
    if p["tab"] == "JUSTICE LEAGUE": obs_buckets["weekend_warrior"] = mapb(p["weekly_sets_by_bucket"]["assumed_2sets_all6"])
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

def tier_of(scale, x):
    for t in ("T0", "T1", "T2", "T3", "T4", "T5"):
        lo, hi = scale[t]
        if lo <= x <= hi: return t
    return "T5+" if x > scale["T5"][1] else "T0"

PROFILES = copy.deepcopy(D.P)
POWER = json.load(open(os.path.join(HERE, "v1_power_mix.json")))  # v1 ground-contact re-count (v1_power_mix.py)


def obs_power(key):
    m = POWER[key]
    g = lambda k: (m.get(k) or {}).get("sets", 0)
    return {"PLYO": round(g("PLYO_high") + g("PLYO_upper") + g("RECEIVE"), 1), "JLK": round(g("PLYO_low"), 1),
            "BALL": round(g("BALLISTIC_jump"), 1), "THROW": round(g("BALLISTIC_throw"), 1)}


OBS_POWER_KEY = {"baseball_position": "baseball_B1", "boxing": "boxing_wk3_6_mean"}
OBS_PLYOMETRIC = {"baseball_position": ("37 (B1) / 58 (B2) / 74 (B3) fast-reactive + 17 / 13 / 20 landings; ballistic jumps 51 / 87 / 49", 37),
                  "boxing": ("31 fast-reactive (tuck jumps, drop into box jumps) + 24 landings + 66 ballistic-jump reps; 1,227 low-amplitude incl. rope", 31)}

for p in PROFILES:
    prm = D.V1P[p["id"]]
    if p["id"] in obs_buckets:
        p["weekly_sets"] = {k: round(v, 1) for k, v in obs_buckets[p["id"]].items()}
        p["weekly_sets_observed"] = dict(p["weekly_sets"])
        base = "OBSERVED (computed from the program decode volume JSON)" + ("; COD +2 and SPRINT +2 INFERRED for position players" if p["id"] == "baseball_position" else "")
    else:
        base = "INFERRED set budget (analyst), sized to the coach's observed session budget"
    op = obs_power(OBS_POWER_KEY[p["id"]]) if p["id"] in OBS_POWER_KEY else None
    ws1, adj = D.v1_weekly_sets(p, prm, op)
    p["weekly_sets_v0"] = p.get("weekly_sets_observed") or dict(p["weekly_sets"])
    p["weekly_sets"] = ws1
    p["v1_adjustments"] = adj
    p["weekly_sets_source"] = base + ("; v1 generator baseline = this + COACH-ANSWER / PROPOSED adjustments (see v1_adjustments)" if adj else "")
    if p["id"] == "boxing":
        p["base_phase_weekly_sets"] = {k: round(v, 1) for k, v in obs_buckets["boxing_base"].items()}
    if p["id"] == "crossfit_competitor":
        p["power_month_weekly_sets"] = {k: round(v, 1) for k, v in obs_buckets["crossfit_power_month"].items()}
    # ---- v1 attributes
    gct = prm.get("gct")
    p["ground_contact"] = ({"class": gct, **D.GCT_CLASSES[gct], "evidence": "class INFERRED from the sport's decisive actions; the rule that contact time sets the plyo : ballistic split is COACH-ANSWER ATH-01"} if gct else
                           {"class": None, "label": "not applicable (no athletic power block)", "evidence": "COACH-ANSWER ATH-05 / UNI-02 (size, strength or health goal)"})
    if prm.get("gct_hidden"):
        p["ground_contact"] = {"class": None, "label": "not a sport profile: plyos only if the client asks (COACH-ANSWER ATH-09); power work = light medball throws (ballistic) + low ankle hops", "evidence": "COACH-ANSWER ATH-09; budget computed with the class-5 split (25% plyo floor)"}
    p["ath03_group"] = prm.get("ath03")
    p["plyo_rank_ath02"] = prm.get("rank")
    athletic = p["id"] in D.ATHLETIC and p["id"] != "weekend_warrior"
    p["bilateral_unilateral"] = ({"block_start": [prm["bu"][0], 100 - prm["bu"][0]], "block_end": [prm["bu"][1], 100 - prm["bu"][1]],
                                  "in_season": ([prm["bu"][2], 100 - prm["bu"][2]] if (athletic or p["id"] == "crossfit_competitor") else None),
                                  "baseline_mid_block": [round((prm["bu"][0] + prm["bu"][1]) / 2), 100 - round((prm["bu"][0] + prm["bu"][1]) / 2)],
                                  "upper_body": "same logic for pressing / pulling (UNI-03)",
                                  "evidence": ("COACH-ANSWER UNI-02" if p["id"] in ("bodybuilding_aesthetics", "powerlifting_strength", "tennis", "basketball", "soccer", "football_skill") else "PROPOSED on the COACH-ANSWER UNI-02 scale") + ("; in-season minimal bilateral = COACH-ANSWER UNI-10" if athletic else ("; competition-month value PROPOSED" if p["id"] == "crossfit_competitor" else "; no season")) + "; pain adjusts (UNI-02 / VOL-03)"}
                                 if prm.get("bu") else {"evidence": "OBSERVED split kept (no coach rule for this product)"})
    p["resistance"]["unilateral_pct"] = 100 - p["bilateral_unilateral"]["baseline_mid_block"][0] if prm.get("bu") else p["resistance"]["unilateral_pct"]
    p["contra_ipsi"] = prm.get("contra", "-")
    p["frontal_transverse_unilateral_pct"] = prm.get("ft")
    p["in_season_content"] = prm.get("insea", "-")
    aer = prm.get("aer") or {}
    for k in ("A", "B", "C", "LC"):
        if k in aer:
            p["conditioning"][k] = aer[k]
    sess = sum(v for k, v in aer.items() if k in ("A", "B", "C", "LC"))
    p["aerobic_sessions_wk"] = {"off_season_or_default": sess or aer.get("note", "-"), "in_season": aer.get("in", "-"), "walks_after_workouts": bool(aer.get("walks")), "note": aer.get("note", "")}
    if prm.get("throws"):
        p["throwing"]["tier"], p["throwing"]["throws_wk"] = prm["throws"][0], prm["throws"][1]
    if prm.get("low_wk"):
        p["plyo"]["low_contacts_wk"] = prm["low_wk"]
    if p["id"] in D.ATHLETIC:
        te = p["weekly_sets"].get("TE", 0)
        if p["id"] not in OBS_POWER_KEY:  # boxing keeps its observed 9-12; baseball gets the ATH-10 standard dose below
            p["triple_ext"]["sets_wk"] = [max(te - 2, 1), te + 2]
            p["triple_ext"]["tier"] = tier_of(D.SCALES["triple_ext_sets_wk"], te)
    if prm.get("plyo_wk") is not None:
        p["plyo"]["plyometric_target_wk"] = prm["plyo_wk"]
    if p["id"] in OBS_PLYOMETRIC:
        p["plyo"]["plyometric_observed"] = OBS_PLYOMETRIC[p["id"]][0]

def scale_tier(key, x):
    return tier_of(D.SCALES[key], x)


def derive(ws, days, landing_pct=0):
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
    power = sum(g(k) for k in D.POWER_CATS)
    plyometric = round(g("PLYO") * D.NOMINAL["PLYO"][0] * (1 - (landing_pct or 0) / 100.0))
    jumps = nom["PLYO"] + nom["BALL"]
    main = days.get("main", 4)
    return {
        "weekly_sets_total": round(tot, 1),
        "sets_by_family": {"athletic": round(A, 1), "athletic_excl_throws": round(A - ath["THROW"], 1), "resistance_compound": round(RP, 1), "resistance_isolation": round(ISO, 1), "core": round(CORE, 1), "focus": round(FOC, 1)},
        "share_pct": {"athletic": pct(A), "athletic_excl_throws_of_non_throw_sets": pct(A - ath["THROW"], tot - ath["THROW"]),
                      **{"ath_" + k: pct(v) for k, v in ath.items()}, "resistance_compound": pct(RP), "resistance_isolation": pct(ISO), "core": pct(CORE), "focus": pct(FOC)},
        "athletic_mix_pct": {k: (round(100 * v / A, 1) if A else 0) for k, v in ath.items()},
        "power_sets": round(power, 1),
        "plyo_share_of_power_sets_pct": round(100 * (g("PLYO") + g("JLK")) / power) if power else None,
        "lower_bilateral_unilateral_sets": [round(lb, 1), round(lu, 1)], "unilateral_pct_of_lower_compound": pct(lu, lb + lu) if lb + lu else None,
        "push_pull_sets": [round(push, 1), round(pull, 1)], "pull_per_push": round(pull / push, 2) if push else None,
        "knee_hip_sets": [round(g("BKD") + g("UKD") + g("ISO_QUAD"), 1), round(g("BHD") + g("UHD") + g("ISO_HAM"), 1)],
        "compound_to_isolation": round(RP / ISO, 2) if ISO else None,
        "resistance_sets_by_muscle": muscles,
        "nominal_weekly_dose_from_sets": {"plyometric_contacts": plyometric, "jump_contacts_all": jumps, "plyo_low_contacts": nom["JLK"], "ballistic_jump_reps": nom["BALL"], "throws": nom["THROW"], "cod_cuts": nom["COD"], "sprint_m": nom["SPRINT"], "triple_ext_reps": nom["TE"]},
        "tier_check_from_sets": {"plyometric": scale_tier("plyometric_contacts_wk", plyometric), "jump_contacts_all": scale_tier("plyo_high_contacts_wk", jumps), "plyo_low": scale_tier("plyo_low_contacts_wk", nom["JLK"]),
                                 "throws": scale_tier("throws_wk", nom["THROW"]), "cod": scale_tier("cod_cuts_wk", nom["COD"]), "triple_ext_sets": scale_tier("triple_ext_sets_wk", g("TE"))},
        "avg_sets_per_main_day_if_all_on_main_days": round(tot / main, 1),
        # PROPOSED heuristic for the UNI-09 / VOL-08 check: 10 min warm-up + ~1.25 min per athletic or core set, ~2.5 min per compound set, ~1.5 min per isolation / focus set
        "est_minutes_per_main_day": round(10 + (A * 1.25 + RP * 2.5 + ISO * 1.5 + CORE * 1.25 + FOC * 1.5) / main),
    }

for p in PROFILES:
    p["derived"] = derive(p["weekly_sets"], p["days"], p["plyo"].get("landing_pct"))
    for v in p.get("variants", []):
        if "weekly_sets_delta" in v:
            ws = dict(p["weekly_sets"])
            for k, dv in v["weekly_sets_delta"].items():
                ws[k] = max(0, round(ws.get(k, 0) + dv, 1))
            v["weekly_sets"] = ws
            v["derived"] = derive(ws, p["days"], p["plyo"].get("landing_pct"))
    d = p["derived"]; nd = d["nominal_weekly_dose_from_sets"]
    pl = p["plyo"]
    tgt = pl.get("plyometric_target_wk")
    if tgt is not None:
        pl["tier_plyometric"] = scale_tier("plyometric_contacts_wk", (tgt[0] + tgt[1]) / 2.0)
    else:
        pl["tier_plyometric"] = "n/a"
    if not p["weekly_sets_source"].startswith("OBSERVED") and p["id"] != "weekend_warrior":
        j = nd["jump_contacts_all"]
        pl["high_contacts_wk"] = [int(round(j * 0.85 / 5.0) * 5), int(round(j * 1.15 / 5.0) * 5)]
        pl["tier_high"] = scale_tier("plyo_high_contacts_wk", j)
    p["power_mix"] = {"plyo_pct_target": (D.GCT_PLYO_PCT[p["ground_contact"]["class"]] if p["ground_contact"]["class"] else None),
                      "plyo_pct_v1_budget": d["plyo_share_of_power_sets_pct"],
                      "observed": ({"baseball_position": "B1 44% / B2 36% / B3 44% plyo side (sets)", "boxing": "30% plyo side (sets; 92% of plyo-side REPS are low-amplitude squirrel jumps and rope)"}.get(p["id"])),
                      "block_shift": "start ballistic-biased (plyo share -15 points, floor 20) and end at the target (COACH-ANSWER CAT-10 direction; numbers PROPOSED)" if p["ground_contact"]["class"] else "-",
                      "evidence": "COACH-ANSWER ATH-01 (rule); class map PROPOSED"}
pw = {p["id"]: p for p in PROFILES}
pw["baseball_position"]["plyo"]["tier_high"] = "T3 (OBSERVED block means 103 / 151 / 135)"
pw["boxing"]["plyo"]["tier_high"] = "T3 (OBSERVED 113-129 = landings 24 + ballistic jumps 66 + fast-reactive 31)"
pw["weekend_warrior"]["plyo"]["tier_high"] = "T2 (template @2 sets, estimate)"
bp = pw["baseball_position"]["triple_ext"]
bp["tier"], bp["sets_wk"] = "T2 (ATH-10 standard; observed T1, T3 with the optional OLY piece)", [6, 16]
bp["ceiling"] = "L1: DB snatch from the floor, KB / DB high pulls (OBSERVED); L2+: hang clean / hang snatch @75 -> 80 -> 85 -> 90% (OBSERVED 'OPTIONAL PIECE', now standard off- and pre-season - COACH-ANSWER ATH-10 / PER-09); none observed in season"
# ATH-02 ranking check (computed, not asserted)
RANK_ORDER = ["basketball", "volleyball", "track_sprinter", "football_skill", "soccer", "mma", "tennis", "baseball_position", "hockey", "wrestling", "bjj_grappling", "boxing", "karate_taekwondo", "golf"]
RANK_CHECK = []
for pid in RANK_ORDER:
    p = pw[pid]; t = p["plyo"]["plyometric_target_wk"]
    RANK_CHECK.append({"profile": pid, "coach_rank": p["plyo_rank_ath02"], "plyometric_target_wk": t, "mid": (t[0] + t[1]) / 2.0,
                       "v1_budget_nominal": (f"{OBS_PLYOMETRIC[pid][1]} (observed budget)" if pid in OBS_PLYOMETRIC else p["derived"]["nominal_weekly_dose_from_sets"]["plyometric_contacts"]), "observed": OBS_PLYOMETRIC.get(pid, ("-",))[0]})
mids = [r["mid"] for r in RANK_CHECK]
RANK_MONOTONIC = all(mids[i] >= mids[i + 1] for i in range(len(mids) - 1))
assert RANK_MONOTONIC, mids

# ------------------------------------------------------------------ observed populations
EXTRA = {
 "BYOP AESTHETICS - FULL BODY - 4 DAYS (assumed_convention_plus_optional)": dict(label="BYOP AESTHETICS 4-day (+2 'Optional' days; Day 1 + part of Day 2 filled, rest extrapolated)", pop="aesthetics / physique", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="2 'Cardio' slots (client pick)", core="2 'Core' slots (client pick)"),
 "BYOP 3 DAY BUILDER (assumed_convention_plus_optional)": dict(label="BYOP 3 DAY BUILDER (+optional)", pop="aesthetics 3-day", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="3 'Cardio' slots", core="3 'Core' slots"),
 "BYOP PUSHPULLLEGS - 3 or 6 DAYS A WK @3 sets": dict(label="BYOP PPL 6-day @3 sets", pop="bodybuilding split", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="none", core="none"),
 "BYOP BOOTCAMP - OPTION 1 @3 sets": dict(label="BYOP BOOTCAMP 1 ('4 DAYS A WEEK' + Wed/Sat) @3", pop="bootcamp / general fitness", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="2 cardio slots", core="2"),
 "BYOP BOOTCAMP - OPTION 2 @3 sets": dict(label="BYOP BOOTCAMP 2 (6 sessions) @3", pop="bootcamp / conditioning", contacts="0", throws="0", cod="0", sprint="0", te="0", cond="6 cardio bouts (one per session)", core="2"),
 "BYOP ATHLETIC - FULL BODY - 4 DAYS A @2 sets all 6 days": dict(label="BYOP ATHLETIC 4-day @2 (coach dose)", pop="athletic template (weekend warrior / any athlete)", contacts="72-96 high (est.)", throws="64-96", cod="48-64 cuts", sprint="none", te="8 sets", cond="2 'Aerobic Capacity' (client colour)", core="2 slots (client pick)"),
 "BYOP JUSTICE LEAGUE @2 sets all 6 days": dict(label="BYOP WEEKEND-WARRIOR tab (sheet tab 'JUSTICE LEAGUE'; partial fill: Mon + 1 Tue slot; 2 sets extrapolated to all slots)", pop="weekend warrior / all-around athletic (partly filled example)", contacts="~60-80 high + ~12-16 low (est.: PLYO 10 / JLK 2 sets x '6 to 8 Reps')", throws="64-96", cod="48-64", sprint="none", te="8 ('Power Clean')", cond="2 slots", core="2 slots"),
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
    r = dict(r)
    if r["program"].startswith("MM EXAMPLE UPPERLOWER") or r["program"].startswith("MM EXAMPLE PUSHPULLLEGS"):
        # COACH-ANSWER ORD-08: A-drills are warm-up, not volume -> take the A-drill 'SPRINT' sets out of the totals
        a = r["mix"].get("SPRINT", 0); t0 = r["tot"]; t1 = t0 - a
        foc = r["focus"] * t0 / 100.0
        r.update({"tot": t1, "ath_incl": 0.0, "ath_excl": 0.0, "rp": round(100 * r["rp_sets"] / t1, 1), "iso": round(100 * r["iso_sets"] / t1, 1),
                  "core": round(100 * r["core_sets"] / t1, 1), "focus": round(100 * foc / t1, 1), "mix": {}})
        e = dict(e, contacts=e["contacts"] + " - warm-up only (ORD-08), excluded from the totals", sprint="A-drills = warm-up (ORD-08)")
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
    "athlete_ladder": {"evidence": "OBSERVED MM 'EXAMPLE ATHLETIC FULL BODY SPLI' STARTING -> MID -> ADVANCED; COACH-ANSWER PRG-04: these can be back-to-back off-season blocks OR athlete levels - 'depends on whatever is needed'",
                       "per_step": {"working_sets": "-19% then -18%", "jump_contacts_all": "-51% then -55%", "low_amplitude_contacts": "0 -> 120 -> 100", "throws": "+90% then +5% (STARTING 210 and ADVANCED 420 rest on reading 'ALL LIST' as the 19-throw MEDBALL CHEAT SHEET; only MID's 400 is fully written)", "plyo_share_of_power_sets": "33% -> 8% -> 9% (v1 re-count: the blocks get MORE ballistic, the opposite of the coach's within-program rule CAT-10 - they are throw-dominant)", "resistance_sets": "0% then -45%", "core_sets": "-30% then +86%", "main_lift_reps": "6-8 -> 6-8 -> 1 (deadlift 3x6 / 2x'6/8' / 'DEADLIFTS (1RIR)' 3x1)", "sets_per_line": "STARTING mostly 3 (range 1-5) -> MID mostly 2 (range 1-4) -> ADVANCED 1-3"},
                       "rule": "INFERRED from OBSERVED: a higher athlete level = less volume, more intensity, more single-leg / reactive work and more throws; not confirmed as a rule (PRG-04 'depends'); the volume engine (03 v1 / 12) decides sets per person"},
    "gym_ladder": {"evidence": "OBSERVED MM UPPER/LOWER and PPL NOVICE -> NEWBY -> INTERMEDIATE; COACH-ANSWER PRG-05 (L1 / L2 / L3 by training experience), PRG-06 (the upper-day rep rise was 'probably a fill error' - rep and set rises must follow one sound algorithm for every model)",
                   "per_step": {"weekly_resistance_sets": "+18-23% then +13-14% (OBSERVED)", "starting_sets_per_muscle": "beginner 10-12, intermediate 15-20, advanced 20+ (COACH-ANSWER VOL-01)", "compound_reps": "OBSERVED both directions (UL upper 3x8 -> 4x12 was a fill error per PRG-06); the generator uses one rep logic for all models", "isolation": "arms 20 / 'MAX REPS', leg ext/curl 20 and calves 'MAX REPS' (OBSERVED)"},
                   "rule": "for physique / general clients a higher level = MORE sets (OBSERVED, consistent with VOL-01)"},
    "library_level_per_slot": {"evidence": "OBSERVED weekend-warrior tab + AESTHETICS fills; COACH-ANSWER CAT-05 / CAT-06",
                               "rule": "level is chosen per slot (FOUNDATIONAL / MODERATE / ADVANCED blocks inside each dropdown), not once per athlete; levels add options and never remove them, and are 'still very theoretical' (CAT-05); client level and exercise level are separate (CAT-06); load position sets exercise level (front-loaded = foundational, on the body = intermediate, behind / overhead = advanced; machines and cables easier - CAT-04, Davidson zones are rotation biases and do not apply to plyos, CAT-10)"},
    "experience_levels": {"evidence": "COACH-ANSWER PRG-05 / GEN-02", "rule": "L1 novice = under about 6-12 months of training; L2 intermediate = consistent for over a year; L3 advanced; more than 6-12 months off -> body treated as L1 (skills come back fast); ex-pros start L1 only briefly"},
}
ASSEMBLY = [
    "1. Intake (COACH-ANSWER GEN-02): goal; competitive sport -> sport + position + season, recreational -> general sport only (weekend-warrior profile); training experience in YEARS (-> L1 / L2 / L3, PRG-05); age; body weight; days; session length; equipment; injuries / pain; priority muscles; rep-style preference; plan type. NO sex field (GEN-02, ATH-09).",
    "2. Pick the profile (+ position variant), season phase and competition level (high school / college / pro = same plan, different loads - PRG-09). A competitive sport without a profile uses the nearest profile by ground-contact class and ATH-03 group (PROPOSED).",
    "3. Weekly set budget per category = profile.weekly_sets (v1 off-season build baseline) x season multiplier x the volume engine's person-based weekly rate (3 / 5 / 7% of weekly sets chosen by fatigue, life and response, never 10%/week - VOL-04 / VOL-05 / UNI-05; see 03 v1 / 12_volume_algorithm_v1). Plan type shapes the curve (PER-01): 4-6-week maintenance at 50-70% volume, 8-week = 4 adapt + 4 drive, 12-week = 2-4 acclimation + 4-6 build + hardest last weeks.",
    "4. Power block: split power sets plyo : ballistic by the ground-contact class (ATH-01; map PROPOSED), start ballistic-biased and move to the target (CAT-10); plyo method stage 1 -> 2 -> 3 across the block; unilateral plyos after bilateral; medball volume by sport, none for aesthetics, ball <= 20 lb (ATH-05 / EQ-06); Olympic lifts for every athletic trainee at their level (ATH-10); contrast only L2+ off-season (ATH-12).",
    "5. Resistance block: bilateral : unilateral share from the profile (block start -> end, in-season value; UNI-02 / UNI-10), the same logic for upper-body pressing and pulling (UNI-03); contralateral for COD athletes, ipsilateral for acceleration, contra/ipsi as early-block health accessories for size/strength clients (CAT-13); frontal / transverse unilateral share for court and combat athletes (UNI-12); pain moves the share or the machine choice (VOL-03).",
    "6. Session order (COACH-ANSWER ATH-11, ORD-01..03, ORD-08): warm-up -> CORE FIRST (movable) -> plyo / ballistics -> Olympic / power -> main strength lift -> resistance accessories -> isolation (calves 3 sets every leg day, rear delts own sets - VOL-17); hip-dominant with push, knee-dominant with pull (UNI-11 / ORD-06); axial spinal loading once a week (PER-04); fighters open conditioning days with a real aerobic block (ORD-09).",
    "7. Session caps (COACH-ANSWER VOL-08 / VOL-16 / VOL-17 / UNI-09): resistance-only 5-7 exercises; field athletes off-season up to 10-12 (about 2 core + 2-4 plyo/ballistic + 2-3 Olympic/power + 3-4 resistance); about 1.5 h for athletes, bodybuilders and powerlifters (max 2 h), 45-60 min for general / weight-loss clients, 35-45 min bootcamps. Over budget -> supersets (ORD-05: also a fatigue tool) or fewer sets per slot, never drop the athletic prefix of an athlete profile.",
    "8. Fill each slot with a DEFAULT exercise plus a dropdown of same-category swaps (GEN-04), filtered by level, equipment (no bands / variable resistance - EQ-01 / EQ-12), age and injury rules (older / injured / high-volume -> constrained machines; never OHS, snatch, low-bar squat, depth jumps - EQ-03), and client preference (EQ-10). Hard rules (GEN-08) + coach-added rules.",
    "9. Dose reps by category and rep zone (VOL 1 / 2 / 3 per block for athletes - PER-11; STRENGTH; POWER; MYO last - VOL-15; RIR primary - VOL-13); athletic slots in contacts / throws / cuts / metres; deload = about half the sets (PER-05); tests chosen by checkbox at block start, or none (PER-07).",
    "10. Audit: muscle sets vs targets (helpers 0.25, athletic sets excluded - VOL-09 / VOL-10); plyometric contacts vs the ATH-02 ranking band; all jump contacts vs the NSCA per-session guide; throws vs the ATH-05 tier; aerobic sessions 3 / 2 / 4 (+ walks) by population (ATH-07); estimated minutes vs the session-length cap.",
]
GAPS = [
    {"gap": "No SPRINT slot in any BYOP template", "evidence": "OBSERVED: in BYOP only ' Max velocity running (top speed)' (PLYOS ADVANCED G128 and FULL JUMPING J11). MASTER_MODEL has Sheet23 '✅ MACH DRILLS' / '✅ Acceleration starts' (B48/B49), the cheat-sheet 'RUNNING WARMUP', UL/PPL A-drills, BASEBALL '30m acceleration sprint'. COACH-ANSWER LIB-21: add MACH drills, speed-session order fixed (squirrel jumps -> MACH / acceleration starts -> max velocity)", "needed_by": "soccer, football skill, track, basketball, baseball position players; every speed athlete in season (PER-08)"},
    {"gap": "No ground-contact / plyo-vs-ballistic tag on the athletic library items (NEW in v1)", "evidence": "COACH-ANSWER ATH-01 / CAT-10 make the split a programming variable; the library only has PLYOS / FULL JUMPING / JUMPING ANKLE / THROWING columns; v1 classifies by keyword (v1_power_mix.py, INFERRED)", "needed_by": "every athletic profile (the generator needs a PLYO / BALL / JLK / landing tag and a method stage per item)"},
    {"gap": "REPS menu cannot express contacts, throws per side, metres, seconds or 1-3 reps", "evidence": "OBSERVED AW8:AW14 '4 to 6 Reps' .. '20 Reps', 'MYO SET'", "needed_by": "every athletic profile"},
    {"gap": "No neck exercises", "evidence": "OBSERVED: none in the library or programs; not asked in the questionnaire", "needed_by": "wrestling, BJJ, MMA, football, Muay Thai, hockey"},
    {"gap": "CARRY and DRAGS headings have no exercises", "evidence": "OBSERVED BA/BB columns hold only sub-headings (CARRY: 'PROPULSIVE', 'STATIONARY', 'BILATERAL', 'UNILARTERAL'; DRAG: 'SAGITAL', 'FRONTAL'); carries are programmed in BASEBALL (E47, S65, W49) and CONTROL PATTERNS (B10). COACH-ANSWER LIB-19: build them out (athletes, general fitness; slings for advanced athletes and rehab; farmer handles, trap bar, KB, sandbag, sled)", "needed_by": "wrestling, BJJ, MMA, linemen, general population"},
    {"gap": "Rear-delt / external-rotation work has no own slot", "evidence": "OBSERVED: reverse flies share the 'ABdution' list; COACH-ANSWER VOL-17: rear delts need their own sets", "needed_by": "every profile (throwers and racket athletes first)"},
    {"gap": "Frontal / transverse lower-body moves missing from the main library", "evidence": "COACH-ANSWER LIB-20: add 'Hold between knees Squats', cossacks etc. from RESISTANCE PATTERNS for court and combat athletes (strap rotations excluded - LIB-09); UNI-12", "needed_by": "basketball, tennis, soccer, MMA, hockey, combat"},
    {"gap": "Reactive agility is defined but not programmed", "evidence": "OBSERVED AGILITYCOD tab ('Agility: Reactive in nature - Incognitive Competence' vs 'COD: Proactive in nature - Cognitive Competence'; empty headings 'HOPS IN PLACE', 'KRUMRIE FORMATION', 'MUNOZ FORMATION', 'EIGHT SQUARE PLYOMETRIC FORMATION', 'FOUR SQUARE FORMATION', 'RUNNING ROUTES', 'ROUTE TREE'); COD list pre-planned only: 'FADE', 'SLANT', 'POST/CORNER', 'FLAT', 'Shuffles' (EASY TURN), 'DIG/OUT', 'LEFT TEST' (MOD. TURN), 'COMEBACK/CURL' + date cell L92 = 5-10-5 (HARD TURN). ATH-06: the route names serve every athlete, tiered by turn angle", "needed_by": "basketball, soccer, football, tennis, combat"},
    {"gap": "No observed COD in any MASTER_MODEL program", "evidence": "OBSERVED AP_COD = 0 in athletic, boxing, baseball", "needed_by": "decide whether sport practice covers COD"},
    {"gap": "No equipment tags on the library", "evidence": "OBSERVED; equipment answers EQ-01..16 (no bands, constraint scale 1-5)", "needed_by": "home / no-gym clients; youth; older adults"},
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
    ("S20", "Neuromuscular training cuts non-contact ACL injury risk ~50% (trials in female athletes; the generator applies it by landing competency and injury history, never by sex - COACH-ANSWER ATH-09)", "https://www.aafp.org/pubs/afp/issues/2011/0115/p210.pdf"),
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
    ("S32", "Flanagan & Comyns 2008, Strength Cond J: ground-contact time and the reactive strength index to prescribe fast stretch-shortening-cycle (plyometric) training; fast SSC under ~250 ms vs slow SSC (Schmidtbleicher)", "https://pure.ul.ie/en/publications/the-use-of-contact-time-and-the-reactive-strength-index-to-optimi/"),
    ("S33", "Sprint acceleration kinematics: faster early accelerators show shorter ground-contact times; contacts ~0.14-0.16 s in acceleration (JSSM 2003 field-sport athletes; Swansea sprint data)", "https://www.jssm.org/jssm-02-144.xml%3EFulltext"),
    ("S31", "Schoenfeld et al. 2017 dose-response: 10+ weekly sets per muscle > 5-9 > <5", "https://researchgate.net/profile/Brad-Schoenfeld/publication/305455324_Dose-response_relationship_between_weekly_resistance_training_volume_and_increases_in_muscle_mass_A_systematic_review_and_meta-analysis/links/59dc0269458515e9ab4527d6/Dose-response-relationship-between-weekly-resistance-training-volume-and-increases-in-muscle-mass-A-systematic-review-and-meta-analysis.pdf"),
]

json.dump({"_profiles_cache": PROFILES, "_obs": OBS}, open(os.path.join(HERE, "built_cache.json"), "w"), indent=1, ensure_ascii=False)
print("profiles", len(PROFILES), "observed rows", len(OBS))
for p in PROFILES:
    dd = p["derived"]
    print(f"{p['id']:24s} tot {dd['weekly_sets_total']:6.1f} ATH {dd['share_pct']['athletic']:5.1f}% (exThr {dd['share_pct']['athletic_excl_throws_of_non_throw_sets']:5.1f}) RP {dd['share_pct']['resistance_compound']:5.1f} ISO {dd['share_pct']['resistance_isolation']:5.1f} CORE {dd['share_pct']['core']:5.1f} | uni {dd['unilateral_pct_of_lower_compound']} | pull/push {dd['pull_per_push']} | nominal {dd['nominal_weekly_dose_from_sets']} | tiers {dd['tier_check_from_sets']} | /day {dd['avg_sets_per_main_day_if_all_on_main_days']}")
