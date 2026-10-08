"""Tag all extracted sessions (see ordering_extract.py / ordering_classify.py)."""
from ordering_classify import BB_SLOT, tag_item
from ordering_extract import extract_all

BB_REAL = set(BB_SLOT) | {"part a", "part b", "part c", "part d", "part e", "speed", "strength"}


def _is_real_label(x):
    return isinstance(x, str) and x.strip().lower() in BB_REAL


def tag_sessions(sessions=None):
    sessions = sessions if sessions is not None else extract_all()
    # BASEBALL: borrow slot labels for weeks whose label column holds the previous day's exercises
    bb = [s for s in sessions if s["tab"] == "BASEBALL"]
    by_key = {}
    for s in bb:
        dname = s["day"].split("'")[1]
        by_key.setdefault((s["track"], dname), []).append(s)
    from collections import Counter
    from ordering_extract import wb, val
    ws = wb("MASTER_MODEL")["BASEBALL"]

    def hdr_row(x):
        return int("".join(ch for ch in x["day"].split(" ")[0] if ch.isdigit()))

    def n_real(x):
        return sum(1 for it in x["items"] if _is_real_label(it["slot"]) and
                   not it["slot"].strip().lower().startswith("part"))

    own_real = {x["sid"]: n_real(x) for x in bb}
    for s in bb:
        if own_real[s["sid"]] >= 3:
            continue
        dname = s["day"].split("'")[1]
        donors = [d for d in by_key[(s["track"], dname)] if d is not s and own_real[d["sid"]] >= 3 and
                  hdr_row(d) == hdr_row(s)]
        if not donors:
            continue
        s["label_borrowed_from"] = [d["sid"] for d in donors]
        for it in s["items"]:
            if _is_real_label(it["slot"]) and not it["slot"].strip().lower().startswith("part"):
                continue
            votes = Counter()
            for d in donors:
                lab = val(ws, it["row"], d["label_col"])
                if _is_real_label(lab) and not lab.strip().lower().startswith("part"):
                    votes[lab.strip()] += 1
            if votes:
                lab, n = votes.most_common(1)[0]
                it["slot_original"] = it["slot"]
                it["slot"] = lab
                it["slot_borrowed"] = f"modal label of row {it['row']} across {len(donors)} sibling weeks ({n} votes)"
    for s in sessions:
        kind = None
        if s["book"] == "BYOP":
            kind = "byop"
        elif s["tab"] == "BASEBALL":
            kind = "baseball"
        elif s.get("track", "") and "HYBRID" in (s.get("track") or ""):
            kind = "hybrid"
        for it in s["items"]:
            tag_item(it, s["tab"], kind)
    return sessions


if __name__ == "__main__":
    ss = tag_sessions()
    from collections import Counter, defaultdict
    untagged = Counter()
    mapping = defaultdict(set)
    for s in ss:
        for it in s["items"]:
            if it["text"] is None and s["book"] != "BYOP":
                continue
            if not it["tags"]:
                untagged[(s["tab"], str(it["text"]), str(it["slot"]))] += 1
            mapping[str(it["text"])].add("+".join(it["tags"]) + "@" + str(it["tag_source"]))
    print("UNTAGGED:")
    for k, v in sorted(untagged.items()):
        print(v, k)
    import sys
    if len(sys.argv) > 1:
        for k in sorted(mapping, key=str.lower):
            print(f"{k[:90]!r:95} -> {sorted(mapping[k])}")
