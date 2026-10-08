"""Exercise-ORDER audit driver. Produces ordering_audit.json (+ data used by ordering_audit.md).

Run:  .venv/bin/python analysis/equipment/ordering_audit.py
Read-only on raw/*.xlsx. Never touches Google Sheets.
"""
import json
import re
import sys
from collections import Counter, defaultdict
from pathlib import Path

HERE = Path(__file__).resolve().parent
sys.path.insert(0, str(HERE))

from ordering_classify import ATHLETIC, BIG, ISO, POWER, SMALL, STRENGTH  # noqa: E402
from ordering_extract import extract_mm11  # noqa: E402
from ordering_rules import (KD, HD, LCOMP, PULL, PUSH, UCOMP, distinct_orderings, ref, rule_h_before_v,  # noqa: E402
                            rule_order_sets, rule_r3, rule_r4, rule_r5, rule_r8, rule_r9, rule_r10, seq_of, sess_hdr)
from ordering_tag import tag_sessions  # noqa: E402


def pct(a, b):
    return None if not b else round(100.0 * a / b, 1)


def finalize(r):
    r = dict(r)
    r["by_tab"] = {k: {"applicable": v[0], "compliant": v[1]} for k, v in r["by_tab"].items()}
    r["sessions_applicable"] = r.pop("applicable")
    r["compliant_pct"] = pct(r["compliant"], r["sessions_applicable"])
    r["exceptions_count"] = len(r["exceptions"])
    return r


def program_key(s):
    return (s["book"], s["tab"], s.get("track") or "", s.get("level") or "")


def main():
    sessions = tag_sessions()
    circuits = [s for s in sessions if s["kind"] == "circuit"]
    rs = [s for s in sessions if s["kind"] != "circuit"]

    rules = []
    r1 = finalize(rule_h_before_v(rs, "HPULL", "VPULL", "R1", "horizontal pull before vertical pull in the same session"))
    r2 = finalize(rule_h_before_v(rs, "HPUSH", "VPUSH", "R2", "horizontal push before vertical push in the same session"))
    r3 = finalize(rule_r3(rs))
    r4 = finalize(rule_r4(rs))
    r5 = finalize(rule_r5(rs))
    r6 = finalize(rule_order_sets(rs, "R6", "compound before isolation", STRENGTH | {"OLY"}, ISO, "compound", "isolation"))
    r7 = finalize(rule_order_sets(rs, "R7", "big muscles before small muscles", BIG, SMALL, "big", "small"))
    r8 = finalize(rule_r8(rs))
    r9 = finalize(rule_r9(rs))
    r10 = rule_r10(rs)
    r10c, r10k = finalize(r10["core"]), finalize(r10["conditioning"])
    rules = [r1, r2, r3, r4, r5, r6, r7, r8, r9, r10c, r10k]

    # ------------------------------------------------------------ R11 weekly vector maps
    VEC = ["HPULL", "VPULL", "HPUSH", "VPUSH", "BKD", "BHD", "UKD", "UHD"]
    weekly = defaultdict(lambda: defaultdict(list))
    for s in rs:
        seq = seq_of(s, use_role=True)
        roles = set()
        for _, _, tg in seq:
            roles |= tg
        mov = set()
        for _, _, tg in seq_of(s):
            mov |= tg
        dayvec = []
        for _, _, tg in seq:
            for v in VEC:
                if v in tg and v not in dayvec:
                    dayvec.append(v)
        extra = []
        if mov & {"PLYO_L"}: extra.append("PLYO_L")
        if mov & {"PLYO_U"}: extra.append("PLYO_U/MB")
        if mov & {"SPRINT", "DRILL", "COD"}: extra.append("SPRINT/COD/DRILL")
        if mov & {"OLY", "LOADED_JUMP"}: extra.append("OLY/LOADED_JUMP")
        if "CORE" in mov: extra.append("CORE")
        if "COND" in mov: extra.append("COND")
        weekly[program_key(s)][s.get("week") or "-"].append({"day": s["day"], "sid": s["sid"], "vectors": dayvec,
                                                            "other": extra})
    r11 = {"id": "R11", "rule": "across the WEEK, which vectors appear on which days (rotation)",
           "sessions_applicable": len(rs), "compliant": None,
           "note": "descriptive rule: no pass/fail; see programs[].modal_layout and the weekly rotation rules in the .md",
           "exceptions": [], "programs": []}
    for pk, weeks in weekly.items():
        sig = Counter()
        rep = None
        for w, days in weeks.items():
            k = tuple((d["day"], tuple(d["vectors"])) for d in days)
            sig[k] += 1
            if rep is None:
                rep = (w, days)
        modal, n = sig.most_common(1)[0]
        r11["programs"].append({"book": pk[0], "tab": pk[1], "track": pk[2], "level": pk[3],
                                "weeks_in_sheet": len(weeks), "distinct_weekly_layouts": len(sig),
                                "modal_layout_weeks": n,
                                "modal_layout": [{"day": d, "vectors": list(v),
                                                  "other_in_any_week": sorted({o for w2, ds in weeks.items() for x in ds
                                                                               if x["day"] == d for o in x["other"]})}
                                                 for d, v in modal],
                                "all_weeks": {w: d for w, d in weeks.items()}})
    rules.append(r11)

    # ------------------------------------------------------------ discovered regularities
    new = []

    # N1 synergist-matched arm isolation
    c = Counter()
    for s in rs:
        mv = set().union(*[tg for _, _, tg in seq_of(s)]) if seq_of(s) else set()
        up = ("PULL" if mv & PULL else "") + ("PUSH" if mv & PUSH else "")
        if up in ("PULL", "PUSH"):
            c[(up, "ISO_BICEP" in mv, "ISO_TRICEP" in mv)] += 1
    n1 = {"PULL-only sessions": {"with bicep iso": sum(v for k, v in c.items() if k[0] == "PULL" and k[1]),
                                 "with tricep iso": sum(v for k, v in c.items() if k[0] == "PULL" and k[2]),
                                 "total": sum(v for k, v in c.items() if k[0] == "PULL")},
          "PUSH-only sessions": {"with tricep iso": sum(v for k, v in c.items() if k[0] == "PUSH" and k[2]),
                                 "with bicep iso": sum(v for k, v in c.items() if k[0] == "PUSH" and k[1]),
                                 "total": sum(v for k, v in c.items() if k[0] == "PUSH")}}
    n1_exc = []
    for s in rs:
        mv = set().union(*[tg for _, _, tg in seq_of(s)]) if seq_of(s) else set()
        up = ("PULL" if mv & PULL else "") + ("PUSH" if mv & PUSH else "")
        if (up == "PULL" and "ISO_TRICEP" in mv) or (up == "PUSH" and "ISO_BICEP" in mv):
            n1_exc.append({**sess_hdr(s), "detail": [ref(it) for _, it, tg in seq_of(s) if tg & {"ISO_BICEP", "ISO_TRICEP"}]})
    new.append({"id": "N1", "rule": "Arm isolation matches the day's upper pattern: biceps on pull days, triceps on push days",
                "status": "OBSERVED (counts) / INFERRED (intent)", "counts": n1, "exceptions": n1_exc})

    # N2 lower isolation matches day's lower pattern
    c2 = Counter()
    n2_exc = []
    for s in rs:
        sq = seq_of(s, use_role=True)
        mv = set().union(*[tg for _, _, tg in sq]) if sq else set()
        lo = ("KD" if mv & KD else "") + ("HD" if mv & HD else "")
        if lo in ("KD", "HD") and mv & {"ISO_QUAD", "ISO_HAM"}:
            k = (lo, "ISO_QUAD" in mv, "ISO_HAM" in mv)
            c2[k] += 1
            if (lo == "KD" and "ISO_HAM" in mv and "ISO_QUAD" not in mv) or (lo == "HD" and "ISO_QUAD" in mv and "ISO_HAM" not in mv):
                n2_exc.append({**sess_hdr(s), "detail": [ref(it) for _, it, tg in sq if tg & {"ISO_QUAD", "ISO_HAM"}]})
    new.append({"id": "N2", "rule": "Lower-body isolation finisher matches the day's lower pattern (leg extension on knee-dominant days, leg curl on hip-dominant days)",
                "status": "OBSERVED (counts) / INFERRED (intent)",
                "counts": {f"{k[0]}-only day: quad_iso={k[1]} ham_iso={k[2]}": v for k, v in sorted(c2.items())},
                "exceptions": n2_exc})

    # N3 cross-pattern unilateral
    c3 = Counter()
    ex3 = defaultdict(list)
    for s in rs:
        sq = seq_of(s, use_role=True)
        mv = set().union(*[tg for _, _, tg in sq]) if sq else set()
        bil = [x for x in ("BKD", "BHD") if x in mv]
        uni = [x for x in ("UKD", "UHD") if x in mv]
        if len(bil) == 1 and len(uni) == 1:
            k = f"{bil[0]}+{uni[0]}"
            c3[(s["tab"], k)] += 1
            ex3[k].append(s["sid"])
    by_tab3 = defaultdict(dict)
    for (t, k), v in c3.items():
        by_tab3[t][k] = v
    new.append({"id": "N3", "rule": "Unilateral lower pattern relative to the bilateral one (same pattern vs cross pattern) - template-specific",
                "status": "OBSERVED", "counts_by_tab": by_tab3,
                "totals": dict(Counter(k for (_, k) in c3.elements()))})

    # N4 core placement in athletic vs aesthetic programs (from R10 core positions by tab)
    pos_by_tab = defaultdict(Counter)
    for s in rs:
        sq = seq_of(s)
        cores = [(i, it, tg) for i, it, tg in sq if "CORE" in tg]
        if not cores:
            continue
        other = [(i, it, tg) for i, it, tg in sq if tg - {"CORE", "COND"}]
        if not other or s.get("kind") in ("template_optional", "cardio_day"):
            pos_by_tab[s["tab"]]["separate day"] += 1
            continue
        strength = [i for i, it, tg in sq if tg & (STRENGTH | {"OLY"}) and not (tg & {"CORE"})]
        for i, it, tg in cores:
            if tg - {"CORE", "COND"}:
                pos_by_tab[s["tab"]]["inside a strength superset/prescription"] += 1
            elif strength and i < min(strength):
                pos_by_tab[s["tab"]]["before strength (after power block)"] += 1
            elif strength and i > max(strength):
                pos_by_tab[s["tab"]]["after all strength (end)"] += 1
            elif strength:
                pos_by_tab[s["tab"]]["between strength exercises"] += 1
            else:
                pos_by_tab[s["tab"]]["no strength in session"] += 1
    new.append({"id": "N4", "rule": "Core placement depends on program type: athletic templates put core right after the power block (or as the superset partner of a strength lift); aesthetic templates put it on separate/optional days",
                "status": "OBSERVED", "core_item_positions_by_tab": {k: dict(v) for k, v in pos_by_tab.items()}})

    # N5 athletic before oly
    a5, c5, ex5 = 0, 0, []
    for s in rs:
        sq = seq_of(s)
        ath = [i for i, it, tg in sq if tg & ATHLETIC and not tg & STRENGTH]
        oly = [i for i, it, tg in sq if "OLY" in tg]
        if ath and oly:
            a5 += 1
            if max(ath) < min(oly):
                c5 += 1
            elif min(ath) < min(oly):
                c5 += 0
                ex5.append({**sess_hdr(s), "detail": "some athletic after first OLY"})
            else:
                ex5.append({**sess_hdr(s), "detail": "OLY before all athletic"})
    new.append({"id": "N5", "rule": "Within the power block: plyo / throws / COD / sprint come before Olympic-lift / triple-extension work",
                "status": "OBSERVED", "applicable": a5, "compliant": c5, "exceptions": ex5})

    # N6 plyo progression inside the athletic block
    land = re.compile(r"stick|drop & stick|depth drop(?!.*jump)|drop(?!.*jump)", re.I)
    react = re.compile(r"jump|hop|bound", re.I)
    sl = re.compile(r"single leg|\bsl\b|one leg|single side|lateral hop|skater", re.I)
    a6, c6, ex6 = 0, 0, []
    a6b, c6b, ex6b = 0, 0, []
    for s in rs:
        sq = [(i, it, tg) for i, it, tg in seq_of(s) if "PLYO_L" in tg and it.get("text")]
        L = [i for i, it, tg in sq if land.search(str(it["text"])) and not react.search(str(it["text"]))]
        R = [i for i, it, tg in sq if react.search(str(it["text"]))]
        if L and R:
            a6 += 1
            if min(L) < min(R):
                c6 += 1
            else:
                ex6.append({**sess_hdr(s), "detail": [ref(it) for i, it, tg in sq]})
        U = [i for i, it, tg in sq if sl.search(str(it["text"]))]
        B = [i for i, it, tg in sq if not sl.search(str(it["text"]))]
        if U and B:
            a6b += 1
            if min(B) < min(U):
                c6b += 1
            else:
                ex6b.append({**sess_hdr(s), "detail": [ref(it) for i, it, tg in sq]})
    new.append({"id": "N6", "rule": "Plyo progression inside a session: landing/stick (eccentric) drills before reactive jumps; bilateral jumps before single-leg jumps",
                "status": "OBSERVED (weak/partial; small n)",
                "landing_before_reactive": {"applicable": a6, "compliant": c6, "exceptions": ex6},
                "bilateral_before_single_leg": {"applicable": a6b, "compliant": c6b, "exceptions": ex6b}})

    # N7 BASEBALL: Part A ballistics type vs Part C pattern
    c7 = Counter()
    for s in rs:
        if s["tab"] != "BASEBALL":
            continue
        partA = [it.get("slot") for it in s["items"] if isinstance(it.get("slot"), str) and "ballistics" in it["slot"].lower()]
        a = "UPPER" if any("upper" in x.lower() for x in partA) else ("LOWER" if partA else "?")
        sq = seq_of(s, use_role=True)
        mv = set().union(*[tg for _, _, tg in sq]) if sq else set()
        lo = "BKD" if "BKD" in mv else ("BHD" if "BHD" in mv else "-")
        up = "+".join(x for x in ("HPULL", "VPULL", "HPUSH", "VPUSH") if x in mv) or "-"
        c7[(s["day"].split("'")[1], a, lo, up)] += 1
    new.append({"id": "N7", "rule": "BASEBALL 5-part skeleton and day rotation: Mon/Thu = UPPER ballistics + bkd + pull (horizontal Mon, vertical Thu) + uhd + bicep + calves; Tue/Fri = LOWER ballistics + bhd + push (horizontal Tue, vertical Fri) + ukd + tricep + shoulders",
                "status": "OBSERVED (slot labels in BASEBALL label columns)",
                "counts": {" | ".join(k): v for k, v in sorted(c7.items())}})

    # N8 weekly alternation of the lead lift
    lead = defaultdict(list)
    for s in rs:
        if not s.get("week") or s["book"] != "MASTER_MODEL" or s["kind"] in ("cardio_day",):
            continue
        sq = seq_of(s, use_role=True)
        st = [(i, it, tg) for i, it, tg in sq if tg & (STRENGTH)]
        if not st:
            continue
        tg = st[0][2]
        fam = ("KD" if tg & KD else "") + ("HD" if tg & HD else "") + ("HPUSH" if "HPUSH" in tg else "") + \
              ("VPUSH" if "VPUSH" in tg else "") + ("HPULL" if "HPULL" in tg else "") + ("VPULL" if "VPULL" in tg else "")
        lead[(s["tab"], s.get("track") or "", s.get("level") or "", s["day"])].append((s["week"], fam, ref(st[0][1])))
    n8 = []
    for k, v in lead.items():
        if len(v) < 3:
            continue
        fams = [f for _, f, _ in v]
        flips = sum(1 for a, b in zip(fams, fams[1:]) if a != b)
        n8.append({"tab": k[0], "track": k[1], "level": k[2], "day": k[3], "weeks": len(v), "lead_changes": flips,
                   "sequence": [f"{w}: {f} ({r})" for w, f, r in v]})
    new.append({"id": "N8", "rule": "Week-to-week A/B alternation of the lead lift (squat-pattern week <-> hinge-pattern week; bench week <-> overhead week) while the session skeleton stays fixed",
                "status": "OBSERVED", "per_day": n8})

    # N9 within-week mirror: same day-type twice a week with swapped lead (FAT BURN) or identical (BYOP)
    n9 = []
    for pk, weeks in weekly.items():
        for w, days in weeks.items():
            byvec = defaultdict(list)
            for d in days:
                if d["vectors"]:
                    byvec[tuple(sorted(d["vectors"]))].append(d)
            for vec, ds in byvec.items():
                if len(ds) >= 2:
                    seqs = []
                    for d in ds:
                        s = next(x for x in rs if x["sid"] == d["sid"])
                        seqs.append([("+".join(sorted(tg)), it["cell"]) for _, it, tg in seq_of(s, use_role=True)
                                     if tg & (STRENGTH | ISO)])
                    same = all([a for a, _ in sq] == [a for a, _ in seqs[0]] for sq in seqs)
                    n9.append({"program": " / ".join(x for x in pk if x), "week": w,
                               "days": [d["day"] for d in ds], "identical_order": same,
                               "orders": [[a for a, _ in sq] for sq in seqs]})
    new.append({"id": "N9", "rule": "Each day-type is repeated twice per week; BYOP repeats it identically (Day 1 = Day 3, Day 2 = Day 4), FAT BURN / 4-TRACKS AESTHETICS swap the order of the first two lifts on the second exposure",
                "status": "OBSERVED", "pairs": n9})

    # N10 prep first
    c10 = Counter()
    for s in rs:
        sq = [(i, it, set(it.get("tags", []))) for i, it in enumerate(s["items"]) if it.get("tags")]
        if not sq:
            continue
        first = sq[0][2]
        if first & {"WARMUP", "MOBILITY"}:
            c10[(s["tab"], "warm-up/mobility first")] += 1
        if any(tg & {"DRILL"} for _, _, tg in sq[:4]):
            c10[(s["tab"], "A-drills before lifting")] += 1
    new.append({"id": "N10", "rule": "Preparation first: 'Any Cardio Equipment' 5 min opens every UL/PPL session; 'KB Book openers' (thoracic mobility) before pressing; 'A March' / 'A Skip' / 'A Run' before squatting",
                "status": "OBSERVED", "counts": {" | ".join(k): v for k, v in c10.items()}})

    # N11 conjugate hierarchy labels
    from ordering_extract import wb, val
    ws = wb("MASTER_MODEL")["(NOT DONE) EXAMPLE CONJUGATE"]
    ws4 = wb("MASTER_MODEL")["(NOT DONE) 4 TRACKS PROGRAMMING"]
    n11 = {"CONJUGATE M13:M28": [f"M{r}={val(ws, r, 'M')!r} LOAD D{r}={val(ws, r, 'D')!r} Sets B{r}={val(ws, r, 'B')!r} Reps C{r}={val(ws, r, 'C')!r}" for r in range(13, 29) if val(ws, r, "M")],
           "4 TRACKS M9:M24": [f"M{r}={val(ws4, r, 'M')!r} LOAD D{r}={val(ws4, r, 'D')!r} N{r}={val(ws4, r, 'N')!r}" for r in range(9, 25) if val(ws4, r, "M")]}
    new.append({"id": "N11", "rule": "Explicit 4-tier session hierarchy in the strength/conjugate templates: 'the work' -> 'the accessory' -> 'the nuance' -> 'the survival', with load '1RIR' -> '2RIR' -> 'MAX' -> 'ALL'",
                "status": "OBSERVED (coach labels)", "cells": n11})

    # N12 contrast pairings (heavy -> fast)
    contrast = []
    for s in rs:
        sq = seq_of(s)
        for k, (i, it, tg) in enumerate(sq):
            heavy_jump_same_item = bool(tg & STRENGTH) and bool(tg & (ATHLETIC | {"LOADED_JUMP"}))
            prev = sq[k - 1] if k else None
            after_heavy = prev is not None and prev[2] & {"BKD", "BHD"} and not prev[2] & ATHLETIC and \
                tg & {"PLYO_L", "LOADED_JUMP"} and not tg & STRENGTH
            if heavy_jump_same_item or after_heavy:
                contrast.append({**sess_hdr(s), "item": ref(it), "prev": ref(prev[1]) if after_heavy else None,
                                 "form": "one prescription" if heavy_jump_same_item else "consecutive rows"})
    new.append({"id": "N12", "rule": "Contrast / complex pairing: a heavy squat or hinge is immediately followed by an unloaded or light explosive version of the same pattern (heavy -> fast), the only systematic exception to 'athletic first'",
                "status": "OBSERVED", "instances": contrast, "count": len(contrast)})

    # N13 MYO / intensity techniques last
    myo = []
    for s in sessions:
        for k, it in enumerate(s["items"]):
            t = str(it.get("text") or "")
            if "myo" in t.lower():
                myo.append({**sess_hdr(s), "cell": it["cell"], "text": t, "position": f"{k + 1} of {len(s['items'])}"})
    # reps cells mentioning MYO (BYOP G12 'MYO SET'; BASEBALL reps 'myo set')
    from ordering_extract import wb as _wb
    wsb = _wb("BYOP")
    for tab in ("ATHLETIC - FULL BODY - 4 DAYS A", "JUSTICE LEAGUE"):
        for row in wsb[tab].iter_rows():
            for cc in row:
                if isinstance(cc.value, str) and "myo" in cc.value.lower():
                    myo.append({"book": "BYOP", "tab": tab, "cell": cc.coordinate, "text": cc.value,
                                "position": "reps cell of the last slot of MONDAY (row 12 'Leg Extensions')" if cc.row == 12 else "?"})
    wsbb = wb("MASTER_MODEL")["BASEBALL"]
    for row in wsbb.iter_rows():
        for cc in row:
            if isinstance(cc.value, str) and "myo" in cc.value.lower():
                myo.append({"book": "MASTER_MODEL", "tab": "BASEBALL", "cell": cc.coordinate, "text": cc.value,
                            "position": "reps cell (Part D accessory rows)"})
    new.append({"id": "N13", "rule": "Intensity techniques (MYO sets) only on the last 1-2 exercises (isolation or machine)",
                "status": "OBSERVED", "instances": myo})

    # N14 superset structure
    sup = Counter()
    for s in rs:
        for it in s["items"]:
            t = str(it.get("text") or "")
            if re.search(r"superset", t, re.I):
                sup[(s["tab"], "exercise text contains 'SUPERSET'")] += 1
    for row in wsbb.iter_rows():
        for cc in row:
            if isinstance(cc.value, str) and cc.value.lower().startswith("superset"):
                sup[("BASEBALL", f"reps cell '{cc.value}'")] += 1
    new.append({"id": "N14", "rule": "Non-competing supersets: bilateral lower lift + upper compound share one block ('Superset - same reps'), unilateral lower + arm isolation share the next",
                "status": "OBSERVED", "counts": {" | ".join(k): v for k, v in sup.items()}})

    # N15 crossfit category order & week grid
    cf = extract_mm11()
    new.append({"id": "N15", "rule": "CROSSFIT model: class order 'WARMUP/SKILL' -> 'STRENGTH/POWER' -> 'WOD'; weekly strength rotation 'KNEE DOM' (Mon) / 'PULL' (Tue) / 'HIP DOM' (Thu) / 'PUSH' (Fri) with 'LB'/'UB' resistance days, Wed + Sun 'OFF'; power alternates 'SNATCH' / 'CLEAN'",
                "status": "OBSERVED (category grid, no exercise lists)", "class_model": cf["class_model_header"],
                "class_split": cf["class_split"], "monthly_grids": cf["monthly_grids"]})

    # N16 KD before HD when both bilateral lower patterns appear
    a16, kd16, ex16 = 0, 0, []
    for s in rs:
        sq = seq_of(s, use_role=True)
        k = [i for i, it, tg in sq if "BKD" in tg]
        h = [i for i, it, tg in sq if "BHD" in tg]
        if k and h:
            a16 += 1
            if min(k) < min(h):
                kd16 += 1
            else:
                ex16.append({**sess_hdr(s), "first_BHD": ref(sq[min(h)][1]), "first_BKD": ref(sq[min(k)][1])})
    new.append({"id": "N16", "rule": "When a session holds both bilateral patterns, the squat (knee-dominant) usually comes before the hinge - except in programs that alternate the lead lift",
                "status": "OBSERVED", "applicable": a16, "kd_first": kd16, "hd_first_sessions": ex16})

    # N17 quad iso before ham iso
    a17, q17, ex17 = 0, 0, []
    for s in rs:
        sq = seq_of(s)
        q = [i for i, it, tg in sq if "ISO_QUAD" in tg and "ISO_HAM" not in tg]
        h = [i for i, it, tg in sq if "ISO_HAM" in tg and "ISO_QUAD" not in tg]
        if q and h:
            a17 += 1
            if min(q) < min(h):
                q17 += 1
            else:
                ex17.append({**sess_hdr(s), "detail": [ref(sq[min(h)][1]), ref(sq[min(q)][1])]})
    new.append({"id": "N17", "rule": "Leg extension before leg curl when both appear (mirrors squat-before-hinge)",
                "status": "OBSERVED", "applicable": a17, "quad_first": q17, "ham_first_sessions": ex17})

    # N18 horizontal pull with bilateral lower, vertical with unilateral (BYOP full-body pairing detail)
    c18 = Counter()
    for s in rs:
        sq = seq_of(s, use_role=True)
        comp = [(i, it, tg) for i, it, tg in sq if tg & (LCOMP | UCOMP)]
        for a, b in zip(comp, comp[1:]):
            if a[2] & LCOMP and b[2] & UCOMP:
                l = "bilateral" if a[2] & {"BKD", "BHD"} else "unilateral"
                u = "horizontal" if b[2] & {"HPULL", "HPUSH"} else "vertical"
                c18[(s["book"], l, u)] += 1
    new.append({"id": "N18", "rule": "In lower->upper pairs, the bilateral (heavier) lower lift is paired with the HORIZONTAL upper vector and the unilateral lower lift with the VERTICAL vector",
                "status": "OBSERVED", "counts": {" | ".join(k): v for k, v in sorted(c18.items())}})

    # circuits (excluded from R1-R10 denominators)
    circ = [{**sess_hdr(s), "stations": [ref(it) + " -> " + "+".join(it["tags"]) for it in s["items"]]} for s in circuits]

    out = {
        "_meta": {
            "generated_by": "analysis/equipment/ordering_audit.py (+ ordering_extract.py, ordering_classify.py, ordering_tag.py, ordering_rules.py)",
            "sources": ["raw/BYOP.xlsx tabs 00-08 (dumps/BYOP/00_*..08_*)",
                        "raw/MASTER_MODEL.xlsx tabs 00,01,02,04,05,06,07,11,12 (03 'Copy of BASEBALL' skipped as duplicate of 02)"],
            "read_only": True,
            "unit": "one session as written = one day x one week-column x one level-column. BYOP templates: every slot counts even when the EXERCISE cell still reads 'CHOOSE' (the CATEGORY/PURPOSE label is the coach's design). Circuits ('CIRCUITS RECCOMENDED' block of FAT BURN) are listed separately and excluded from R1-R10 denominators.",
            "classification": "movement tags from the coach's slot label when one exists (BYOP CATEGORY/PURPOSE; BASEBALL Part labels such as 'bkd','horiz pull','Upper Ballistics/plyo'; HYBRID B/D labels) else from exercise-name keywords (INFERRED). ROLE (= coach slot pattern) is used for pairing/alternation rules R8/R9/N3/N7/N16; movement tags for everything else.",
            "baseball_labels": "BASEBALL Week 1 of Block 1 and Weeks 1/3 of Block 3 have no label column (it holds the previous day's exercise list); their slot labels are the modal label of the same row across sibling weeks with the same header row (INFERRED, flagged per item as slot_borrowed).",
            "evidence_legend": {"OBSERVED": "read from a cell/label", "INFERRED": "analyst interpretation", "SCIENCE": "external training-science rationale"},
            "session_counts": dict(Counter((s["book"], s["tab"]) for s in rs).items()) and
                              {f"{b} / {t}": n for (b, t), n in Counter((s["book"], s["tab"]) for s in rs).items()},
            "circuit_sessions_excluded": len(circuits),
            "distinct_orderings_by_tab": distinct_orderings(rs),
        },
        "rules": [{k: v for k, v in r.items()} for r in rules],
        "new_rules_found": new,
        "circuits": circ,
        "sessions": [{**sess_hdr(s), "kind": s["kind"],
                      "items": [{"cell": it["cell"], "slot": it.get("slot"), "text": it.get("text"),
                                 "tags": it.get("tags"), "role": it.get("role"), "tag_source": it.get("tag_source"),
                                 **({"slot_borrowed": it["slot_borrowed"]} if it.get("slot_borrowed") else {})}
                                for it in s["items"]]} for s in sessions],
    }
    (HERE / "ordering_audit.json").write_text(json.dumps(out, indent=1, ensure_ascii=False, default=str), encoding="utf-8")
    return out


if __name__ == "__main__":
    o = main()
    for r in o["rules"]:
        if r["id"] == "R11":
            continue
        print(r["id"], r["sessions_applicable"], r["compliant"], r["compliant_pct"], r["exceptions_count"],
              {k: r[k] for k in ("strict_compliant", "compliant_except_contrast", "pattern_level", "pairs", "day_level",
                                 "pairs_total", "pairs_alternating", "all_resistance", "position_counts",
                                 "compliant_separate_day", "compliant_at_end") if k in r})
    for n in o["new_rules_found"]:
        print(n["id"], {k: v for k, v in n.items() if k in ("counts", "applicable", "compliant", "kd_first", "quad_first",
                                                             "totals", "core_item_positions_by_tab", "count")})
    print(o["_meta"]["session_counts"], o["_meta"]["distinct_orderings_by_tab"])
