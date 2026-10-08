import json, os, collections
BASE = "/Users/blazecamp/Library/Application Support/Claude/scratch-workspaces/83ae7031-57e0-42ef-bdf5-367a4e003c8c/ad065e19-f0c9-4863-bdf7-041381884595/scratch-2026-10-07-304072/blaze-camp-model/analysis/programs"
d = json.load(open(os.path.join(BASE, "prog_mm_baseball.volume.json")))
train = {w["grid"] for w in d["weeks"] if w["grid"] not in ("B1W8", "B2W8")}
nweeks = collections.Counter(w["block"] for w in d["weeks"] if w["grid"] in train)
agg = collections.defaultdict(collections.Counter)
def classify(name):
    n = name.lower()
    lat = any(w in n for w in ["lateral", "side to side", "skater"])
    hor = (not lat) and any(w in n for w in ["broad", "bound", "forward", "hurdle", "march jump"])
    uni = any(w in n for w in ["single leg", "sl ", "split", "staggered", "lunge", "rfe", "ffe", "skater", "march", "bound"]) or n.startswith("sl")
    land = any(w in n for w in ["drop", "stick", "snap down"]) and "to jump" not in n and "box jump" not in n
    return ("lateral" if lat else "horizontal" if hor else "vertical"), ("uni" if uni else "bi"), ("landing" if land else "jump")
for e in d["entries"]:
    if e["grid"] not in train: continue
    b = "B%d" % e["block"]; c = e.get("contacts") or 0; n = (e["exercise_clean"] or "").lower()
    if e["bucket"] in ("AP_PLYO", "AP_JUMP_LIMITED_KNEE"):
        if "push" in n: agg[b]["upper_plyo"] += c; continue
        dr, lt, ld = classify(n)
        amp = "low" if e["bucket"] == "AP_JUMP_LIMITED_KNEE" or "ankle" in n or "squirrel" in n else "high"
        agg[b][amp] += c; agg[b][dr] += c; agg[b][lt] += c; agg[b][ld] += c
    if e["bucket"] == "AP_THROW":
        plane = "transverse" if any(w in n for w in ["rotation", "rotational", "scoop", "side slam", "in-out", "rotationss", "lateral", "skater"]) else "sagittal"
        agg[b]["throw_" + plane] += c
    if e["bucket"] in ("CT_CORE_THORAX", "CP_CORE_PELVIS", "CORE_OTHER"):
        agg[b]["core_" + (e.get("core_plane") or "unspec")] += e.get("sets_assumed") or 0
    if e["bucket"] == "AP_SPRINT": agg[b]["sprint_sets"] += e.get("sets_assumed") or 0
    if e["bucket"] == "COND_SPRINT_BUYOUT": agg[b]["buyout_bouts"] += e.get("sets_assumed") or 0
for b in sorted(agg):
    w = nweeks[int(b[1])]
    print(b, "weeks", w, {k: round(v / w, 1) for k, v in sorted(agg[b].items())})
tot = collections.Counter()
for b in agg: tot.update(agg[b])
print("ALL", {k: v for k, v in sorted(tot.items())})
hi, lo = tot["high"], tot["low"]
print("pct vertical/horizontal/lateral", [round(100*tot[k]/(hi+lo),1) for k in ("vertical","horizontal","lateral")], "uni%", round(100*tot["uni"]/(hi+lo),1), "landing%", round(100*tot["landing"]/(hi+lo),1), "low%", round(100*lo/(hi+lo),1))
print("throw transverse %", round(100*tot["throw_transverse"]/(tot["throw_transverse"]+tot["throw_sagittal"]),1))
cs = {k: v for k, v in tot.items() if k.startswith("core_")}; s = sum(cs.values())
print("core plane %", {k: round(100*v/s,1) for k, v in cs.items()})
