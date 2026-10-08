# -*- coding: utf-8 -*-
"""Render 04_athlete_profiles.md + 04_profiles.json (v1 = coach answers applied).
v0 sources are frozen in v0/ ; this script reads build_profiles (v1) which reads profiles_v1 (overlay on profiles_data)."""
import ast, json, os, sys, io, contextlib
HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
with contextlib.redirect_stdout(io.StringIO()):
    import build_profiles as B
D = B.D
PROFILES, OBS = B.PROFILES, B.OBS
OUT_MD = os.path.join(B.OUTDIR, "04_athlete_profiles.md")
OUT_JSON = os.path.join(B.OUTDIR, "04_profiles.json")


def v0_literal(name):
    for n in ast.parse(open(os.path.join(HERE, "v0", "render.py")).read()).body:
        if isinstance(n, ast.Assign) and isinstance(n.targets[0], ast.Name) and n.targets[0].id == name:
            return ast.literal_eval(n.value)
    raise KeyError(name)


V0_QUESTIONS = v0_literal("QUESTIONS")
VERIFICATION_LOG_INTRO = v0_literal("VERIFICATION_LOG_INTRO")
VERIFICATION_RECOMPUTED = v0_literal("VERIFICATION_RECOMPUTED")
VERIFICATION_LOG = v0_literal("VERIFICATION_LOG")


def fmt(x):
    if x is None: return "-"
    if isinstance(x, float):
        return ("%.1f" % x).rstrip("0").rstrip(".") if x != int(x) else str(int(x))
    return str(x)


def rng(a):
    if isinstance(a, (list, tuple)) and len(a) == 2: return f"{fmt(a[0])}-{fmt(a[1])}"
    return fmt(a)


def table(head, rows):
    out = ["| " + " | ".join(head) + " |", "|" + "---|" * len(head)]
    for r in rows:
        out.append("| " + " | ".join(str(c).replace("|", "/").replace("\n", " ") for c in r) + " |")
    return "\n".join(out)


PW = {p["id"]: p for p in PROFILES}
PM = B.POWER

HEADLINES = [
    "COACH-ANSWER ATH-01 / CAT-10: what decides plyos vs ballistics is how long the sport keeps the athlete on the ground - short contacts (sprinters) -> more plyos, long contacts (karate, fighters, baseball) -> more ballistics, basketball 'a good mix'; programs start ballistic and become plyometric. v1 encodes a `ground_contact` class (1-5) per sport and derives the plyo share of power sets (PROPOSED map 75 / 60 / 50 / 40 / 25%, floor 20, ceiling 80). OBSERVED anchors from a re-count of his own programs by ground contact: BASEBALL blocks 44% / 36% / 44% plyo side, BOXER weeks 3-6 30%, MM athletic STARTING / MID / ADVANCED 33% / 8% / 9% (throw-dominant).",
    "COACH-ANSWER ATH-02 (ranking confirmed): basketball = volleyball > sprinters > football skill > soccer > MMA > tennis > baseball > hockey > wrestling / BJJ > boxing = karate > golf. v1 applies it to FAST-reactive plyometric contacts (the ground-contact definition): the boxer's 113-129 weekly jump contacts are mostly ballistic jumps (66) and landings (24), only 31 are fast-reactive, below baseball's 37 / 58 / 74 - so the coach's own programs agree with his ranking once contacts are classified his way. Targets follow the ranking by construction (section 5.12).",
    "COACH-ANSWER UNI-02 / UNI-03 / UNI-10: bilateral : unilateral runs from 90/10 to 10/90 by athlete, goal, phase and pain - bodybuilders / powerlifters about 50/50 at the start then 80/20-90/10 bilateral, field / change-of-direction athletes 80-90% unilateral, bilateral minimal in season; unilateral = health and rotational foundation, bilateral = driving force; upper body the same. OBSERVED today: 26-32% unilateral in strength / conjugate, ~50% in the BYOP 4-day templates, 43-47% in baseball (every block, including in-season), 50-75% in the MM athletic blocks, 63% HYBRID. v1 sets block-start / block-end / in-season values per profile (section 5.11).",
    "COACH-ANSWER CAT-13 / UNI-12 / UNI-06: contralateral loading pulls you INTO the hip (change-of-direction athletes: football, soccer, basketball, tennis), ipsilateral helps you OUT of the hip (sprint acceleration - ipsilateral step-ups); for bodybuilders / powerlifters contra/ipsi work is a health accessory mostly in weeks 1-4. Court and combat athletes get more frontal / transverse unilateral work, aesthetics clients little. Same-pattern pairing (squat + lunge) drives a muscle harder (aesthetics, high-level athletes); cross-pattern pairing keeps bootcamp clients less sore.",
    "COACH-ANSWER ATH-05 / EQ-06: medball volume is high for baseball, boxing, MMA, tennis and golf, moderate for basketball and football, and NONE in the main workout for aesthetics clients (warm-up only); balls never over 20 lb. OBSERVED volumes: 176-192 throws/week in baseball (block means; single weeks 70-290; 45-63% transverse), 190 -> 380 for the boxer, 210 -> 400 -> 420 in the MM athletic blocks (210 and 420 ASSUMED from 'ALL LIST'), 64-96 in the BYOP athletic template at 2 sets.",
    "COACH-ANSWER ATH-10 / ATH-12 / ATH-09: everyone in athletic training gets Olympic lifts (L1: DB/KB snatches, hex-bar jumps, hang pulls / cleans without bumpers; L2+: full 'Squat' lifts), youth may do some from the floor; contrast / complexes only for L2+ athletes in the off-season at ~78-85%. v1 raises the Olympic dose where it was optional or zero (baseball 0.6 -> 8 sets, golf, soccer, tennis, karate, BJJ, youth, distance runners).",
    "COACH-ANSWER ATH-07 / ORD-09: aerobic sessions per week = 3 for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics / bodybuilders plus long walks after workouts; fighters get a real aerobic block, not a warm-up. OBSERVED today: physique colour C 2x/week; fat loss C 2x + 2 metabolic circuits (12 -> 33 min work); boxer one A + one C; baseball only short A-type buy-outs (10-39 s, 3-4 bouts/week); HYBRID one A + one C; CrossFit 2-4 by level + 1-4 WODs.",
    "COACH-ANSWER ATH-04: boxers REDUCE pressing and arm volume when punching volume is high - 'don't completely cut it'. OBSERVED: the boxing tab removed horizontal push, vertical pull and arm isolation in weeks 3-8; v1 keeps HPUSH 3, VPULL 3 and 2 + 2 arm sets in the boxing budget and applies the same reduce-not-cut rule to the other strikers.",
    "COACH-ANSWER PER-08: in season, speed athletes sprint, most others maintain strength, some keep high jumps; about 2 lifting days, bilateral minimal, 2 aerobic sessions. OBSERVED (BASEBALL; season labels INFERRED from dates): off-season = new menu every week, '12/10/8/8', OLY late; pre-season = +47% jump contacts, x3 sprint sets, contrast complexes, OLY 75 -> 90%, resistance flat then +2.6 / +3.8 / +3.7% per week, DELOAD (-31% resistance, -46% all sets); in-season = flat 4 x 10, no compound below 8 reps, no Olympic lifts, two alternating proven menus.",
    "COACH-ANSWER ATH-09 / GEN-02: no rule depends on sex - age, foundation (training experience), goal and injuries decide. v1 removed the female-athlete landing rule, the softball 'female populations' rationale and the sex-based bone-stress list. Older clients get few plyos unless they ask; older, injured and high-volume clients collect volume on constrained machines and never get the overhead squat, snatch, low-bar squat or depth jumps (EQ-03).",
    "COACH-ANSWER PRG-09: high school, college and pro athletes need the same things; loads and speeds change, pros get more care (contracts), college athletes adapt as much as they can, high school athletes 'just have to do a lot of work'. Competition level is therefore a modifier on loads and progression, not a separate profile.",
    "COACH-ANSWER ATH-13: the 'Justice League' tab was a marketing name for a weekend-warrior program (non-competitive athletic adults and youth). The profile is now 'All-around athletic / weekend warrior' (`weekend_warrior`), and it is also where recreational players of any sport land (GEN-02).",
    "OBSERVED athletic share of weekly working sets (excluding medball throws): 0% in every physique, bootcamp and fat-loss template and - after COACH-ANSWER ORD-08 (A-drills are warm-up) - 0% in the gym UPPER/LOWER and PPL examples too; 5% strength/conjugate (one 3x6 'EASY' plyo); 16% HYBRID; 16-22% BASEBALL; 32% BYOP athletic at the coach's 2-sets dose; 28% -> 19% -> 15% across the MM athletic STARTING / MID / ADVANCED blocks; 36% for the boxer's conversion weeks.",
    "OBSERVED + INFERRED: the BYOP templates share one resistance skeleton (knee + pull / hip + push, bilateral -> unilateral -> isolation, every pattern 2x/week - pairing confirmed by UNI-11 / ORD-06) and swap the PREFIX: athletic slots for athletes, calves / biceps / triceps for physique, cardio slots for bootcamp. BASEBALL (Parts A-E) and BOXING (3x10 base -> complexes) are structurally different programs that reuse the same 8-pattern vocabulary, so 'one skeleton, many dials' is an INFERRED modelling choice.",
    "COACH-ANSWER VOL-09 / VOL-10 / UNI-01 / VOL-17: helpers get 0.25 set (not 0.5), a 10/10 unilateral set is 1 set credited mainly to the primary muscle, athletic sets never count toward muscles, calves get 3 sets every leg day, rear delts their own sets and athletes about 2 core exercises a session. The per-muscle table (5.6) is recomputed with the 0.25 map; weekly budgets now carry the calves / rear-delt / core sets the coach says he always had athletes do but never wrote.",
    "COACH-ANSWER ATH-11: core goes FIRST, as the warm-up, for everybody (movable after the plyos or the strength block if the user prefers) - replacing the v0 reading (BYOP core on optional days; BASEBALL core second; MM STARTING first / second / last). OBSERVED core-by-plane: BASEBALL rotates 'LATERAL CORE' (Mon), 'Transverse core' (Tue/Fri), 'Sagital core' (Thu) -> 48% transverse, 24% sagittal, 22% frontal sets.",
    "COACH-ANSWER ATH-06 / LIB-21: the route-tree COD names are for every athlete, tiered by turn angle, and MACH drills plus the fixed speed-session order go into the library. OBSERVED: change of direction is zero in every MASTER_MODEL program; only the BYOP athletic template has COD (4 slots/week = 48-64 cuts at 2 sets); sprinting has no BYOP slot.",
    "OBSERVED: 'level' moved volume in opposite directions by population - athletes STARTING -> MID -> ADVANCED: working sets -19% and -18%, jump contacts -51% and -55%, throws +90% and +5%; gym clients NOVICE -> NEWBY -> INTERMEDIATE: weekly sets +18-23% and +13-14%. COACH-ANSWER PRG-04 says STARTING / MID / ADVANCED are blocks or levels 'depending on whatever is needed', PRG-05 defines L1-L3 by training experience in years, and PRG-06 asks for one sound rep/set algorithm for every model (the upper-day rep rise was a fill error).",
    "OBSERVED combat phasing (boxer): 2-week hypertrophy base (3 x 10 on all 8 patterns, no plyos) -> 6-week conversion (exercise list replaced, contrast complexes of the 'ALL ABOUT SQUATS' 'FRENCH CONTRAST' type - the boxing tab never uses that term, 2-week steps, wk 7 accessory mini-deload while the hinge complex / clean & press / row superset rise 3 -> 4 -> 6 sets, wk 8 peak). Steps and waves for fight prep are confirmed (PER-10).",
    "OBSERVED injury logic the coach already uses (and confirmed by VOL-03 / UNI-08 / EQ-03): joint pain -> unilateral and split grips (DB/KB) first, cut the pattern 30-50%, machines, or drop the exercise; throwers press mostly with DBs / landmine / single-arm (barbell overhead pressing appears 3 times in the baseball year); Copenhagen planks appear in the athletic, boxing and baseball programs. SCIENCE adds Nordics (-51% hamstring injuries), Copenhagen (-41% groin problems), landing-first neuromuscular training (about -50% non-contact ACL injuries), jumper's-knee volume caps (44.6% prevalence in volleyball, 31.9% in basketball).",
    f"MATRIX v1: {len(PROFILES)} profiles and {sum(len(p.get('variants', [])) for p in PROFILES)} position/phase variants, each a weekly set budget per category (PLYO, JLK, BALL, THROW, COD, SPRINT, TE, 8 resistance patterns, isolations, CORE, FOCUS) so shares, muscle sets, plyo:ballistic split and contact checks are computed, not asserted. Off-season main days land at {min(p['derived']['avg_sets_per_main_day_if_all_on_main_days'] for p in PROFILES):g}-{max(p['derived']['avg_sets_per_main_day_if_all_on_main_days'] for p in PROFILES):g} sets and an estimated {min(p['derived']['est_minutes_per_main_day'] for p in PROFILES)}-{max(p['derived']['est_minutes_per_main_day'] for p in PROFILES)} minutes (PROPOSED time heuristic), inside the coach's 1.5 h (max 2 h) athlete cap; the general-population profile sits at about {PW['general_population']['derived']['est_minutes_per_main_day']} min against the 45-60 min general cap (UNI-09).",
    "Library gaps the profiles need: a SPRINT slot and MACH drills (confirmed LIB-21), a plyo / ballistic / landing tag on every athletic item (new, ATH-01), REPS units for contacts / metres / seconds / per-side, neck exercises, CARRY and DRAGS items (confirmed LIB-19), a rear-delt slot (VOL-17), frontal / transverse lower-body moves (LIB-20), reactive agility drills and equipment tags.",
]

V0_Q_STATUS = [
    ("ANSWERED - ATH-01 / ATH-02", "The ranking is about fast-reactive plyometric volume; the boxer example sits at the top of the boxing band (31 fast-reactive contacts/week), its other contacts are ballistic jumps and landings."),
    ("ANSWERED (ranking) / PROPOSED (numbers) - ATH-02", "Basketball and volleyball top; targets re-anchored on the plyometric dial (basketball 100-140, MMA 55-80, karate 15-30 fast-reactive contacts/week) - numbers pending approval."),
    ("ANSWERED - ATH-01", "Fewer plyos for boxers / karate = more ballistics because they stay on the ground; low-amplitude bounce stays sport-practised."),
    ("ANSWERED - LIB-21 / PER-08", "MACH drills and acceleration starts go into the library; speed athletes sprint in season."),
    ("PARTLY - ATH-06", "Route-tree names for every athlete, tiered by turn angle; a reactive-agility list is still open."),
    ("ANSWERED - ATH-05 / LIB-22", "Throws by sport (high / moderate / none); a slot can be the whole ~19-throw list at 1 x 10."),
    ("ANSWERED - ATH-04", "Reduce, not cut, pressing / arm volume when punching volume is high."),
    ("ANSWERED - ATH-08", "Pitchers: less overhead pressing, more arm care, light rotational throws. Catchers remain INFERRED."),
    ("ANSWERED - PER-08", "About 2 lifting days in season; content by athlete type. Subtracting game jumps stays INFERRED."),
    ("ANSWERED - VOL-10", "Athletic sets never count toward muscles."),
    ("PARTLY - PRG-04 / PRG-06", "STARTING / MID / ADVANCED = blocks or levels as needed; one sound algorithm for every model."),
    ("PARTLY - ATH-11 / CAT-08", "Core first for everybody; plane rotation by day not asked - still open."),
    ("ANSWERED - ATH-07", "3 / 2 / 4 sessions (+ walks); lactate-clearance sports still open."),
    ("ANSWERED - ATH-09", "No sex-based rules; landing work by competency and injury history."),
    ("OPEN", "Youth maturation input not asked; ATH-09 allows some Olympic lifts from the floor."),
    ("PARTLY - LIB-19", "Carries and drags confirmed; a neck column was not asked."),
    ("OPEN", "Template choice for golf / tennis / hockey not asked."),
    ("ANSWERED - PRG-12", "Chris Hinshaw plan as-is, half marathon only."),
    ("PARTLY - GEN-02 / ATH-08", "Competitive athletes give sport + position + season; only the pitcher split is confirmed."),
    ("ANSWERED - PRG-09", "Calendars are 'just whatever I wrote'; high school = college = pro."),
]


def evidence_short(p):
    if p["evidence"].startswith("OBSERVED"):
        return "OBSERVED + INFERRED/ASSUMED parts" if any(w in (p["evidence"] + " " + p.get("weekly_sets_note", "")).upper() for w in ("INFERRED", "ASSUMED", "PARTIAL", "ILLUSTRATIVE")) else "OBSERVED"
    if p["id"] == "weekend_warrior":
        return "COACH-ANSWER + OBSERVED template"
    return "INFERRED (observed analog)" if "OBSERVED" in p["evidence"] else "INFERRED"


def bu_str(p):
    bu = p.get("bilateral_unilateral", {})
    if "block_start" not in bu: return "observed"
    s, e, i = bu["block_start"], bu["block_end"], bu["in_season"]
    return f"{s[0]}/{s[1]} -> {e[0]}/{e[1]}" + (f" (in-season {i[0]}/{i[1]})" if i else "")


def build_md():
    L = []
    A = L.append
    A("# Athlete & goal profiles: how emphasis changes by sport and goal (v1)")
    A("")
    A("Deliverable 04 of the Blaze Camp model synthesis, **version v1 (2026-10-08): the coach's questionnaire answers (`coach_answers_full.md`, 138 of 140 answered) are applied and override every earlier inference from the sheets.** Companion machine-readable file: `04_profiles.json` (same folder). Inputs: every program decode under `analysis/programs/`, the library, reference and equipment decodes, and the coach answers. Numbers are recomputed by script: `synthesis/_build_04/` (`python3 render.py` regenerates both files; `profiles_v1.py` holds every v1 change on top of the frozen v0 data in `profiles_data.py`; `v1_power_mix.py` re-counts the coach's athletic work by ground contact; the v0 scripts and outputs are frozen in `_build_04/v0/`). Nothing in Google Sheets was opened for writing.")
    A("")
    A("## v1 - coach answers applied")
    A("")
    A("Every change below cites the question ID in `coach_answers_full.md`. Where the coach confirmed a direction but not the numbers, the numbers are marked **PROPOSED - PENDING COACH APPROVAL**.")
    A("")
    A(table(["question ID(s)", "what changed in this document"], [[k, v] for k, v in D.V1_CHANGELOG]))
    A("")
    A("**Still pending (not decided by the answers):**")
    A("")
    for x in D.V1_PENDING: A("* " + x)
    A("")
    A("New questions these answers raise are in section 11.2.")
    A("")
    A("## 0. How to read this")
    A("")
    A("* Evidence labels: **OBSERVED** = read from the coach's sheets (tab + cell or decoded program). **COACH-ANSWER <ID>** = the coach's questionnaire answer (authoritative). **INFERRED** = analyst reasoning. **SCIENCE** = external literature (section 12, [S#]). **PROPOSED** = analyst proposal grounded in science or the coach's own numbers, PENDING COACH APPROVAL.")
    A("* Coach labels are quoted verbatim with their typos ('TRIPPLE', 'SAGITAL', 'ABdution', 'DOMNANT', 'CLERANCE'); our own names use correct spelling. The BYOP tab named 'JUSTICE LEAGUE' is called the **weekend-warrior tab** here (a marketing name - COACH-ANSWER ATH-13).")
    A("* **Unit of work = one working set** (a movement inside a superset/complex counts its own sets; one medball throw line of 10 = 1 set; a 10/10 per-side set = 1 set - COACH-ANSWER UNI-01 / PRG-07). Shares are % of weekly working sets. Athletic share is shown with and without throws.")
    A("* **Conditioning is not in sets.** It is counted in sessions per week by colour: **A** blue short/high, **B** green moderate 1-3 min, **C** orange long/low, **LC** lactate clearance ('AEROBIC CAPACITY CHEAT SHEET'); session counts per population are COACH-ANSWER ATH-07.")
    A("* **Power work (v1)** = PLYO + JLK (plyometric side: short ground contact, incl. the landings that teach it) + BALL + THROW (ballistic side: long contact or single effort). The plyo share of power sets is the dial the coach's ground-contact rule controls (ATH-01).")
    A("* **Category codes** (the coach's slot grammar): " + "; ".join(f"`{k}` = {v}" for k, v in D.CAT_LABELS.items()) + ".")
    A("* **Nominal reps** (used only to check that a set budget lands in its tier): " + "; ".join(f"{k} {v[0]} ({v[1]})" for k, v in D.NOMINAL.items()) + ". Plyometric contacts = PLYO sets x 8 x (1 - landing share). OBSERVED profiles carry their observed counts.")
    A("")
    A("## 1. Headline findings")
    A("")
    for i, h in enumerate(HEADLINES, 1):
        A(f"{i}. {h}")
    A("")
    # ---------------- section 2 observed
    A("## 2. OBSERVED: what each population actually gets in the coach's programs")
    A("")
    A("### 2.1 Share of weekly working sets")
    A("")
    A("Representative programs (BYOP templates at the stated set assumption; MASTER_MODEL programs as written, with the decode's assumptions where a cell was blank). Lower uni % = unilateral share of lower-body compound sets. v1: the MM UPPER/LOWER and PPL rows exclude their A-drill sets from the totals (A-drills are warm-up, not volume - COACH-ANSWER ORD-08).")
    A("")
    rows = []
    for o in OBS:
        s = o.get("share_pct", {})
        if not s: continue
        rows.append([o["program"], o["population"], fmt(o["weekly_sets"]), fmt(s.get("athletic_excl_throws")), fmt(s.get("athletic_incl_throw_sets")), fmt(s.get("resistance_compound")), fmt(s.get("resistance_isolation")),
                     fmt(s.get("core")), fmt(s.get("focus")), fmt(o.get("unilateral_pct")), "/".join(fmt(x) for x in o.get("knee_hip_sets", [])), "/".join(fmt(x) for x in o.get("push_pull_sets", [])), fmt(o.get("compound_to_isolation"))])
    A(table(["program", "population", "weekly sets", "athletic % excl. throws", "athletic % incl. throw-sets", "compound %", "isolation %", "core %", "focus %", "lower uni %", "knee/hip sets", "push/pull sets", "compound:iso"], rows))
    A("")
    A("Reading (INFERRED): three clusters. (1) **Physique / fat loss / bootcamp / gym**: no athletic work, isolation 19-47% of sets, core optional or circuit-only (v1: core goes first for everybody - ATH-11). (2) **Strength / CrossFit strength months**: 80-90% compound. (3) **Athletes and fighters**: athletic work 15-36% of non-throw sets plus large throw volumes; strikers' pressing reduced (v1: reduced, not cut - ATH-04).")
    A("")
    A("### 2.2 Athletic dose by sub-type (weekly)")
    A("")
    rows = []
    for o in OBS:
        mix = o.get("athletic_sets_by_type", {})
        rows.append([o["program"], ", ".join(f"{k} {fmt(v)}" for k, v in mix.items()) or "-", o.get("contacts_wk", "-"), o.get("throws_wk", "-"), o.get("cod_wk", "-"), o.get("sprint_wk", "-"), o.get("triple_ext", "-")])
    A(table(["program", "athletic sets by type (decode buckets)", "lower-body jump contacts / week", "medball throws / week", "COD", "sprint", "triple extension / Olympic"], rows))
    A("")
    A("**BASEBALL plyo / throw / core mix (OBSERVED, per training week, recomputed from the decode's 865 prescription rows (911 entries incl. 46 label-only rows); deload and recovery weeks excluded):**")
    A("")
    A(table(["block (season)", "jump contacts (v0 'high-amplitude')", "low-amplitude contacts", "vertical / horizontal / lateral contacts", "unilateral contacts", "landings", "throws sagittal / transverse", "core sets frontal / sagittal / transverse"],
            [["B1 off-season (7 wk)", "102.6", "96.6", "146.6 / 38.3 / 14.3", "70.6", "14.3", "97.9 / 80.0", "2.1 / 3.1 / 5.6"],
             ["B2 pre-season (7 wk)", "151.4", "89.3", "200.4 / 28.9 / 11.4", "97.7", "12.9", "70.6 / 121.7", "3.7 / 3.1 / 7.3"],
             ["B3 in-season (8 wk)", "135.1", "66.2", "134.1 / 35.5 / 31.8", "78.4", "12.6", "69.8 / 106.5", "3.6 / 4.2 / 8.1"],
             ["all training weeks (share)", "61%", "39%", "75% / 16% / 9%", "39%", "6%", "43% / 57%", "22% / 24% / 48% (+6% unspecified)"]]))
    A("")
    A("Classification rules (INFERRED, keyword based): lateral = 'lateral', 'side to side', 'skater'; horizontal = 'broad', 'bound', 'forward', 'hurdle', 'march jump'; unilateral = single leg / split / staggered / lunge / RFE / FFE / march / bound; low-amplitude = the JUMPING LIMITED KNEE bucket, ankle hops, squirrel jumps. Upper-body plyo push-ups (230 contacts over the year) are excluded.")
    A("")
    A("### 2.3 Conditioning and core as written")
    A("")
    A(table(["program", "conditioning (colour per AEROBIC CAPACITY CHEAT SHEET)", "core"], [[o["program"], o.get("conditioning", "-"), o.get("core_detail", "-")] for o in OBS]))
    A("")
    A("### 2.4 Phase, level and season evidence (OBSERVED)")
    A("")
    A(table(["source", "what changes", "numbers"], [
        ["MM athletic STARTING -> MID -> ADVANCED ('First 8 weeks (8wk1) adaptation focus' ...); blocks or levels 'depends on whatever is needed' (PRG-04)", "volume down, intensity/specificity up", "working sets 89 -> 72 -> 59; resistance 44 -> 44 -> 24; jump contacts 146 -> 71 -> 32; low 0 -> 120 -> 100; throws 210 -> 400 -> 420 (210/420 ASSUMED from 'ALL LIST'); core 20 -> 14 -> 26; deadlift 3x6 -> 2x6-8 -> 3x1 '1RIR'"],
        ["MM UPPER/LOWER NOVICE -> NEWBY -> INTERMEDIATE", "volume up", "weekly resistance sets 76 -> 90 -> 102; lower compounds 2x12 -> 3x10 -> 4x8; upper compounds 3x8 -> 3x10 -> 4x12 (PRG-06: 'probably a fill error'); isolation 2-3 x 20 / 'MAX REPS' fixed"],
        ["MM PPL NOVICE -> NEWBY -> INTERMEDIATE", "volume up; most reps down", "sets per rotation 47 -> 58 -> 66; push/pull compounds 3x15 -> 3-4x10 -> 4x8 except pull-ups 3x15 -> 4x10 -> 5x12 and dips 3x8 -> 3x10 -> 4x'MAX'; legs 2x8 -> 3x10 -> 4x8"],
        ["BOXER wk1-2 -> wk3-8", "base -> conversion", "working sets (excl. throws) 80 -> 113 / 113 / 117 / 117 / 104 (wk7) / 136 (wk8); resistance 66 -> 50-68; athletic 0 -> 38-48; throws 190 -> 380; contacts 0 -> 258-306; sprint rounds 0 -> 5,5,6,6,7,8"],
        ["BASEBALL Block 1 -> 2 -> 3 (season reading INFERRED from dates)", "build -> intensify -> maintain", "AP_PLYO sets 9 -> 16.3 -> 14.6; sprint sets 1 -> 3.1 -> 1.8; throws 178 -> 192 -> 176; resistance sets/week ~72 -> 74-84 -> 64-76; main lifts '12/10/8/8' -> '8/6/4/4','6/6/5/4' -> 4x10; plyo side of power sets 44% -> 36% -> 44% (v1 re-count)"],
        ["BASEBALL B2 DELOAD WEEK", "deload recipe (PER-05 confirmed: about half the sets)", "resistance 84 -> 58 (-31%); all sets 151 -> 82 (-46%); athletic 1-2 sets; no buy-out; no OLY; everything 3 x 8"],
        ["CROSSFIT macro A10:M17", "quality sequencing", "RESISTANCE -> STRENGTH -> POWER -> TEST per ~4-month block; aerobic & WOD levels 1 -> 4 inside each block"],
        ["4 TRACKS plan shapes (A1 '8 WEEKS OF 3 TRACKS PROGRAMMING EXAMPLE - ONGOING TRAINING')", "8- and 12-week products (PER-01 replaces their shape - section 8)", "8 wk = 7 loading + deload/test; 12 wk = 6 + 'MID DELOAD' / 'A WEEK LOWER' + 5; weekly set growth +4.75-5.2% (12-wk tracks)"],
    ]))
    A("")
    A("### 2.5 The plyo question - answered by the coach")
    A("")
    A("v0 asked whether the boxer's 113-129 jump contacts/week were 'a lot' (open questions 1-3). The coach answered with a different dial (COACH-ANSWER ATH-01): plyo vs ballistic depends on how long the sport keeps the athlete on the ground; fighters, karate and baseball players get more ballistics, sprinters more plyos, basketball a good mix; 'both of those ranges are important'. Re-counting his written programs by ground contact (section 2.6) shows his own programs already follow that rule: the boxer's high-amplitude contacts are mostly ballistic jumps and landings, and the fast-reactive part (31/week) is below the baseball blocks (37-74), matching his ranking boxing < baseball (ATH-02). The v0 high / low amplitude split stays as a separate dial: low-amplitude squirrel jumps and rope (1,227 contacts/week for the boxer) are plyometric (the fastest SSC) but stiffness work, not jumping volume.")
    A("")
    A("### 2.6 Ground-contact re-count of the coach's athletic work (v1)")
    A("")
    A("OBSERVED sets and reps per week from the decode JSONs; the class of each exercise is INFERRED by keyword from the coach's rule (`v1_power_mix.py`): RECEIVE = landings / sticks (plyo method stage 1); PLYO = short-contact reactive (stage 2-3; low = ankle hops, squirrel jumps, plate hops, rope; upper = plyo push-ups); BALLISTIC = medball throws + loaded / single-effort jumps. Sprint, Olympic and COD work are outside the split.")
    A("")
    rows = []
    for key, lab in [("baseball_B1", "BASEBALL B1 (off-season, 7 wk)"), ("baseball_B2", "BASEBALL B2 (pre-season, 7 wk)"), ("baseball_B3", "BASEBALL B3 (in-season, 8 wk)"), ("boxing_wk3_6_mean", "BOXER weeks 3-6"),
                     ("mm_ath_starting", "MM athletic STARTING"), ("mm_ath_mid", "MM athletic MID"), ("mm_ath_advanced", "MM athletic ADVANCED")]:
        m = PM[key]
        g = lambda k, f="sets": fmt((m.get(k) or {}).get(f, 0))
        rows.append([lab, f"{g('RECEIVE')} ({g('RECEIVE', 'reps')})", f"{g('PLYO_high')} ({g('PLYO_high', 'reps')})", f"{g('PLYO_low')} ({g('PLYO_low', 'reps')})", f"{g('PLYO_upper')} ({g('PLYO_upper', 'reps')})",
                     f"{g('BALLISTIC_jump')} ({g('BALLISTIC_jump', 'reps')})", f"{g('BALLISTIC_throw')} ({g('BALLISTIC_throw', 'reps')})", f"{m.get('plyo_side_pct_of_power_sets')}%"])
    A(table(["program", "landings sets (reps)", "fast-reactive high sets (contacts)", "low-amplitude sets (contacts)", "upper plyo sets (contacts)", "ballistic jump sets (reps)", "throw sets (throws)", "plyo side of power sets"], rows))
    A("")
    A("Reading: the coach's baseball year sits at 36-44% plyo (more ballistics and rotation, as he says for baseball), the boxer at 30% (more ballistics for a fighter), and the generic MM athletic blocks become MORE ballistic as they advance because the throw lists grow (33% -> 8% -> 9%) - the opposite of his within-program rule 'start more ballistic, then more plyometric' (CAT-10), so v1 follows the rule, not that ladder.")
    A("")
    # ---------------- section 3 rules
    A("## 3. Profile calculus v1 (COACH-ANSWER rules first, then INFERRED)")
    A("")
    A("**Confirmed by the coach:**")
    A("")
    A("1. **Ground contact sets the plyo : ballistic split** (ATH-01, CAT-10); programs start ballistic and become plyometric; plyo method stages receive & pause -> receive then create -> repeated receive / create (not a 'plyo zone', CAT-11); unilateral plyos are harder (CAT-10).")
    A("2. **Bilateral : unilateral on the 90/10 <-> 10/90 scale** by goal, phase and pain (UNI-02 / UNI-03 / UNI-10); contralateral for change of direction, ipsilateral for acceleration, contra/ipsi as early-block health accessories for size/strength (CAT-13); more frontal / transverse unilateral for court and combat athletes (UNI-12).")
    A("3. **Same-pattern vs cross-pattern pairing is a goal rule** (UNI-06); hip-dominant + push, knee-dominant + pull everywhere (UNI-11, ORD-06).")
    A("4. **Medball by sport, none for aesthetics, <= 20 lb** (ATH-05, EQ-06); **Olympic lifts for every athletic trainee by level** (ATH-10); **contrast for L2+ off-season** (ATH-12).")
    A("5. **Aerobic sessions 3 / 2 / 4 (+ walks)** (ATH-07); fighters' opening cardio is a real block (ORD-09).")
    A("6. **Strikers reduce, never cut, pressing** (ATH-04); **pitchers: less overhead pressing, more arm care, light rotational throws** (ATH-08).")
    A("7. **No sex-based rules**; age, foundation, goal, injuries (ATH-09); older clients few plyos unless asked; older / injured / high-volume clients on constrained machines, never OHS / snatch / low-bar / depth jumps (EQ-03); youth some Olympic lifts from the floor (ATH-09).")
    A("8. **In season**: speed athletes sprint, most others maintain strength, some jump; about 2 lifting days; bilateral minimal (PER-08, UNI-10).")
    A("9. **Same needs across high school / college / pro**; loads, speeds and care differ (PRG-09).")
    A("10. **Resistance vs speed/power groups** (ATH-03): " + "; ".join(f"{v['label']}: {v['members']}" for k, v in D.ATH03_GROUPS.items()) + ".")
    A("")
    A("**Session rules from the answers** (they apply inside every profile):")
    A("")
    for s in D.SESSION_RULES: A("* " + s)
    A("")
    A("**INFERRED from the sheets (still valid):**")
    A("")
    A("1. **One skeleton, many dials** - a sport changes (a) which athletic slots precede the resistance block, (b) sets per slot, (c) which resistance slots are reduced or doubled, (d) exercise selection inside each slot (direction, laterality, plane, implement, contra/ipsi), (e) conditioning colours, (f) season multipliers.")
    A("2. **Upper and lower ballistics on different days** when athletic volume is high (OBSERVED BASEBALL Part A: 'Upper Ballistics/plyo' Mon/Thu, 'LOWER ballistics/plyo' Tue/Fri; MM MID/ADVANCED alternate jump days and medball days).")
    A("3. **Level per slot, not per person** (OBSERVED weekend-warrior tab mixes FOUNDATIONAL landings with ADVANCED power cleans; CAT-05 / CAT-06).")
    A("4. **Sport specificity mostly by selection and reduction**: rotational and frontal demand through exercise choice inside existing slots (baseball 'In-out of hip' scoops, Copenhagen, lateral step-ups 'IPSILATERAL loading'), pressing reduced for strikers, barbell bench never written for baseball, fat-loss jumping limited to circuit jacks / burpees.")
    A("")
    A("**Generator assembly steps (v1):**")
    A("")
    for s in B.ASSEMBLY: A(s)
    A("")
    A("**Level modifiers:**")
    A("")
    A(table(["ladder", "evidence", "per step", "rule"], [[k, v["evidence"], "; ".join(f"{a}: {b}" for a, b in v.get("per_step", {}).items()) or "-", v["rule"]] for k, v in B.LEVEL_MODIFIERS.items()]))
    A("")
    # ---------------- section 4 scales
    A("## 4. Tier scales (INFERRED boundaries, OBSERVED anchors)")
    A("")
    sc = D.SCALES
    rows = []
    for key, lab in [("plyometric_contacts_wk", "PLYOMETRIC contacts / week (fast-reactive, high amplitude) - the ATH-02 dial (NEW v1)"), ("plyo_high_contacts_wk", "ALL lower-body jump contacts / week (landings + plyometric + ballistic jumps; v0 'high-amplitude')"),
                     ("plyo_low_contacts_wk", "low-amplitude contacts / week"), ("throws_wk", "medball throws / week"), ("cod_cuts_wk", "planned cuts / week"), ("triple_ext_sets_wk", "triple-extension / Olympic sets / week")]:
        s = sc[key]
        rows.append([lab] + [rng(s[t]) for t in ("T0", "T1", "T2", "T3", "T4", "T5")] + ["; ".join(f"{a} = {fmt(b)}" for a, b in s["anchors"].items())])
    s = sc["sprint_m_wk_at_90pct"]
    rows.append(["sprint metres / week at >90%"] + [rng(s[t]) for t in ("T0", "T1", "T2", "T3", "T4", "T5")] + ["; ".join(f"{a} = {b}" for a, b in s["anchors"].items())])
    A(table(["dial", "T0", "T1", "T2", "T3", "T4", "T5", "observed anchors"], rows))
    A("")
    A("* " + sc["_note"])
    A("* Throws: " + sc["throws_wk"]["note"] + ".")
    A("* Plane need: " + "; ".join(f"{k} = {v}" for k, v in sc["plane_need"].items()) + ".")
    A("* Resistance rep zones: " + "; ".join(f"**{k}** {v}" for k, v in sc["resistance_rep_zones"].items()) + ".")
    A("* Conditioning colours: " + "; ".join(f"**{k}** {v}" for k, v in sc["conditioning_colours"].items()) + ".")
    A("")
    A("**Ground-contact classes (NEW v1).** Rule = COACH-ANSWER ATH-01; class per sport = INFERRED; plyo share per class = PROPOSED - PENDING COACH APPROVAL (floor " + str(D.GCT_FLOOR) + "%, ceiling " + str(D.GCT_CEIL) + "%). SCIENCE: " + D.SCIENCE_GCT + ".")
    A("")
    A(table(["class", "label", "typical contact", "sports (v1)", "plyo : ballistic of power sets (PROPOSED)"],
            [[k, v["label"], v["typical"], ", ".join(p["name"].split(" (")[0] for p in PROFILES if p["ground_contact"]["class"] == k), f"{D.GCT_PLYO_PCT[k]} : {100 - D.GCT_PLYO_PCT[k]}"] for k, v in D.GCT_CLASSES.items()]))
    A("")
    A("**Plyo method stages:** " + D.PLYO_METHOD_STAGES["name"] + ". " + " -> ".join(f"stage {s['stage']} '{s['label']}' ({s['examples']})" for s in D.PLYO_METHOD_STAGES["stages"]) + ". Rules: " + "; ".join(D.PLYO_METHOD_STAGES["rules"]) + ".")
    A("")
    # ---------------- section 5 matrix
    A("## 5. The sport / goal matrix (v1)")
    A("")
    A("Baseline = **off-season build** week, mid-block (bilateral share = the mid-point of the block-start and block-end values). Apply season multipliers (section 7), the plan-type shape (section 8) and the person-based weekly rate of the volume engine. 'Evidence' says where the weekly SET BUDGET comes from; the v1 adjustments listed in each card (section 6) are COACH-ANSWER rules, with doses marked PROPOSED where the coach gave a direction only. Plane-need scores, emphasis %, colour mixes and ranges are analyst classifications unless a cell or answer is cited.")
    A("")
    A("### 5.1 Dial overview")
    A("")
    rows = []
    for p in PROFILES:
        pl, th, cd, sp, te, rs = p["plyo"], p["throwing"], p["cod"], p["sprint"], p["triple_ext"], p["resistance"]
        d = p["derived"]; aer = p["aerobic_sessions_wk"]; pm = p["power_mix"]
        gc = p["ground_contact"]["class"]
        plyo_t = pl.get("plyometric_target_wk")
        rows.append([p["name"], evidence_short(p), gc or "-", (f"{pm['plyo_pct_target']}:{100 - pm['plyo_pct_target']} ({fmt(d['plyo_share_of_power_sets_pct'])}%)" if gc else "-"),
                     f"{pl['tier_plyometric'].split(' (')[0]} ({rng(plyo_t) if plyo_t is not None else '-'})", f"{pl['tier_high'].split(' (')[0]} ({rng(pl['high_contacts_wk'])})", rng(pl["low_contacts_wk"]),
                     f"{th['tier']} ({rng(th['throws_wk'])})", f"{cd['tier']} ({rng(cd['cuts_wk'])}{', reactive' if cd.get('reactive') else ''})", sp["tier"], f"{te['tier']} ({rng(te['sets_wk'])})",
                     (p["ath03_group"] or "-").replace("_", " "), bu_str(p), f"{p['planes']['frontal']}/{p['planes']['transverse']}", f"{fmt(aer['off_season_or_default']) if not isinstance(aer['off_season_or_default'], str) else 'see 5.8'} / {aer['in_season']}"])
    A(table(["profile", "evidence", "ground contact class", "plyo:ballistic target (v1 budget plyo %)", "plyometric tier (target contacts/wk)", "all jump contacts tier (/wk)", "low-amp contacts/wk", "throws tier (/wk)", "COD tier (cuts/wk)", "sprint", "Olympic / TE (sets/wk)", "ATH-03 group", "bilateral/unilateral % start -> end (in-season)", "plane need F/T (0-3)", "aerobic sessions/wk off / in season"], rows))
    A("")
    A("### 5.2 Weekly set budget per category (v1 encodable recipe)")
    A("")
    cats1 = D.CATS_ATH + D.CATS_RP
    cats2 = D.CATS_ISO + D.CATS_OTHER
    A(table(["profile"] + cats1, [[p["name"]] + [fmt(p["weekly_sets"].get(c, 0)) for c in cats1] for p in PROFILES]))
    A("")
    A("Compare profiles by **contacts / throws / cuts (5.4-5.5), not by set counts**: the OBSERVED boxer's PLYO sets are 5-rep jumps inside complexes and 8-rep landings, its 38 THROW sets are single-throw lines of 10; BASEBALL throw sets are mostly '10/10' per side (~20 throws per set). The OBSERVED profiles' PLYO / JLK / BALL split comes from the ground-contact re-count (2.6); INFERRED profiles use the nominal reps in section 0. The pre-v1 budgets are kept in the JSON as `weekly_sets_v0`.")
    A("")
    A(table(["profile"] + cats2 + ["total", "source"], [[p["name"]] + [fmt(p["weekly_sets"].get(c, 0)) for c in cats2] + [fmt(p["derived"]["weekly_sets_total"]), p["weekly_sets_source"].split(" (")[0] + (" + v1 adjustments" if p.get("v1_adjustments") else "")] for p in PROFILES]))
    A("")
    A("### 5.3 Computed weekly shares (from 5.2)")
    A("")
    rows = []
    for p in PROFILES:
        d = p["derived"]; s = d["share_pct"]
        rows.append([p["name"], fmt(d["weekly_sets_total"]), fmt(s["athletic"]), fmt(s["athletic_excl_throws_of_non_throw_sets"]), "/".join(fmt(s["ath_" + k]) for k in D.CATS_ATH), fmt(d["power_sets"]),
                     fmt(d["plyo_share_of_power_sets_pct"]) if p["ground_contact"]["class"] else "-", fmt(s["resistance_compound"]), fmt(s["resistance_isolation"]), fmt(s["core"]), fmt(s["focus"]),
                     fmt(d["unilateral_pct_of_lower_compound"]), fmt(d["pull_per_push"]), "/".join(fmt(x) for x in d["knee_hip_sets"]), fmt(d["avg_sets_per_main_day_if_all_on_main_days"]), fmt(d["est_minutes_per_main_day"])])
    A(table(["profile", "weekly sets", "athletic %", "athletic % excl. throws", "PLYO/JLK/BALL/THROW/COD/SPRINT/TE %", "power sets", "plyo % of power", "compound %", "isolation %", "core %", "focus %", "lower uni %", "pull per push", "knee/hip sets", "sets per main day (upper bound)", "est. min per main day (PROPOSED heuristic)"], rows))
    A("")
    A("Session-time heuristic (PROPOSED): 10 min warm-up + ~1.25 min per athletic or core set, ~2.5 min per compound set, ~1.5 min per isolation / focus set, all sets on main days. Every profile lands under the coach's 1.5 h athlete / bodybuilder / powerlifter session (max 2 h); the general and fat-loss profiles sit at or just under the 45-60 min general cap (UNI-09); supersets compress it further (ORD-05).")
    A("")
    A("### 5.4 Plyometrics by profile")
    A("")
    rows = []
    for p in PROFILES:
        pl = p["plyo"]; dd = p["derived"]["nominal_weekly_dose_from_sets"]; tc = p["derived"]["tier_check_from_sets"]
        obs = pl.get("plyometric_observed") or pl.get("observed")
        rows.append([p["name"], fmt(p.get("plyo_rank_ath02")), f"{pl['tier_plyometric']}: {rng(pl.get('plyometric_target_wk')) if pl.get('plyometric_target_wk') is not None else '-'}", f"{pl['tier_high']}: {rng(pl['high_contacts_wk'])}", rng(pl["low_contacts_wk"]),
                     "/".join(fmt(pl["direction_pct"].get(k, 0)) for k in ("vertical", "horizontal", "lateral")) if pl["direction_pct"] else "-",
                     fmt(pl["unilateral_pct"]), fmt(pl.get("landing_pct")), pl.get("phases", "-"), ", ".join(pl.get("tracks", [])) or "-",
                     ("observed: " + obs) if obs else f"sets x nominal = {dd['plyometric_contacts']} plyometric / {dd['jump_contacts_all']} all jumps / {dd['plyo_low_contacts']} low ({tc['plyometric']}/{tc['jump_contacts_all']}/{tc['plyo_low']})"])
    A(table(["profile", "ATH-02 rank", "plyometric target (fast-reactive)", "all jump contacts", "low-amplitude", "vertical/horizontal/lateral %", "unilateral %", "landing %", "force phases / method stages", "library tracks", "check"], rows))
    A("")
    A("### 5.5 Throwing, change of direction, sprint, Olympic lifts")
    A("")
    rows = []
    for p in PROFILES:
        th, cd, sp, te = p["throwing"], p["cod"], p["sprint"], p["triple_ext"]
        rows.append([p["name"], f"{th['tier']} {rng(th['throws_wk'])}", " ".join(f"{k[:3]} {v}" for k, v in th.get("plane_pct", {}).items()) or "-", f"{cd['tier']} {rng(cd['cuts_wk'])}; max '{cd.get('max_turn')}'; reactive {'yes' if cd.get('reactive') else 'no'}",
                     f"{sp['tier']} {rng(sp.get('m_wk'))} m; {sp.get('focus', '-')}", f"{te['tier']} {rng(te['sets_wk'])} sets (v1 budget {fmt(p['weekly_sets'].get('TE', 0))}); {te.get('ceiling', '-')}"])
    A(table(["profile", "throws / wk (ATH-05 tier)", "throw plane %", "COD (ATH-06: route names for every athlete)", "sprint", "Olympic / triple extension (ATH-10)"], rows))
    A("")
    A("Medball rules (COACH-ANSWER): " + "; ".join(f"{k}: {v}" for k, v in D.MEDBALL_RULE.items()) + ". Olympic lifts by level (COACH-ANSWER): " + "; ".join(f"{k}: {v}" for k, v in D.OLYMPIC_BY_LEVEL.items()) + ". " + D.CONTRAST_RULE + ".")
    A("")
    A("### 5.6 Resistance emphasis and computed weekly sets per muscle")
    A("")
    A("Per-muscle sets are COMPUTED from 5.2 with the v1 credit map: 1.0 to the main mover, **0.25 to helpers** (COACH-ANSWER VOL-09, was 0.5), unilateral knee-dominant = quads 1.0 + glutes 0.25 (UNI-01), athletic sets credit nothing (VOL-10). Targets per muscle come from the volume engine: beginner 10-12, intermediate 15-20, advanced 20+ sets/week, 15-20 = maintenance to some growth, 20-25 = growth, priority +4-6 (cap about 25-30), pain -30-50% (VOL-01 / VOL-02 / VOL-03). The 'target' column below is the v0 analyst band per profile (INFERRED); for athletes the coach notes field athletes 'don't need to get bigger and stronger that much' (UNI-02).")
    A("")
    musc = ["quads", "glutes", "hamstrings", "chest", "lats_upper_back", "front_delts", "side_delts", "rear_delts", "biceps", "triceps", "calves", "abs_obliques", "neck", "forearms_grip"]
    rows = []
    for p in PROFILES:
        rs = p["resistance"]; m = p["derived"]["resistance_sets_by_muscle"]
        rows.append([p["name"], "/".join(str(rs["emphasis_pct"][k]) for k in ("hypertrophy", "strength", "power")), rs["rep_zone"], f"big {rng(rs['sets_big_wk'])}, small {rng(rs['sets_small_wk'])}"] + [fmt(m.get(k, 0)) for k in musc])
    A(table(["profile", "H/S/P %", "rep zone", "target sets/muscle/wk (v0 band)"] + ["quads", "glutes", "hams", "chest", "lats/UB", "front d.", "side d.", "rear d.", "biceps", "triceps", "calves", "abs", "neck", "grip"], rows))
    A("")
    A(table(["profile", "pairing", "contra / ipsi (CAT-13)", "frontal/transverse share of unilateral lower sets (UNI-12)", "priorities", "avoid / reduce", "push:pull target"],
            [[p["name"], p["resistance"].get("pairing", "-"), p.get("contra_ipsi", "-"), (f"{p['frontal_transverse_unilateral_pct']}%" if p.get("frontal_transverse_unilateral_pct") is not None else "-"), "; ".join(p["resistance"].get("priorities", [])) or "-", "; ".join(p["resistance"].get("avoid", [])) or "-", p["resistance"].get("push_pull", "-")] for p in PROFILES]))
    A("")
    A("The frontal / transverse shares are PROPOSED numbers on the COACH-ANSWER UNI-12 direction (more for basketball, tennis, soccer, MMA and other court / combat athletes; little for aesthetics).")
    A("")
    A("### 5.7 Planes and core")
    A("")
    A("Core goes **first** in every session as the warm-up, movable by the user (COACH-ANSWER ATH-11); about 2 core exercises for athletes (VOL-17); thorax vs pelvis vs both, in any plane (CAT-08).")
    A("")
    A(table(["profile", "frontal need", "transverse need", "core sets/wk (v1)", "core plane %", "region", "mode"], [[p["name"], p["planes"]["frontal"], p["planes"]["transverse"], fmt(p["weekly_sets"].get("CORE", 0)), " ".join(f"{k} {v}" for k, v in p["core"]["plane_pct"].items()) or "-", p["core"].get("region", "-"), p["core"].get("mode", "-")] for p in PROFILES]))
    A("")
    A("### 5.8 Conditioning (aerobic sessions and colour mix per week)")
    A("")
    A("COACH-ANSWER ATH-07: 3 sessions/week for general and fat-loss clients, 2 for athletes in season, 4 for aesthetics / bodybuilders plus long walks after workouts. Fighters' opening cardio is a real aerobic block (ORD-09). Any erg works; track distance, calories or time (EQ-14). Athletes' OFF-season counts and every colour split are PROPOSED / INFERRED.")
    A("")
    rows = []
    for p in PROFILES:
        c = p["conditioning"]; a = p["aerobic_sessions_wk"]
        rows.append([p["name"]] + [fmt(c.get(k, 0)) for k in ("A", "B", "C", "LC")] + [fmt(a["off_season_or_default"]), fmt(a["in_season"]), "yes" if a["walks_after_workouts"] else "-", "; ".join(c.get("formats", [])) or "-", c.get("evidence", "-") + ("; " + a["note"] if a.get("note") else "")])
    A(table(["profile", "A (blue)", "B (green)", "C (orange)", "LC", "sessions/wk (off-season or default)", "in season", "walks after workouts", "formats", "evidence"], rows))
    A("")
    A("### 5.9 Injury hotspots -> selection rules (codes resolve in section 9)")
    A("")
    A(table(["profile", "hotspot codes (priority order)"], [[p["name"], ", ".join(p["injuries"])] for p in PROFILES]))
    A("")
    A("### 5.10 Position and phase variants")
    A("")
    rows = []
    for p in PROFILES:
        for v in p.get("variants", []):
            dlt = ", ".join(f"{k} {'+' if dv > 0 else ''}{fmt(dv)}" for k, dv in v.get("weekly_sets_delta", {}).items()) or "-"
            extra = ""
            if "derived" in v:
                d = v["derived"]
                extra = f"total {fmt(d['weekly_sets_total'])}; athletic {fmt(d['share_pct']['athletic'])}%; plyometric ~{d['nominal_weekly_dose_from_sets']['plyometric_contacts']}"
            rows.append([p["name"], v["name"], v["evidence"], dlt, extra or "-", "; ".join(v.get("notes", []))])
    A(table(["profile", "variant", "evidence", "weekly set delta vs v1 base", "computed", "notes"], rows))
    A("")
    bx = PW["boxing"]
    A("Boxer base phase (OBSERVED wk1-2): " + ", ".join(f"{k} {fmt(v)}" for k, v in bx["base_phase_weekly_sets"].items()) + ".  CrossFit power month (OBSERVED SEPT): " + ", ".join(f"{k} {fmt(v)}" for k, v in PW["crossfit_competitor"]["power_month_weekly_sets"].items()) + " (plus aerobic L4 + WODs L4 + TEST).")
    A("")
    A("### 5.11 Bilateral : unilateral model (NEW v1)")
    A("")
    A("* Scale: " + D.BILAT_MODEL["scale"] + ".")
    A("* Why: " + D.BILAT_MODEL["why"] + ".")
    for x in D.BILAT_MODEL["anchors"]: A("* " + x + ".")
    A("* Engine: " + D.BILAT_MODEL["engine"] + ".")
    A("* Contra / ipsi and pairing: " + " ".join(f"**{k}**: {v}." for k, v in D.CONTRA_IPSI.items()))
    A("")
    rows = []
    for p in PROFILES:
        bu = p["bilateral_unilateral"]
        obs = p.get("weekly_sets_observed")
        ob = ""
        if obs:
            lb = sum(obs.get(k, 0) for k in ("BKD", "BHD")); lu = sum(obs.get(k, 0) for k in ("UKD", "UHD"))
            ob = f"{round(100 * lb / (lb + lu))}/{round(100 * lu / (lb + lu))}" if lb + lu else "-"
        if "block_start" in bu:
            rows.append([p["name"], "/".join(map(str, bu["block_start"])), "/".join(map(str, bu["block_end"])), "/".join(map(str, bu["in_season"])) if bu["in_season"] else "-", "/".join(map(str, bu["baseline_mid_block"])), ob or "-", bu["evidence"]])
        else:
            rows.append([p["name"], "-", "-", "-", f"{round(100 - p['derived']['unilateral_pct_of_lower_compound'])}/{round(p['derived']['unilateral_pct_of_lower_compound'])}", ob or "-", bu["evidence"]])
    A(table(["profile", "block start (bi/uni %)", "block end", "in season", "5.2 baseline (mid-block)", "OBSERVED in the coach's program", "evidence"], rows))
    A("")
    A("### 5.12 ATH-02 ranking check (computed)")
    A("")
    A("The coach confirmed this order of plyo volume. v1 targets are set so the mid-points never increase down the list (checked in `build_profiles.py`: " + ("PASS" if B.RANK_MONOTONIC else "FAIL") + "). Budget = sets x nominal contacts; observed = the ground-contact re-count.")
    A("")
    A(table(["coach rank", "profile", "plyometric target / wk (PROPOSED)", "mid", "v1 budget (nominal)", "observed in the coach's programs"], [[fmt(r["coach_rank"]), PW[r["profile"]]["name"], rng(r["plyometric_target_wk"]), fmt(r["mid"]), fmt(r["v1_budget_nominal"]), r["observed"]] for r in B.RANK_CHECK]))
    A("")
    A("### 5.13 Population modifiers: age, experience, competition level (NEW v1)")
    A("")
    A(table(["modifier", "rule", "evidence"], [
        ["sex", D.AGE_RULES["no_sex"], "COACH-ANSWER ATH-09 / GEN-02"],
        ["training experience", D.AGE_RULES["experience"], "COACH-ANSWER PRG-05 / GEN-02"],
        ["older clients", D.AGE_RULES["older"], "COACH-ANSWER ATH-09 / EQ-03 / EQ-04; threshold PROPOSED"],
        ["youth", D.AGE_RULES["youth"], "COACH-ANSWER ATH-09"],
        ["injured / high-volume", D.AGE_RULES["injured_high_volume"], "COACH-ANSWER EQ-03"],
        ["competition level", D.COMPETITION_LEVEL["rule"] + "; high school: " + D.COMPETITION_LEVEL["high_school"] + "; college: " + D.COMPETITION_LEVEL["college"] + "; pro: " + D.COMPETITION_LEVEL["pro"], "COACH-ANSWER PRG-09 (+ PROPOSED encoding)"],
        ["body weight", "new intake field (GEN-02): loads loaded jumps at 10-20% of body weight, too heavy when jump height or speed drops (EQ-15); heavy athletes (e.g. >130 kg linemen) avoid high-amplitude depth jumps; moves combat athletes toward the 'more resistance' group as heavyweights (ATH-03)", "COACH-ANSWER GEN-02 / EQ-15 / ATH-03 + INFERRED"],
        ["in-season content", "; ".join(f"{k}: {v}" for k, v in D.IN_SEASON_CONTENT.items()), "COACH-ANSWER PER-08 / UNI-10 / ATH-07 / ATH-12 / PER-05"],
    ]))
    A("")
    # ---------------- section 6 cards
    A("## 6. Profile cards (rationale, template, v1 adjustments, season overrides, what is still open)")
    A("")
    for p in PROFILES:
        A(f"### {p['name']}  (`{p['id']}`)")
        A("")
        A(f"* **Evidence:** {p['evidence']}")
        A(f"* **Template:** {p['template']}")
        A(f"* **Days:** {p['days'].get('main')} main + {p['days'].get('optional', 0)} optional" + (f" ({p['days']['note']})" if p['days'].get('note') else "") + " - optional days can be add-ons or separate days, ideally separate (ORD-10)")
        A(f"* **Weekly sets source:** {p['weekly_sets_source']}" + (f"; {p['weekly_sets_note']}" if p.get('weekly_sets_note') else ""))
        if p.get("v1_adjustments"):
            A("* **v1 adjustments:** " + "; ".join(p["v1_adjustments"]))
        A(f"* **Why (INFERRED unless stated):** {p['rationale']}")
        gc = p["ground_contact"]
        if gc["class"]:
            A(f"* **Ground contact / power mix:** class {gc['class']} ({gc['label']}); plyo : ballistic target {p['power_mix']['plyo_pct_target']}% plyo, v1 budget {fmt(p['derived']['plyo_share_of_power_sets_pct'])}%" + (f"; observed {p['power_mix']['observed']}" if p['power_mix'].get('observed') else "") + f"; {p['power_mix']['block_shift']}")
        else:
            A("* **Ground contact / power mix:** " + (gc["label"] if p["id"] == "general_population" else "not applicable - no athletic power block (" + ("medball only as a warm-up for aesthetics clients, ATH-05" if p["id"] in ("bodybuilding_aesthetics", "fat_loss") else "observed product; plyo work kept as written") + ")"))
        A(f"* **Bilateral : unilateral:** {bu_str(p)}; contra / ipsi: {p.get('contra_ipsi', '-')}; frontal/transverse unilateral share {fmt(p.get('frontal_transverse_unilateral_pct'))}%")
        a = p["aerobic_sessions_wk"]
        A(f"* **Aerobic:** {fmt(a['off_season_or_default'])}" + (" sessions/week" if not isinstance(a['off_season_or_default'], str) else "") + (f" (in season {fmt(a['in_season'])})" if a['in_season'] not in ('-', None) else "") + ("; long walks after workouts" if a['walks_after_workouts'] else "") + (" - COACH-ANSWER ATH-07" if p["id"] in ("general_population", "fat_loss", "bodybuilding_aesthetics", "weekend_warrior") or a['in_season'] == 2 else ""))
        if p.get("in_season_content") not in (None, "-"):
            A(f"* **In season (PER-08):** {p['in_season_content']}")
        if p["plyo"].get("notes"): A(f"* **Plyo notes:** {p['plyo']['notes']}")
        if p["throwing"].get("notes"): A(f"* **Throw notes:** {p['throwing']['notes']}")
        if p["cod"].get("notes"): A(f"* **COD notes:** {p['cod']['notes']}")
        if p.get("season_overrides"): A(f"* **Season overrides:** " + "; ".join(f"{k}: {json.dumps(v, ensure_ascii=False) if isinstance(v, dict) else v}" for k, v in p["season_overrides"].items()))
        if p.get("science"): A(f"* **SCIENCE:** " + "; ".join(p["science"]))
        if p.get("confirm"): A(f"* **Still open:** " + " ".join(p["confirm"]))
        A("")
    # ---------------- section 7 season
    A("## 7. Season families (phase multipliers on the baseline)")
    A("")
    for fam, f in D.SEASON_FAMILIES.items():
        A(f"### {fam} - {f['applies_to']}")
        A("")
        A(table(["phase", "weeks", "multipliers", "rules", "evidence"], [[ph["phase"], fmt(ph.get("weeks", "-")), (", ".join(f"{k} {v}" for k, v in ph.get("multipliers", {}).items()) or "-") + (f" ({ph['multipliers_note']})" if ph.get("multipliers_note") else ""), "; ".join(ph.get("rules", [])), ph.get("evidence", "-")] for ph in f["phases"]]))
        A("")
    A("Per-sport overrides on top of the family multipliers are in each profile card and in `profiles[].season_overrides` / `in_season_content` in the JSON. COACH-ANSWER PER-08 fixes in-season content by athlete type; the INFERRED override that jump- and run-dominant team sports cut gym plyos to x0.3-0.5 in season (games supply contacts) but keep one max-velocity sprint exposure per week stays.")
    A("")
    A("## 8. Plan length shapes (COACH-ANSWER PER-01 replaces the v0 reading; detail in 06_periodization v1)")
    A("")
    A(table(["plan", "shape", "evidence"], [
        ["4-6 weeks", "maintenance / transition block (vacation 1-2 weeks, travel, off-season -> in-season, moving): about 50-70% of the usual volume to recover without pushing", "COACH-ANSWER PER-01 (replaces the v0 '6 weeks = first 6 of the 12-week shape')"],
        ["8 weeks", "first 4 weeks getting used to it, next 4 weeks driving hard; 'an 8-week program wants to modify you, so you have to start hard'", "COACH-ANSWER PER-01"],
        ["12 weeks (preferred)", "2-4 weeks acclimation -> 4-6 weeks driving hard 'not all the way to the top' -> last weeks hardest (most fatigue, stimulus and adaptation); a second 12-week cycle starts one level higher (1 -> 10, then 2 -> 11)", "COACH-ANSWER PER-01"],
        ["week-by-week", "open-ended mode with no fixed length; the engine keeps the person in line", "COACH-ANSWER PER-01"],
        ["yearly", "quarter themes and holiday weeks set to maintenance automatically (see 06_periodization v1 for the coach's quarter description, flagged there as ambiguous)", "COACH-ANSWER PER-01"],
        ["deload / tests", "deload = about half the sets, same exercises, lighter / 3+ RIR, no buy-out (PER-05); tests chosen by checkbox at block start, or 'no need for testing' (PER-07); blocks 4-6 weeks with small variable changes between blocks (PER-02)", "COACH-ANSWER PER-02 / PER-05 / PER-07"],
        ["OBSERVED examples", "8 weeks = 7 progressive + week 8 'DELOAD WEEK' / 'TEST' (AESTHETICS-8, STRENGTH-8, CONJUGATE, CrossFit class); 12 weeks = 6 + week 7 deload + 5 (STRENGTH-12, AESTHETICS-12); athlete 8-week build = 2 base + 6 conversion in 2-week steps, wk7 mini-deload, wk8 peak (boxer); 8-week season blocks, pre-season ends with a deload (BASEBALL)", "OBSERVED"],
    ]))
    A("")
    A("## 9. Injury hotspot library (selection rules)")
    A("")
    A(table(["code", "evidence", "sports", "source / mechanism", "generator rules"], [[k, v["evidence"], ", ".join(v.get("sports", [])) or "all", v.get("source", "-"), "; ".join(v["rules"])] for k, v in D.INJURY_LIBRARY.items()]))
    A("")
    A("## 10. Library and template gaps the profiles need")
    A("")
    A(table(["gap", "evidence", "needed by"], [[g["gap"], g["evidence"], g["needed_by"]] for g in B.GAPS]))
    A("")
    A("## 11. Open questions")
    A("")
    A("### 11.1 Status of the v0 questions")
    A("")
    A(table(["#", "v0 question", "status", "resolution"], [[i, q, s, r] for i, (q, (s, r)) in enumerate(zip(V0_QUESTIONS, V0_Q_STATUS), 1)]))
    A("")
    A("### 11.2 New questions raised by the answers")
    A("")
    for i, q in enumerate(D.V1_NEW_QUESTIONS, 1): A(f"{i}. {q}")
    A("")
    A("## 12. Sources (SCIENCE)")
    A("")
    for rid, txt, url in B.REFS: A(f"* [{rid}] {txt}: [{url}]({url})")
    A("")
    A("Coach sources: OBSERVED = the decoded tabs named in each row (`analysis/programs/prog_*.md` and `prog_*.volume.json`, `analysis/library/L1-L4_*`, `analysis/reference/*`); COACH-ANSWER = `coach_answers_full.md` (2026-10-08).")
    A("")
    A("## Verification log (v0 fact-check, 2026-10-08, before the coach answers)")
    A("")
    A("Kept for traceability. Where a v0 item conflicts with a coach answer, the answer wins and section 'v1 - coach answers applied' says what changed (for example C-20 squirrel-jump classification is superseded by the ground-contact model, and the 'JUSTICE LEAGUE' label in R-2 / C-3 now refers to the weekend-warrior tab).")
    A("")
    A(VERIFICATION_LOG_INTRO)
    A("")
    A("**Independent recomputations (python on the dumps / decode entries):**")
    A("")
    for x in VERIFICATION_RECOMPUTED: A("* " + x)
    A("")
    A("**Corrections:**")
    A("")
    for x in VERIFICATION_LOG: A("* " + x)
    return "\n".join(L)


def build_json():
    return {
        "_meta": {"deliverable": "04 athlete & goal profiles", "version": "v1", "generated": "2026-10-07", "verified": "2026-10-08", "v1_applied": "2026-10-08 (coach_answers_full.md, 138 of 140 answered)",
                  "companion_md": "04_athlete_profiles.md",
                  "inputs": ["coach_answers_full.md", "coach_answers.md", "analysis/programs/*.volume.json", "analysis/programs/*.md", "analysis/library/*", "analysis/reference/*", "analysis/equipment/prog_byop_equipment.md"],
                  "build": "synthesis/_build_04/render.py (profiles_v1.py overlay on profiles_data.py; v1_power_mix.py ground-contact re-count; v0 frozen in _build_04/v0/)",
                  "read_only": "no Google Sheet was modified",
                  "evidence_tags": {"OBSERVED": "read from the coach's sheets", "COACH-ANSWER <ID>": "questionnaire answer (authoritative)", "INFERRED": "analyst reasoning, to be confirmed", "SCIENCE": "external literature, see references", "PROPOSED": "analyst proposal, pending coach approval"},
                  "unit": "working sets per week (component sets inside complexes; 1 medball throw line = 1 set; per-side 10/10 = 1 set); conditioning in sessions per week by colour",
                  "baseline_phase": "off-season build week, mid-block; apply season_families multipliers, plan-type shape and the volume engine's person-based weekly rate"},
        "v1_changes": [{"ids": k, "change": v} for k, v in D.V1_CHANGELOG], "v1_pending": D.V1_PENDING,
        "headline_findings": HEADLINES,
        "categories": D.CAT_LABELS, "power_categories": D.POWER_CATS, "muscle_credit_map": D.CREDIT, "nominal_reps_per_set": {k: {"reps": v[0], "basis": v[1]} for k, v in D.NOMINAL.items()},
        "ground_contact_model": {"classes": {str(k): v for k, v in D.GCT_CLASSES.items()}, "plyo_pct_by_class": {str(k): v for k, v in D.GCT_PLYO_PCT.items()}, "floor": D.GCT_FLOOR, "ceiling": D.GCT_CEIL,
                                 "evidence": "COACH-ANSWER ATH-01 / CAT-10 (rule); class map PROPOSED - PENDING COACH APPROVAL", "science": D.SCIENCE_GCT, "plyo_method_stages": D.PLYO_METHOD_STAGES,
                                 "observed_recount": {k: v for k, v in PM.items() if not k.startswith("_")}},
        "bilateral_unilateral_model": D.BILAT_MODEL, "contra_ipsi": D.CONTRA_IPSI, "ath03_groups": D.ATH03_GROUPS, "olympic_by_level": D.OLYMPIC_BY_LEVEL, "contrast_rule": D.CONTRAST_RULE,
        "medball_rule": D.MEDBALL_RULE, "aerobic_rule": D.AEROBIC_RULE, "age_experience_rules": D.AGE_RULES, "competition_level": D.COMPETITION_LEVEL, "in_season_content": D.IN_SEASON_CONTENT, "session_rules": D.SESSION_RULES,
        "ath02_ranking_check": {"order": B.RANK_CHECK, "monotonic": B.RANK_MONOTONIC},
        "scales": D.SCALES, "observed_populations": OBS,
        "observed_baseball_mix_per_training_week": {
            "B1": {"high": 102.6, "low": 96.6, "vertical": 146.6, "horizontal": 38.3, "lateral": 14.3, "unilateral": 70.6, "landing": 14.3, "throws_sagittal": 97.9, "throws_transverse": 80.0, "core_frontal": 2.1, "core_sagittal": 3.1, "core_transverse": 5.6},
            "B2": {"high": 151.4, "low": 89.3, "vertical": 200.4, "horizontal": 28.9, "lateral": 11.4, "unilateral": 97.7, "landing": 12.9, "throws_sagittal": 70.6, "throws_transverse": 121.7, "core_frontal": 3.7, "core_sagittal": 3.1, "core_transverse": 7.3},
            "B3": {"high": 135.1, "low": 66.2, "vertical": 134.1, "horizontal": 35.5, "lateral": 31.8, "unilateral": 78.4, "landing": 12.6, "throws_sagittal": 69.8, "throws_transverse": 106.5, "core_frontal": 3.6, "core_sagittal": 4.2, "core_transverse": 8.1},
            "all_weeks_pct": {"vertical": 74.7, "horizontal": 16.1, "lateral": 9.3, "unilateral": 38.5, "landing": 6.2, "low_amplitude": 39.0, "throws_transverse": 56.6, "core_transverse": 48.4, "core_sagittal": 24.4, "core_frontal": 21.9},
            "note": "'high' = all jump contacts (landings + plyometric + ballistic jumps), the v0 measure"},
        "level_modifiers": B.LEVEL_MODIFIERS, "assembly_rules": B.ASSEMBLY,
        "plan_length_shapes": {"4-6": "maintenance / transition at about 50-70% volume (COACH-ANSWER PER-01)", "8": "4 weeks adapting + 4 weeks driving hard, start hard (COACH-ANSWER PER-01)",
                               "12": "2-4 acclimation + 4-6 driving hard (not to the top) + hardest last weeks; repeat cycles one level higher (COACH-ANSWER PER-01, preferred)",
                               "week_by_week": "open-ended mode (COACH-ANSWER PER-01)", "yearly": "quarter themes + holiday maintenance (COACH-ANSWER PER-01; see 06 v1)",
                               "observed_examples": {"8": "7 loading + deload/test", "12": "6 + deload wk7 + 5", "athlete_8_build": "2 base + 6 conversion, 2-week steps, wk7 mini-deload, wk8 peak (boxer)"}},
        "season_families": D.SEASON_FAMILIES, "injury_library": D.INJURY_LIBRARY, "profiles": PROFILES, "library_gaps": B.GAPS,
        "open_questions": {"v0_status": [{"n": i, "question": q, "status": s, "resolution": r} for i, (q, (s, r)) in enumerate(zip(V0_QUESTIONS, V0_Q_STATUS), 1)], "new_v1": D.V1_NEW_QUESTIONS},
        "references": [{"id": r[0], "claim": r[1], "url": r[2]} for r in B.REFS],
        "verification_log_v0": {"intro": VERIFICATION_LOG_INTRO, "recomputed": VERIFICATION_RECOMPUTED, "corrections": VERIFICATION_LOG},
    }


if __name__ == "__main__":
    md = build_md()
    open(OUT_MD, "w").write(md)
    js = build_json()
    json.dump(js, open(OUT_JSON, "w"), indent=1, ensure_ascii=False)
    print(OUT_MD, len(md.splitlines()), "lines", len(md), "chars")
    print(OUT_JSON, os.path.getsize(OUT_JSON), "bytes")
    nvar = sum(len(p.get("variants", [])) for p in PROFILES)
    print("profiles", len(PROFILES), "variants", nvar, "rank monotonic", B.RANK_MONOTONIC)
