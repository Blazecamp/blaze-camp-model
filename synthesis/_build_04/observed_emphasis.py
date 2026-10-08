"""Compute OBSERVED emphasis vectors for every coach program from the decode volume JSONs.
Read-only on analysis/; writes a JSON to the scratchpad."""
import json, os, re, statistics, collections

BASE = "/Users/blazecamp/Library/Application Support/Claude/scratch-workspaces/83ae7031-57e0-42ef-bdf5-367a4e003c8c/ad065e19-f0c9-4863-bdf7-041381884595/scratch-2026-10-07-304072/blaze-camp-model/analysis/programs"
OUT = os.path.join(os.path.dirname(__file__), "observed_emphasis.json")

def load(f):
    return json.load(open(os.path.join(BASE, f)))

AP = ["AP_PLYO", "AP_JUMP_LIMITED_KNEE", "AP_THROW", "AP_COD", "AP_SPRINT", "AP_TRIPLE_EXT"]
RP = ["RP_BKD", "RP_BHD", "RP_UKD", "RP_UHD", "RP_HPUSH", "RP_VPUSH", "RP_HPULL", "RP_VPULL"]
ISO = ["ISO_QUAD", "ISO_HAM", "ISO_CHEST", "ISO_SIDE_REAR_DELT", "ISO_BICEP", "ISO_TRICEP", "ISO_CALF"]
CORE = ["CT_CORE_THORAX", "CP_CORE_PELVIS", "CORE_OTHER", "CT_CORE_THORAX_or_CP_CORE_PELVIS"]

def mean_dicts(ds):
    keys = set().union(*[set(d) for d in ds])
    return {k: round(sum(d.get(k, 0) or 0 for d in ds) / len(ds), 2) for k in keys}

def vec(name, b, meta):
    g = lambda k: float(b.get(k, 0) or 0)
    ath = {k: g(k) for k in AP}
    ath_total = sum(ath.values())
    rp_total = sum(g(k) for k in RP)
    iso_total = sum(g(k) for k in ISO)
    core_total = sum(g(k) for k in CORE)
    focus = g("FOCUS")
    func = g("FUNCTIONAL")
    res_total = rp_total + iso_total
    denom = ath_total + res_total + core_total + focus + func
    lower_bi = g("RP_BKD") + g("RP_BHD")
    lower_uni = g("RP_UKD") + g("RP_UHD")
    knee = g("RP_BKD") + g("RP_UKD") + g("ISO_QUAD")
    hip = g("RP_BHD") + g("RP_UHD") + g("ISO_HAM")
    push = g("RP_HPUSH") + g("RP_VPUSH")
    pull = g("RP_HPULL") + g("RP_VPULL")
    upper = push + pull
    lower = lower_bi + lower_uni
    pct = lambda x: round(100 * x / denom, 1) if denom else 0.0
    return {
        "program": name, **meta,
        "weekly_sets": round(denom, 1),
        "athletic_sets": round(ath_total, 1), "athletic_by_type": {k: round(v, 1) for k, v in ath.items()},
        "resistance_sets": round(res_total, 1), "compound_RP_sets": round(rp_total, 1), "isolation_ISO_sets": round(iso_total, 1),
        "core_sets": round(core_total, 1), "focus_sets": round(focus, 1), "functional_sets": round(func, 1),
        "share_pct": {"athletic": pct(ath_total), "resistance_compound": pct(rp_total), "resistance_isolation": pct(iso_total),
                       "core": pct(core_total), "focus": pct(focus), "functional": pct(func)},
        "athletic_mix_pct_of_athletic": {k: (round(100 * v / ath_total, 1) if ath_total else 0) for k, v in ath.items()},
        "lower_bilateral_vs_unilateral": [round(lower_bi, 1), round(lower_uni, 1),
                                          round(100 * lower_uni / lower, 1) if lower else None],
        "knee_vs_hip_sets": [round(knee, 1), round(hip, 1)],
        "upper_vs_lower_compound": [round(upper, 1), round(lower, 1)],
        "push_vs_pull": [round(push, 1), round(pull, 1)],
        "compound_to_isolation_ratio": round(rp_total / iso_total, 2) if iso_total else None,
    }

rows = []
# ---- BYOP athletic
d = load("prog_byop_athletic.volume.json")
for p in d["programs"]:
    b = p["weekly_sets_by_bucket"]
    rows.append(vec("BYOP " + p["tab"] + " @2 sets all 6 days", b["assumed_2sets_all6"],
                    {"source": "BYOP " + p["tab"], "basis": "coach 2 sets/slot (JUSTICE LEAGUE fills), 4 main + 2 optional days",
                     "population": "athlete (generic field/court)", "evidence": "OBSERVED slots, ASSUMED sets"}))
    if "assumed_3sets_all6" in b:
        rows.append(vec("BYOP " + p["tab"] + " @3 sets all 6 days", b["assumed_3sets_all6"],
                        {"source": "BYOP " + p["tab"], "basis": "3 sets/slot", "population": "athlete", "evidence": "OBSERVED slots, ASSUMED sets"}))
# ---- BYOP aesthetics
d = load("prog_byop_aesthetics.volume.json")
for p in d["programs"]:
    b = p["weekly_sets_by_bucket"]
    key = None
    for cand in ["assumed_convention_plus_optional", "assumed_flat3_plus_optional_as_designed"]:
        if cand in next(iter(b.values())):
            key = cand; break
    flat = {k: v.get(key, 0) for k, v in b.items() if isinstance(v, dict)}
    rows.append(vec("BYOP " + p["tab"] + " (" + key + ")", flat,
                    {"source": "BYOP " + p["tab"], "basis": key, "population": "aesthetics / physique", "evidence": "OBSERVED slots, ASSUMED sets"}))
# ---- BYOP ppl/bootcamp (@3, all days)
d = load("prog_byop_ppl_bootcamp.volume.json")
pops = {"PUSHPULLLEGS - 3 or 6 DAYS A WK": "bodybuilding split", "BOOTCAMP - OPTION 1": "bootcamp / general fitness", "BOOTCAMP - OPTION 2": "bootcamp / fat-loss conditioning"}
for p in d["programs"]:
    rows.append(vec("BYOP " + p["tab"] + " @3 sets", p["weekly_sets_by_bucket"],
                    {"source": "BYOP " + p["tab"], "basis": p.get("sets_basis", "3 sets/slot"), "population": pops[p["tab"]], "evidence": "OBSERVED slots, ASSUMED sets"}))
# ---- MM gym
d = load("prog_mm_gym.volume.json")
for p in d["programs"]:
    tab = p["tab"]; lvl = p.get("level"); wk = p.get("week", "")
    if "PUSHPULLLEGS" in tab:
        b = p["weekly_sets_by_bucket_6day"]; basis = "6-day (each session twice)"
    elif "FAT" in tab:
        b = p["weekly_sets_by_bucket_incl_circuits"]; basis = "lifting + circuits"
    else:
        b = p["weekly_sets_by_bucket"]; basis = "4-day A/B/A/B"
    rows.append(vec("MM " + tab + " " + str(lvl) + " " + str(wk), b,
                    {"source": "MASTER_MODEL " + tab, "basis": basis, "population": ("fat loss / toning" if "FAT" in tab else "general gym hypertrophy"),
                     "evidence": "OBSERVED (sets written)"}))
# ---- MM athletic / boxing
d = load("prog_mm_athletic_boxing.volume.json")
for p in d["programs"]:
    if "weekly_sets_by_bucket_by_week" in p:
        for wk, b in p["weekly_sets_by_bucket_by_week"].items():
            rows.append(vec("MM " + p["program_id"] + " " + wk, b,
                            {"source": "MASTER_MODEL " + p["tab"], "basis": "as written", "population": "boxer / fighter", "evidence": "OBSERVED"}))
    else:
        rows.append(vec("MM " + p["program_id"], p["weekly_sets_by_bucket"],
                        {"source": "MASTER_MODEL " + p["tab"], "basis": "assumed where non-numeric", "population": "athlete off-season (generic)", "evidence": "OBSERVED"}))
# ---- MM baseball (block means of training weeks)
d = load("prog_mm_baseball.volume.json")
blocks = collections.defaultdict(list)
for w in d["weeks"]:
    lab = w["week_label"].lower()
    if w["grid"] in ("B1W8", "B2W8"):
        blocks["deload/recovery " + w["grid"]].append(w["weekly_sets_by_bucket_assumed"]); continue
    blocks["B%d" % w["block"]].append(w["weekly_sets_by_bucket_assumed"])
seas = {"B1": "off-season (build)", "B2": "pre-season (intensify)", "B3": "in-season (maintain)"}
for k, lst in blocks.items():
    rows.append(vec("MM BASEBALL " + k + " mean", mean_dicts(lst),
                    {"source": "MASTER_MODEL BASEBALL", "basis": "assumed sets (blank = row-1 sets of the Part)", "population": "baseball " + seas.get(k, k), "evidence": "OBSERVED"}))
# ---- MM crossfit/tracks
d = load("prog_mm_crossfit_tracks.volume.json")
for p in d["programs"]:
    pid = p["program_id"]; b = p["weekly_sets_by_bucket"]
    if pid == "MM_CF_COMPETE_FULLTIME":
        for m in ["JUNE", "JULY", "AUG", "SEPT", "NOV", "DEC"]:
            rows.append(vec("MM CF COMPETE " + m, b[m]["assumed_res3"], {"source": "MASTER_MODEL EXAMPLE CROSSFIT SPLIT", "basis": "FULL TIME table, 3-ex resistance illustrative", "population": "CrossFit competitor", "evidence": "OBSERVED levels, ASSUMED resistance exercises"}))
        continue
    weeks = []
    for wk, v in b.items():
        if isinstance(v, dict) and ("assumed" in v or "incl_superset_partners" in v or "as_written" in v):
            v = v.get("assumed") or v.get("incl_superset_partners") or v.get("as_written")
        weeks.append((wk, v))
    # loading weeks: drop wk8 of 8-wk, wk7 of 12-wk
    n = len(weeks)
    keep = [v for i, (wk, v) in enumerate(weeks, 1) if not ((n == 8 and i == 8) or (n == 12 and i == 7))]
    pop = {"MM_CF_CLASS_HALFTIME_8WK": "CrossFit class member", "MM_STRENGTH_CONJUGATE_8WK_v04": "strength / powerlifting (conjugate)",
           "MM_CONJUGATE_8WK_v12": "strength / powerlifting (conjugate draft)", "MM_STRENGTH_CONJUGATE_12WK": "strength (percent + RPE)",
           "MM_AESTHETICS_8WK": "aesthetics (upper/lower)", "MM_AESTHETICS_12WK_PPL": "aesthetics (PPL 6-day)", "MM_HYBRID_8WK": "hybrid strength-athletic-crossfitish"}[pid]
    rows.append(vec("MM " + pid + " mean loading weeks", mean_dicts(keep),
                    {"source": "MASTER_MODEL " + p["tab"], "basis": "mean of loading weeks (deload/test week excluded)", "population": pop, "evidence": "OBSERVED (assumed where blank)"}))

# ---- plyo direction / laterality classification for baseball (exercise-level)
def classify(name):
    n = name.lower()
    lat = any(w in n for w in ["lateral", "side to side", "skater", "cossack", "cosak"])
    hor = any(w in n for w in ["broad", "bound", "forward", "hurdle", "sprint", "acceleration", "a march", "a skip", "a run", "march jump", "fast run"]) and not lat
    direction = "lateral" if lat else ("horizontal" if hor else "vertical")
    uni = any(w in n for w in ["single leg", "sl ", "sl-", "split", "staggered", "lunge", "rfe", "ffe", "skater", "march", "bound", "sprint", "acceleration", "a march", "a skip", "a run", "fast run"]) or n.startswith("sl")
    land = any(w in n for w in ["drop", "stick", "snap down"]) and "to jump" not in n and "box jump" not in n
    return direction, ("unilateral" if uni else "bilateral"), ("landing" if land else "jump/rebound")

d = load("prog_mm_baseball.volume.json")
mix = collections.defaultdict(lambda: collections.Counter())
for e in d["entries"]:
    if e["bucket"] in ("AP_PLYO", "AP_JUMP_LIMITED_KNEE"):
        name = e["exercise_clean"]
        if any(w in name.lower() for w in ["push", "pushup"]):
            mix["upper"]["contacts"] += e.get("contacts") or 0; continue
        dr, lt, ld = classify(name)
        c = e.get("contacts") or 0
        blk = "B%d" % e["block"]
        mix[blk]["dir_" + dr] += c; mix[blk]["lat_" + lt] += c; mix[blk]["type_" + ld] += c
        mix[blk]["bucket_" + e["bucket"]] += c
        mix["ALL"]["dir_" + dr] += c; mix["ALL"]["lat_" + lt] += c; mix["ALL"]["type_" + ld] += c; mix["ALL"]["bucket_" + e["bucket"]] += c
# throws by plane
thr = collections.Counter()
for e in d["entries"]:
    if e["bucket"] == "AP_THROW":
        n = e["exercise_clean"].lower(); c = e.get("contacts") or 0
        plane = "transverse" if any(w in n for w in ["rotation", "rotational", "scoop", "side slam", "in-out", "rotationss", "lateral"]) else "sagittal"
        thr[plane] += c
# core planes baseball
core = collections.Counter()
for e in d["entries"]:
    if e["bucket"] in ("CT_CORE_THORAX", "CP_CORE_PELVIS", "CORE_OTHER"):
        core[e.get("core_plane") or "unspecified"] += e.get("sets_assumed") or 0

json.dump({"rows": rows, "baseball_plyo_mix_contacts": {k: dict(v) for k, v in mix.items()},
           "baseball_throw_plane_reps": dict(thr), "baseball_core_plane_sets": dict(core)}, open(OUT, "w"), indent=1)

# pretty print summary
for r in rows:
    s = r["share_pct"]
    print(f"{r['program'][:62]:62s} | tot {r['weekly_sets']:6.1f} | ATH {s['athletic']:5.1f}% RPc {s['resistance_compound']:5.1f}% ISO {s['resistance_isolation']:5.1f}% CORE {s['core']:5.1f}% FOC {s['focus']:4.1f}% | uni% {r['lower_bilateral_vs_unilateral'][2]} | push/pull {r['push_vs_pull']} | athmix {{{', '.join(k.replace('AP_','')+':'+str(v) for k,v in r['athletic_mix_pct_of_athletic'].items() if v)}}}")
print(json.dumps({k: dict(v) for k, v in mix.items()}, indent=1))
print(dict(thr)); print(dict(core))
