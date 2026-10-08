"""Rule engine for the exercise-ORDER audit (R1-R11 + discovered regularities).

Unit of analysis = one session as written in the sheet (one day x one week-column x one level-column).
Repeated week columns are counted separately (they are separate prescriptions in the sheet); the report
also gives the number of DISTINCT orderings so repetition does not hide anything.
"""
import re
from collections import Counter, defaultdict

from ordering_classify import ATHLETIC, BIG, ISO, LOWER, POWER, SMALL, STRENGTH, UPPER

KD, HD = {"BKD", "UKD"}, {"BHD", "UHD"}
PULL, PUSH = {"HPULL", "VPULL"}, {"HPUSH", "VPUSH"}
LCOMP, UCOMP = {"BKD", "BHD", "UKD", "UHD"}, {"HPULL", "VPULL", "HPUSH", "VPUSH"}
EXCLUDE_FROM_SEQ = {"WARMUP", "MOBILITY", "FOCUS", "ACCESSORY", "ACCESSORY_UPPER", "ACCESSORY_LOWER"}


def seq_of(s, use_role=False):
    """Ordered items that carry at least one tag (BYOP slots count even when the EXERCISE cell is unfilled).
    use_role=True returns the coach's slot-label pattern (ROLE) instead of the movement tags."""
    out = []
    for it in s["items"]:
        if it.get("empty_template_row"):
            continue
        src = it.get("role", it.get("tags", [])) if use_role else it.get("tags", [])
        tags = [t for t in src if t not in EXCLUDE_FROM_SEQ]
        if not tags:
            continue
        out.append((len(out), it, set(tags)))
    return out


def ref(it):
    t = it.get("text")
    slot = it.get("slot")
    if isinstance(slot, dict):
        lab = slot.get("CATEGORY") or slot.get("PURPOSE") or slot.get("D") or slot.get("M")
    else:
        lab = slot
    bits = [it["cell"]]
    if lab:
        bits.append(f"[{lab}]")
    if t:
        bits.append(repr(str(t)[:70]))
    return " ".join(bits)


def sess_hdr(s):
    return {"sid": s["sid"], "book": s["book"], "tab": s["tab"], "track": s.get("track"), "week": s.get("week"),
            "day": s.get("day"), "level": s.get("level")}


def first(seq, tagset, pure=False, exclude=()):
    for i, it, tg in seq:
        if tg & tagset and not (tg & set(exclude)):
            if pure and (tg - tagset - {"CORE"}):
                continue
            return i, it
    return None, None


def idxs(seq, tagset, exclude=()):
    return [(i, it, tg) for i, it, tg in seq if tg & tagset and not (tg & set(exclude))]


def is_contrast(tg):
    return bool(tg & STRENGTH) and bool(tg & (ATHLETIC | {"LOADED_JUMP"}))


# ------------------------------------------------------------------ R1 / R2
def rule_h_before_v(sessions, H, V, rid, name):
    res = {"id": rid, "rule": name, "applicable": 0, "compliant": 0, "strict_compliant": 0, "exceptions": [],
           "by_tab": defaultdict(lambda: [0, 0])}
    for s in sessions:
        seq = seq_of(s)
        hs, vs = idxs(seq, {H}), idxs(seq, {V})
        if not hs or not vs:
            continue
        res["applicable"] += 1
        res["by_tab"][s["tab"]][0] += 1
        lead_ok = hs[0][0] < vs[0][0]
        strict_ok = max(i for i, _, _ in hs) < min(i for i, _, _ in vs)
        if lead_ok:
            res["compliant"] += 1
            res["by_tab"][s["tab"]][1] += 1
        if strict_ok:
            res["strict_compliant"] += 1
        if not lead_ok or not strict_ok:
            e = sess_hdr(s)
            e["type"] = "lead_violation" if not lead_ok else "secondary_only (lead H first, but a later H after a V)"
            e["first_" + H] = ref(hs[0][1])
            e["first_" + V] = ref(vs[0][1])
            e["all_" + H] = [ref(x[1]) for x in hs]
            e["all_" + V] = [ref(x[1]) for x in vs]
            res["exceptions"].append(e)
    return res


# ------------------------------------------------------------------ R3 athletic before strength
def rule_r3(sessions):
    res = {"id": "R3", "rule": "athletic/power work (plyo, med ball, sprint, COD, jumps) before strength",
           "applicable": 0, "compliant": 0, "compliant_except_contrast": 0, "exceptions": [],
           "by_tab": defaultdict(lambda: [0, 0])}
    for s in sessions:
        seq = seq_of(s)
        ath = [(i, it, tg) for i, it, tg in seq if tg & ATHLETIC]
        strg = [(i, it, tg) for i, it, tg in seq if tg & STRENGTH]
        if not ath or not strg:
            continue
        res["applicable"] += 1
        res["by_tab"][s["tab"]][0] += 1
        pure_strength = [x for x in strg if not is_contrast(x[2])]
        first_str = min(x[0] for x in strg)
        late = [x for x in ath if x[0] > first_str or (is_contrast(x[2]) and x[0] >= first_str)]
        if not late:
            res["compliant"] += 1
            res["by_tab"][s["tab"]][1] += 1
            continue
        kinds = []
        for i, it, tg in late:
            slot = it.get("slot") if isinstance(it.get("slot"), str) else None
            if is_contrast(tg):
                k = "contrast complex (heavy lift + jump/sprint in ONE prescription)"
            elif pure_strength and i == pure_strength[0][0] + 1 and (tg & ATHLETIC) and \
                    ({"BKD", "BHD"} & pure_strength[0][2]) and "PLYO_L" in tg and i - 1 in [x[0] for x in pure_strength]:
                k = "contrast pairing (jump immediately after heavy lower lift)"
            elif slot and slot.strip().lower() in ("bkd", "bhd", "ukd", "uhd", "horiz push", "vert push", "horiz pull",
                                                    "vert pull"):
                k = f"athletic exercise placed in the coach's '{slot.strip()}' strength slot"
            elif slot and slot.strip().lower() in ("calfs", "calf", "shoulders", "bicep", "tricep"):
                k = f"athletic exercise in the '{slot.strip()}' accessory slot"
            else:
                prev_regions = {"lower" if x[2] & LCOMP else "upper" for x in strg if x[0] < i}
                reg = "lower" if tg & {"PLYO_L", "SPRINT", "COD", "DRILL"} else "upper"
                k = "athletic after strength (different region: " + reg + " athletic after " + \
                    "/".join(sorted(prev_regions)) + " strength)" if reg not in prev_regions else \
                    "athletic after strength (same region)"
            kinds.append(k)
        only_contrast = all(k.startswith("contrast") for k in kinds)
        if only_contrast:
            res["compliant_except_contrast"] += 1
        e = sess_hdr(s)
        e["first_strength"] = ref(strg[0][1])
        e["late_athletic"] = [ref(x[1]) + "  <" + k + ">" for x, k in zip(late, kinds)]
        e["type"] = "contrast_only" if only_contrast else "violation"
        res["exceptions"].append(e)
    return res


# ------------------------------------------------------------------ R4 power-strength / oly before heavy strength
def rule_r4(sessions):
    res = {"id": "R4", "rule": "power-strength / Olympic / triple-extension before heavy strength",
           "applicable": 0, "compliant": 0, "exceptions": [], "by_tab": defaultdict(lambda: [0, 0])}
    for s in sessions:
        seq = seq_of(s)
        pw = [(i, it, tg) for i, it, tg in seq if tg & POWER]
        strg = [(i, it, tg) for i, it, tg in seq if tg & STRENGTH and not (tg & POWER)]
        if not pw or not strg:
            continue
        res["applicable"] += 1
        res["by_tab"][s["tab"]][0] += 1
        first_str = strg[0][0]
        late = [x for x in pw if x[0] > first_str]
        if not late:
            res["compliant"] += 1
            res["by_tab"][s["tab"]][1] += 1
            continue
        kinds = []
        for i, it, tg in late:
            slot = it.get("slot")
            if is_contrast(tg):
                k = "contrast complex (heavy lift + loaded jump in ONE prescription)"
            elif isinstance(slot, dict) and slot.get("B") == "OLY/ POWER":
                k = "template order: B-col 'STRENGTH' row precedes 'OLY/ POWER' row (HYBRID track)"
            elif isinstance(slot, str) and slot.strip().lower() in ("shoulders", "calfs", "bicep", "tricep"):
                k = f"ballistic lift used in the '{slot.strip()}' accessory slot"
            elif isinstance(slot, str) and slot.strip().lower() in ("vert push", "horiz push", "horiz pull", "vert pull"):
                k = f"ballistic lift in the '{slot.strip()}' superset slot (paired with the hinge/squat)"
            elif i - 1 in [x[0] for x in strg if x[2] & {"BKD", "BHD"}]:
                k = "contrast pairing (ballistic/loaded jump immediately after a heavy squat/hinge)"
            else:
                k = "power lift after strength"
            kinds.append(k)
        e = sess_hdr(s)
        e["first_strength"] = ref(strg[0][1])
        e["late_power"] = [ref(x[1]) + "  <" + k + ">" for x, k in zip(late, kinds)]
        res["exceptions"].append(e)
    return res


# ------------------------------------------------------------------ R5 bilateral before unilateral
UNI_UP = re.compile(r"single arm|\bsa\b|unilateral|one dumbbell|one arm|\bul\b|alternating|\balt\b|sesaw|seesaw|"
                    r"ipsilateral|offset", re.I)


def rule_r5(sessions):
    res = {"id": "R5", "rule": "bilateral before unilateral of the same region", "applicable": 0, "compliant": 0,
           "exceptions": [], "by_tab": defaultdict(lambda: [0, 0]),
           "pattern_level": {"KD": [0, 0], "HD": [0, 0]}, "upper": {"applicable": 0, "compliant": 0, "exceptions": []}}
    for s in sessions:
        seq = seq_of(s)
        bil = [(i, it, tg) for i, it, tg in seq if tg & {"BKD", "BHD"}]
        uni = [(i, it, tg) for i, it, tg in seq if tg & {"UKD", "UHD"}]
        if bil and uni:
            res["applicable"] += 1
            res["by_tab"][s["tab"]][0] += 1
            ok = bil[0][0] <= uni[0][0]
            if ok:
                res["compliant"] += 1
                res["by_tab"][s["tab"]][1] += 1
            else:
                e = sess_hdr(s)
                e["first_bilateral"] = ref(bil[0][1])
                e["first_unilateral"] = ref(uni[0][1])
                res["exceptions"].append(e)
        for fam, b, u in (("KD", "BKD", "UKD"), ("HD", "BHD", "UHD")):
            bi = [i for i, it, tg in seq if b in tg]
            ui = [i for i, it, tg in seq if u in tg]
            if bi and ui:
                res["pattern_level"][fam][0] += 1
                if bi[0] <= ui[0]:
                    res["pattern_level"][fam][1] += 1
        # upper: name-flagged single-arm vs not (DB rows etc. ambiguous -> treated as bilateral only if no marker)
        for fam, FS in (("pull", PULL), ("push", PUSH)):
            up = [(i, it, tg) for i, it, tg in seq if tg & FS and it.get("text")]
            upu = [x for x in up if UNI_UP.search(str(x[1]["text"]))]
            upb = [x for x in up if not UNI_UP.search(str(x[1]["text"]))]
            if upu and upb:
                res["upper"]["applicable"] += 1
                if upb[0][0] < upu[0][0]:
                    res["upper"]["compliant"] += 1
                else:
                    e = sess_hdr(s)
                    e["family"] = fam
                    e["first_bilateral_upper"] = ref(upb[0][1])
                    e["first_unilateral_upper"] = ref(upu[0][1])
                    res["upper"]["exceptions"].append(e)
    return res


# ------------------------------------------------------------------ R6 compound before isolation / R7 big before small
def rule_order_sets(sessions, rid, name, EARLY, LATE, early_label, late_label):
    res = {"id": rid, "rule": name, "applicable": 0, "compliant": 0, "exceptions": [],
           "by_tab": defaultdict(lambda: [0, 0])}
    for s in sessions:
        seq = seq_of(s)
        ear = [(i, it, tg) for i, it, tg in seq if tg & EARLY]
        lat = [(i, it, tg) for i, it, tg in seq if (tg & LATE) and not (tg & EARLY)]
        if not ear or not lat:
            continue
        res["applicable"] += 1
        res["by_tab"][s["tab"]][0] += 1
        last_early = max(x[0] for x in ear)
        bad = [x for x in lat if x[0] < last_early]
        if not bad:
            res["compliant"] += 1
            res["by_tab"][s["tab"]][1] += 1
            continue
        e = sess_hdr(s)
        e[late_label + "_before_" + early_label] = [
            ref(x[1]) + " precedes " + "; ".join(ref(y[1]) for y in ear if y[0] > x[0]) for x in bad]
        res["exceptions"].append(e)
    return res


# ------------------------------------------------------------------ R8 alternate lower/upper
def rule_r8(sessions):
    res = {"id": "R8", "rule": "alternate lower / upper (full-body sessions)", "applicable": 0, "compliant": 0,
           "pairs_total": 0, "pairs_alternating": 0, "all_resistance": {"applicable": 0, "compliant": 0},
           "exceptions": [], "by_tab": defaultdict(lambda: [0, 0])}
    for s in sessions:
        seq = seq_of(s, use_role=True)
        comp = [(i, it, tg) for i, it, tg in seq if tg & (LCOMP | UCOMP)]
        regs = []
        for i, it, tg in comp:
            r = ("L" if tg & LCOMP else "") + ("U" if tg & UCOMP else "")
            regs.append((r, it))
        if not any("L" in r for r, _ in regs) or not any("U" in r for r, _ in regs):
            continue
        res["applicable"] += 1
        res["by_tab"][s["tab"]][0] += 1
        bad = []
        for (a, ia), (b, ib) in zip(regs, regs[1:]):
            res["pairs_total"] += 1
            if a == b and len(a) == 1:
                bad.append(f"{ref(ia)} -> {ref(ib)} (both {'lower' if a == 'L' else 'upper'})")
            else:
                res["pairs_alternating"] += 1
        if not bad:
            res["compliant"] += 1
            res["by_tab"][s["tab"]][1] += 1
        else:
            e = sess_hdr(s)
            e["compound_region_sequence"] = "".join(r if len(r) == 1 else "(" + r + ")" for r, _ in regs)
            e["same_region_adjacent"] = bad
            res["exceptions"].append(e)
        # secondary: all resistance incl. isolation
        allr = []
        for i, it, tg in seq:
            if tg & (LOWER | UPPER):
                allr.append(("L" if tg & LOWER else "") + ("U" if tg & UPPER else ""))
        res["all_resistance"]["applicable"] += 1
        if all(not (a == b and len(a) == 1) for a, b in zip(allr, allr[1:])):
            res["all_resistance"]["compliant"] += 1
    return res


# ------------------------------------------------------------------ R9 pairing
def rule_r9(sessions):
    res = {"id": "R9", "rule": "knee-dominant paired with pull, hip-dominant paired with push",
           "applicable": 0, "compliant": 0, "pairs": Counter(), "day_level": Counter(), "exceptions": [],
           "by_tab": defaultdict(lambda: [0, 0])}
    for s in sessions:
        seq = seq_of(s, use_role=True)
        comp = [(i, it, tg) for i, it, tg in seq if tg & (LCOMP | UCOMP)]
        lows = [x for x in comp if x[2] & LCOMP]
        ups = [x for x in comp if x[2] & UCOMP]
        if not lows or not ups:
            continue
        res["applicable"] += 1
        res["by_tab"][s["tab"]][0] += 1
        # day level
        lf = ("KD" if any(x[2] & KD for x in lows) else "") + ("HD" if any(x[2] & HD for x in lows) else "")
        uf = ("PULL" if any(x[2] & PULL for x in ups) else "") + ("PUSH" if any(x[2] & PUSH for x in ups) else "")
        res["day_level"][f"{lf}+{uf}"] += 1
        # adjacency pairs
        pairs, k = [], 0
        while k < len(comp) - 1:
            a, b = comp[k], comp[k + 1]
            if bool(a[2] & LCOMP) != bool(b[2] & LCOMP) and not (a[2] & LCOMP and a[2] & UCOMP) and \
                    not (b[2] & LCOMP and b[2] & UCOMP):
                lo, up = (a, b) if a[2] & LCOMP else (b, a)
                l = "KD" if lo[2] & KD else "HD"
                u = "PULL" if up[2] & PULL else "PUSH"
                pairs.append((l, u, lo[1], up[1]))
                k += 2
            elif a[2] & LCOMP and a[2] & UCOMP:  # one prescription holding both (superset in a cell)
                l = "KD" if a[2] & KD else "HD"
                u = "PULL" if a[2] & PULL else "PUSH"
                pairs.append((l, u, a[1], a[1]))
                k += 1
            else:
                k += 1
        if comp and comp[-1][2] & LCOMP and comp[-1][2] & UCOMP and (len(comp) == 1 or k == len(comp) - 1):
            a = comp[-1]
            pairs.append(("KD" if a[2] & KD else "HD", "PULL" if a[2] & PULL else "PUSH", a[1], a[1]))
        for l, u, _, _ in pairs:
            res["pairs"][f"{l}+{u}"] += 1
        bad = [p for p in pairs if (p[0], p[1]) in (("KD", "PUSH"), ("HD", "PULL"))]
        if pairs and not bad:
            res["compliant"] += 1
            res["by_tab"][s["tab"]][1] += 1
        elif not pairs:
            e = sess_hdr(s)
            e["note"] = "no adjacent lower/upper pair (e.g. all lower then all upper)"
            e["day_level"] = f"{lf}+{uf}"
            res["exceptions"].append(e)
        else:
            e = sess_hdr(s)
            e["opposite_pairs"] = [f"{p[0]}+{p[1]}: {ref(p[2])} with {ref(p[3])}" for p in bad]
            e["all_pairs"] = [f"{p[0]}+{p[1]}" for p in pairs]
            res["exceptions"].append(e)
    res["pairs"] = dict(res["pairs"])
    res["day_level"] = dict(res["day_level"])
    return res


# ------------------------------------------------------------------ R10 core / conditioning at end or separate day
def rule_r10(sessions):
    out = {}
    for what, T in (("core", {"CORE"}), ("conditioning", {"COND"})):
        res = {"id": "R10-" + what, "rule": f"{what} at the end of the session or on a separate day",
               "applicable": 0, "compliant": 0, "compliant_separate_day": 0, "compliant_at_end": 0,
               "exceptions": [], "by_tab": defaultdict(lambda: [0, 0]), "position_counts": Counter()}
        for s in sessions:
            seq = seq_of(s)
            tgt = [(i, it, tg) for i, it, tg in seq if tg & T]
            if not tgt:
                continue
            other = [(i, it, tg) for i, it, tg in seq if (tg - T - {"CORE", "COND"}) ]
            res["applicable"] += 1
            res["by_tab"][s["tab"]][0] += 1
            if not other or s.get("kind") in ("template_optional", "cardio_day"):
                res["compliant"] += 1
                res["compliant_separate_day"] += 1
                res["by_tab"][s["tab"]][1] += 1
                res["position_counts"]["separate day (no other work)"] += 1
                continue
            last_other = max(x[0] for x in other)
            first_other = min(x[0] for x in other)
            embedded = [x for x in tgt if x[2] - T - {"CORE", "COND"}]
            early = [x for x in tgt if x[0] < last_other and not (x[2] - T - {"CORE", "COND"})]
            if not early and not embedded:
                res["compliant"] += 1
                res["compliant_at_end"] += 1
                res["by_tab"][s["tab"]][1] += 1
                res["position_counts"]["at end"] += 1
                continue
            e = sess_hdr(s)
            pos = []
            for x in early:
                after_ath = [y for y in other if y[0] < x[0]]
                if x[0] < first_other:
                    p = "first in session"
                elif all((y[2] & (ATHLETIC | POWER)) and not (y[2] & STRENGTH) for y in after_ath):
                    p = "after athletic/power block, before strength"
                else:
                    p = "between strength exercises"
                pos.append(ref(x[1]) + f"  <{p}>")
                res["position_counts"][p] += 1
            for x in embedded:
                pos.append(ref(x[1]) + "  <embedded in a strength superset prescription>")
                res["position_counts"]["embedded in strength superset"] += 1
            e["positions"] = pos
            res["exceptions"].append(e)
        res["position_counts"] = dict(res["position_counts"])
        out[what] = res
    return out


def distinct_orderings(sessions):
    """Return {tab: n_distinct_tag_sequences} so repeated week columns are visible."""
    d = defaultdict(set)
    for s in sessions:
        d[s["tab"]].add(tuple("+".join(sorted(tg)) for _, _, tg in seq_of(s)))
    return {k: len(v) for k, v in d.items()}
