# -*- coding: utf-8 -*-
"""v1: re-read the coach's written athletic work and split it by GROUND-CONTACT class.

Coach rule (COACH-ANSWER ATH-01 / CAT-10): 'The longer they're on the ground, the less it is going to be plyo,
so it's more of a ballistic movement.'  Programs start more ballistic and become more plyometric.
Plyo method stages (CAT-10/11, unnamed by the coach, NOT a plyo zone): receive & pause -> receive then create ->
repeated receive/create.

Classes used here (the keyword rules are INFERRED; the sets/reps are OBSERVED from the decode JSONs):
  RECEIVE   = landing / stick drills (plyo method stage 1, 'receive and pause')
  PLYO      = short-contact reactive work (fast stretch-shortening: hops, pogos, squirrel jumps, bounds, hurdle hops,
              depth/drop jumps, repeated jumps, rope) - stage 2-3
  BALLISTIC = long-contact or single-effort power: medball throws/slams, loaded or concentric jumps (DB / hex-bar /
              squat jumps, box jumps, broad jumps, march jumps, step-up jumps)
Sprint and Olympic/triple-extension work are tracked separately and are not in the plyo:ballistic ratio.
Unit = working sets (the generator's unit); throws per set and contacts per set are reported too.
"""
import json, os, re
HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
PROG = os.path.join(ROOT, "analysis", "programs")

RESISTANCE_WORDS = ("front squat", "back squat", "deadlift", "squats", "kb swings")


def classify(name, bucket):
    n = (name or "").lower().strip()
    if not (bucket or "").startswith("AP_"):
        return None  # resistance / core / isolation components of complexes are not power work
    if bucket == "AP_THROW":
        return "BALLISTIC"
    if bucket in ("AP_SPRINT", "AP_TRIPLE_EXT", "AP_COD"):
        return None
    if "pushup" in n or "push up" in n or "push ups" in n or "pushups" in n:
        if "stick" in n:
            return "RECEIVE"
        return "PLYO"  # repeated plyo push-ups = upper-body reactive
    if "snap down" in n:
        return "RECEIVE"
    if "stick" in n and "jump" not in n:
        return "RECEIVE"
    if "depth drop" in n and "jump" not in n:
        return "RECEIVE"
    if "drop into box" in n or "depth jump" in n or "depth drop to jump" in n:
        return "PLYO"  # receive then create (stage 2)
    if any(w in n for w in ("hop", "bound", "skip", "squirrel", "pogo", "rope", "tuck", "repeat", "skater", "quick feet",
                            "toe tap", "alternating split stance jumps", "front foot jumps", "jumps over the hurdles",
                            "plate", "high knee")):
        return "PLYO"
    if any(w in n for w in ("box jump", "squat jump", "jump squat", "hex bar", "db ", "loaded", "weighted", "broad jump",
                            "march jump", "high jump", "step up jump", "sit to jump", "lunge jump", "split stance",
                            "staggered", "jump")):
        return "BALLISTIC"
    return None


def split_parts(name):
    parts = [p.strip() for p in re.split(r"/", name or "") if p.strip()]
    ath = [p for p in parts if not any(p.lower().startswith(w) or p.lower() == w for w in RESISTANCE_WORDS)]
    return ath or parts


LOW_WORDS = ("ankle", "squirrel", "pogo", "plate", "rope", "quick feet", "toe tap", "4 hops")


def sub(cls, name, bucket):
    n = (name or "").lower()
    if cls == "PLYO":
        if "push" in n:
            return "PLYO_upper"
        return "PLYO_low" if (bucket == "AP_JUMP_LIMITED_KNEE" or any(w in n for w in LOW_WORDS)) else "PLYO_high"
    if cls == "BALLISTIC":
        return "BALLISTIC_throw" if bucket == "AP_THROW" else "BALLISTIC_jump"
    return cls


def add(acc, cls, sets, reps=0.0, name=None, bucket=None):
    if cls is None or not sets:
        return
    for key in {cls, sub(cls, name, bucket)}:
        acc.setdefault(key, {"sets": 0.0, "reps": 0.0})
        acc[key]["sets"] += sets
        acc[key]["reps"] += reps


def summarise(acc, weeks=1):
    out = {k: {"sets": round(v["sets"] / weeks, 1), "reps": round(v["reps"] / weeks)} for k, v in sorted(acc.items())}
    p = out.get("PLYO", {}).get("sets", 0)
    b = out.get("BALLISTIC", {}).get("sets", 0)
    r = out.get("RECEIVE", {}).get("sets", 0)
    create = p + b
    out["plyo_side_pct_of_power_sets"] = round(100 * (p + r) / (create + r)) if (create + r) else None  # v1 ratio (landings = plyo method stage 1)
    out["plyo_pct_of_create_sets"] = round(100 * p / create) if create else None
    out["ballistic_pct_of_create_sets"] = round(100 * b / create) if create else None
    out["receive_pct_of_all_power_sets"] = round(100 * r / (create + r)) if (create + r) else None
    return out


def boxing_and_mm():
    d = json.load(open(os.path.join(PROG, "prog_mm_athletic_boxing.volume.json")))
    res = {}
    for p in d["programs"]:
        pid = p["program_id"]
        if pid == "MM_BOX_W3_8":
            acc = {}
            for it in p["items"]:
                for c in it.get("components", []):
                    cls = classify(c["name"], c["bucket"])
                    sets = sum(it["sets_by_week"][2:6])  # W3..W6 (index 0 = W1)
                    reps = (c.get("throws_per_set") or c.get("contacts_per_set") or 0) * sets
                    add(acc, cls, sets, reps, c["name"], c["bucket"])
            res["boxing_wk3_6_mean"] = summarise(acc, 4)
        elif pid.startswith("MM_ATH_"):
            acc = {}
            for it in p["items"]:
                for c in it.get("components", []):
                    cls = classify(c["name"], c["bucket"])
                    sets = it.get("sets_assumed") or it.get("sets_as_written") or 0
                    reps = (c.get("throws_per_set") or c.get("contacts_per_set") or 0) * sets
                    add(acc, cls, sets, reps, c["name"], c["bucket"])
            res[pid.lower()] = summarise(acc, 1)
    return res


def baseball():
    d = json.load(open(os.path.join(PROG, "prog_mm_baseball.volume.json")))
    res = {}
    for blk, excl in ((1, "B1W8"), (2, "B2W8"), (3, None)):
        grids = sorted({e["grid"] for e in d["entries"] if e["block"] == blk and e["grid"] != excl})
        acc = {}
        for e in d["entries"]:
            if e["grid"] not in grids or not (e["bucket"] or "").startswith("AP_"):
                continue
            sets = e.get("sets_assumed") or 0
            parts = split_parts(e.get("exercise_clean"))
            share = sets / len(parts) if parts else sets
            for part in parts:
                cls = classify(part, e["bucket"])
                reps = (e.get("contacts") or 0) / len(parts)  # decode 'contacts' = throws for AP_THROW rows
                add(acc, cls, share, reps, part, e["bucket"])
        res[f"baseball_B{blk}"] = summarise(acc, len(grids))
        res[f"baseball_B{blk}"]["weeks"] = len(grids)
    return res


if __name__ == "__main__":
    out = {"_doc": __doc__.strip(), **boxing_and_mm(), **baseball()}
    json.dump(out, open(os.path.join(HERE, "v1_power_mix.json"), "w"), indent=1)
    for k, v in out.items():
        if k.startswith("_"):
            continue
        print(k, json.dumps(v))
