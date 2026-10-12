"""Tag every session item with movement classes.

Classes (analyst vocabulary; the coach's own labels are kept verbatim in `slot`):
  athletic     : PLYO_L (lower plyo/jumps/hops/bounds), PLYO_U (upper plyo pushups, MB throws/passes/slams/scoops),
                 SPRINT, COD, DRILL (A-march/skip/run)
  power-str.   : OLY (cleans/snatches/pulls/jerks/'Tripple Extension'), LOADED_JUMP (DB/hex-bar/jump squats)
  strength     : BKD BHD UKD UHD HPULL VPULL HPUSH VPUSH
  isolation    : ISO_QUAD ISO_HAM ISO_CALF ISO_CHEST ISO_DELT ISO_BICEP ISO_TRICEP
  other        : CORE COND WARMUP MOBILITY FOCUS
Every tag carries a `source`: 'slot' (coach's CATEGORY/PURPOSE/Part label) or 'name' (keyword on the exercise
text) - so OBSERVED (slot) vs INFERRED (name) is traceable.
"""
import re

ATHLETIC = {"PLYO_L", "PLYO_U", "SPRINT", "COD", "DRILL"}
POWER = {"OLY", "LOADED_JUMP"}
STRENGTH = {"BKD", "BHD", "UKD", "UHD", "HPULL", "VPULL", "HPUSH", "VPUSH"}
ISO = {"ISO_QUAD", "ISO_HAM", "ISO_CALF", "ISO_CHEST", "ISO_DELT", "ISO_BICEP", "ISO_TRICEP"}
LOWER = {"BKD", "BHD", "UKD", "UHD", "ISO_QUAD", "ISO_HAM", "ISO_CALF"}
UPPER = {"HPULL", "VPULL", "HPUSH", "VPUSH", "ISO_CHEST", "ISO_DELT", "ISO_BICEP", "ISO_TRICEP"}
BIG = {"BKD", "BHD", "UKD", "UHD", "HPULL", "VPULL", "HPUSH", "VPUSH", "ISO_QUAD", "ISO_HAM", "ISO_CHEST", "OLY"}
SMALL = {"ISO_DELT", "ISO_BICEP", "ISO_TRICEP", "ISO_CALF"}

# ---------------------------------------------------------------- BYOP slot labels (OBSERVED, verbatim)
BYOP_CATEGORY = {
    "Calves": "ISO_CALF", "Bilateral KD": "BKD", "Unilateral KD": "UKD", "Bilateral HD": "BHD",
    "Unilateral HD": "UHD", "Horizontal Pull": "HPULL", "Vertical Pull": "VPULL", "Horizontal Push": "HPUSH",
    "Vertical Push": "VPUSH", "Incline": "HPUSH", "Flies": "ISO_CHEST", "Dips": "HPUSH", "Push": "ISO_TRICEP",
    "Overhead": "ISO_TRICEP", "ABdution": "ISO_DELT", "Reverse Flies": "ISO_DELT", "Bicep": "ISO_BICEP",
    "Tricep": "ISO_TRICEP", "Leg Extensions": "ISO_QUAD", "Leg Curls": "ISO_HAM", "Plyo": "PLYO_L", "PLYO": "PLYO_L",
    "Throwing": "PLYO_U", "COD": "COD", "Tripple Extension": "OLY",
}
BYOP_PURPOSE = {"Cardio": "COND", "Aerobic Capacity": "COND", "Core": "CORE", "Focus 1": "FOCUS",
                "Focus 2": "FOCUS", "Tricep": "ISO_TRICEP", "Calves": "ISO_CALF"}

# ---------------------------------------------------------------- BASEBALL slot labels (OBSERVED, verbatim, lower-cased)
BB_SLOT = {
    "upper ballistics/plyo": "PLYO_U", "lower ballistics/plyo": "PLYO_L", "lateral core": "CORE",
    "transverse core": "CORE", "sagital core": "CORE", "bkd": "BKD", "bhd": "BHD", "ukd": "UKD", "uhd": "UHD",
    "horiz pull": "HPULL", "horiz push": "HPUSH", "vert pull": "VPULL", "vert push": "VPUSH", "bicep": "ISO_BICEP",
    "biceps": "ISO_BICEP", "tricep": "ISO_TRICEP", "triceps": "ISO_TRICEP", "calfs": "ISO_CALF", "calf": "ISO_CALF",
    "shoulders": "ISO_DELT", "buy out": "COND", "oly": "OLY",
}

# ---------------------------------------------------------------- name keywords (INFERRED). Order matters.
NAME_RULES = [
    ("WARMUP", r"any cardio equipment"),
    ("MOBILITY", r"book openers"),
    ("COND", r"paced cardio|steady cardio|slow/steady|cardio of|cardio \(|constant card|easy cardio|tabata|"
             r"cal bike|cal row|cal skierg|calorie|ski sprint|skierg sprint|bike sprint|row sprint|row spring|"
             r"runner sprint|jump rope|20 sec fast/ 40 sec slow|^bike sprint|^ski sprints|30 sec fast run|"
             r"15 sec run|sec fast run|fast run$"),
    ("VPULL", r"jumping pull ?ups?"),
    ("DRILL", r"\ba[ -]?march|\ba[ -]?skip|\ba[ -]?run\b|a runners"),
    ("SPRINT", r"sprint|acceleration|tantrums|high knee runs|fast run/ walk back|quick feet"),
    ("OLY", r"clean(?!.*squat cleans)|snatch(?! grip)|jerk|high pull|power clean"),
    ("OLY", r"squat cleans|clean squat|kb hang squat cleans"),
    ("LOADED_JUMP", r"db squat jump|hex bar squat jump|hex bar jump|hex bar loaded|suitcase db rfe lunge jump|"
                    r"db high jumps"),
    ("PLYO_U", r"chest pass|overhead toss|oh toss|overhead throw|toss|slam|scoop|throw|catch|plyo push|"
               r"jumping push|stick the landing push|mb press|medball press|med ball half kneeling rotation|"
               r"\*medball|medballs|skater jumps with mb|mb fast|push ups/chest|lay down mb"),
    ("CORE", r"plank|situp|sit up|sit-up|crunch|twist|dead bug|hollow|hallow|windshield|windchield|winshield|"
             r"wipers|toes to bar|knees to chest|leg raise|knee raise|knees side|rocker|carry|farmer|copenhagen|"
             r"v-ups|flutter|hip turns|mountain climber|bear crawl|cross connect|chop|plate rotations|oblique|"
             r"shoulder roll|arm bars|swiss ball knee tuck|star toe|lateral crunches|shoulders taps|shoulder taps|"
             r"mointain climber|hips raises|hip lifts|"
             r"pull through|core|med ball rolls|slider runners|t2b"),
    ("PLYO_L", r"jump|hop|bound|depth drop|drop & stick|squirrel|skater|snap down|hurdle|tuck|drop into box|"
               r"step up jumps|stick the landing"),
    ("ISO_HAM", r"leg curl|nordic|hamstring curl|hamstring runner|hamstring sliders|harmstring|swiss ball kicks|"
                r"swiss ball leg curl|hamstring curls sliders|glidder"),
    ("ISO_QUAD", r"leg ext|leg extension"),
    ("ISO_CALF", r"calf|heel raise"),
    ("UHD", r"single leg deadlift|sl rdl|single leg rdl|uni rdl|unilateral deadlift|unilateral dl|"
            r"staggered stance (db )?d|staggered stance unilateral|stagrd\.? dl|staggered dl|rear foot on wall|"
            r"camporini|sl glute bridge|single leg glute bridge|sl hip th|staggered stance double|"
            r"suitcase double dumbell staggered|staggered barbell deadlift"),
    ("UKD", r"lunge|step up|step-up|split squat|split sqts|bulgarian|jefferson"),
    ("BHD", r"deadlift|deaflit|dealift|\bdl\b|rdl|good morning|swing|hyper-extension|glute bridge|hip thrust"),
    ("BKD", r"squat|sqat|sqaut|leg press|zercher"),
    ("ISO_DELT", r"side raise|side rise|lateral raise|front raise|front/side|reverse fl|upright row|"
                 r"upright db row|face pull|rear delt"),
    ("ISO_CHEST", r"flies|fly\b"),
    ("ISO_TRICEP", r"tricep|tríceps|skull crusher|kickback|kick backs|tate press|jm press|diamond push|"
                   r"plank up down"),
    ("ISO_BICEP", r"curl|bicep"),
    ("VPULL", r"pull up|pullup|pull-up|pull ups|\bchin|lat pull|pulldown|pull down|pull over|pullover|pull under"),
    ("HPULL", r"row"),
    ("VPUSH", r"overhead press|oh press|over head press|shoulder press|push press|arnold|landmine|strict press|"
              r"sesaw press|seesaw|sesaw push|barbell press|db press|medball press|curl to press|"
              r"overhead db sesaw|overhead sesaw|db overhead press|bb oh press|db oh press|heavy oh press|"
              r"overhead strict|single arm db press"),
    ("HPUSH", r"bench|push up|pushup|push-up|floor press|dips|chest press|incline"),
]

SPLIT_RE = re.compile(r"\s+\+\s+|\+|\s&\s|/|\s-\s|\bdirectly into\b|\binto\b|,|\bSUPERSET:\s*|\bSuperset:\s*|"
                      r"\bsuperset with\b")


def classify_text(t):
    """Return ordered list of tags (unique) for an exercise string, splitting combos."""
    if t is None:
        return []
    s = str(t).lower()
    s = re.sub(r"https?://\S+", " ", s)
    tags = []
    parts = [p.strip() for p in SPLIT_RE.split(s) if p and p.strip()]
    if len(parts) > 1:
        for p in parts:
            for tag, rx in NAME_RULES:
                if re.search(rx, p):
                    if tag not in tags:
                        tags.append(tag)
                    break
    if not tags:
        for tag, rx in NAME_RULES:
            if re.search(rx, s):
                tags.append(tag)
                break
    return tags


# exercises whose keyword tag is misleading; corrected by name (INFERRED, documented)
OVERRIDES = {
    "KB Book openers": ["MOBILITY"],
    "Situps to overhead throw": ["PLYO_U"],
    "Situps / Toes to bar": ["CORE"],
    "Hang Power Clean & Press": ["OLY", "VPUSH"],
    "Clean Pull/ hang Power Clean": ["OLY"],
    "Plate core & leg extensions / nordic curls": ["CORE", "ISO_QUAD", "ISO_HAM"],
    "Plate core & leg extensions": ["CORE", "ISO_QUAD"],
    "Heavy curls & Heavy tricep kickbakcs 12 on each side": ["ISO_BICEP", "ISO_TRICEP"],
    "Leg ext. Leg Curls (FULL RANGE OF MOTION)": ["ISO_QUAD", "ISO_HAM"],
    "Superset: leg ext. leg curls (MID WEIGHT)": ["ISO_QUAD", "ISO_HAM"],
    "Med ball rolls": ["CORE"],
    "Med Ball Rockers": ["CORE"],
    "Star Supine Cross Connects": ["CORE"],
    "TABATA": ["CORE"],
    "Heel raises & fast/rythmic/1/4 SQUATS": ["ISO_CALF", "PLYO_L"],
    "Sprint 20/ Recover 40": ["SPRINT"],
    "20 sec fast/ 40 sec slow (cardio of choice)": ["COND"],
    "Easy cardio of choice (steady pace)": ["COND"],
    "Cardio of any choice": ["COND"],
    "DEADLIFTS (1-2RIR) + 3 min Jump Rope": ["BHD", "COND"],
    "Single Leg swiss ball knee tuck in + DB rows": ["CORE", "HPULL"],
    "8 Box Med Ball rocker into 4 hops + Swiss ball knee tuck ins": ["CORE", "PLYO_L"],
    "Drop into Box Jumps + 20/20 Star Toe touches": ["PLYO_L", "CORE"],
    "Slider Runners + Slider Hamstring Runners": ["CORE", "ISO_HAM"],
    "Weighted Bulgarian Lunge Heel held up + SL Def. Weighted Calf Raises": ["UKD", "ISO_CALF"],
    "Copenhagen Plank & Unilateral DL": ["CORE", "UHD"],
    "Side Raises + Front Raises": ["ISO_DELT"],
    "3 Heavy SQUATs + 5 Tuck jumps + 5 DB squat jumps + 5 Squirrel jumps": ["BKD", "PLYO_L", "LOADED_JUMP"],
    "4 Deadlifts - 5 broad jumps - 5 KB swings - 5/5 High Knee runs": ["BHD", "PLYO_L", "SPRINT"],
    "SUPERSET: HEAVY Hex bar Squats direclty into 10 Repeat Jump Squat HIGH JUMPs": ["BKD", "LOADED_JUMP"],
    "SUPERSET: HEAVY Ipsilateral DB front foot elevated lunge directly into no weight lunge front foot jumps 8 reps each leg": ["UKD", "PLYO_L"],
    "Lateral mid size box step up jumps directly into nordic curls": ["PLYO_L", "ISO_HAM"],
    "KB Swings + 12/12 Single leg Glute bridges": ["BHD", "UHD"],
    "Bench glute Bridge & fast alternating DB sesaw floor press": ["BHD", "HPUSH"],
    "SUPERSET: DB Single leg Glute bridges + alternating seated bicep curl runners + db floor skull crushers": ["UHD", "ISO_BICEP", "ISO_TRICEP"],
    "SUPERSET: Dead bugs + Front Raises + Side Raises": ["CORE", "ISO_DELT"],
    "SUPERSET: Star v-ups + side plank knee to elbow ": ["CORE"],
    "DB side raises + Copenhagen plank :50 sec each side": ["ISO_DELT", "CORE"],
    "50 situps + 50 crunches + 50 reverse crunches": ["CORE"],
    "HEAVY Single arm rotational half kneeling cable row or band row or Bird Dog Row": ["HPULL"],
    "Standing Overhead DB sesaw push presses": ["VPUSH"],
    "Side Plank presses (advanced does star side plank presses)": ["CORE"],
    "Banded fast LAT PULL DOWNS Single Arm": ["VPULL"],
    "Max speed banded lat pull downs half kneeling ipsilateral": ["VPULL"],
    "Plyo Push ups - one side raised": ["PLYO_U"],
    "RFE & FFE contralateral lunge double DB front rack loaded": ["UKD"],
    "DB overhead sesaw alternating press (no leg drive)": ["VPUSH"],
    "Feet againts the wall weighted low plank ": ["CORE"],
    "Really high jump squats LOAD & jump hard": ["LOADED_JUMP"],
    "Depth Jump with weight": ["PLYO_L"],
    "Depth jump with weight into high box jump": ["PLYO_L"],
    "Single Leg to march jumps": ["PLYO_L"],
    "Single Leg to high march jump": ["PLYO_L"],
    "Bilateral Symetrical jump on to plate": ["PLYO_L"],
    "SL Jump on to plate forward/back": ["PLYO_L"],
    "High Knee Runs FAST": ["SPRINT"],
    "Staggered stance DB snatch": ["OLY"],
    "Db Staggered Hang Snatch ": ["OLY"],
    "Lateral Step ups IPSILATERAL loading": ["UKD"],
    "Lateral box step up IPSILATERAL LOAD": ["UKD"],
    "Db contralateral LOW step up": ["UKD"],
    "Jefferson Lunge": ["UKD"],
    "DB snatches ": ["OLY"],
    "Squirrel jumps single leg (REVERSE BANDED)": ["PLYO_L"],
    "SNATCH GRIP DL": ["BHD"],
    "Heavy Snatch grip DL": ["BHD"],
    "Pull under": ["VPULL"], "pull under": ["VPULL"],
    "UNI RDL/ CORE/ UNI GB": ["UHD", "CORE"],
    "uni RDL/ core/ OH press": ["UHD", "CORE", "VPUSH"],
    "UPPER ACCESORY": ["ACCESSORY_UPPER"], "LOWER ACCESORY": ["ACCESSORY_LOWER"], "ACCESSORIES": ["ACCESSORY"],
    "Arnold press": ["VPUSH"], "arnold presses": ["VPUSH"],
    "Kettlebell arm bars - [video link removed]": ["CORE"],
    "front/side db rises": ["ISO_DELT"],
    "unilateral curl to press (one at a time)": ["ISO_BICEP"],
    "Alternating curl to press": ["ISO_BICEP"],
    "Fast run/ walk back or 3 min walk/rest - This is NOT a sprint, this is speed endurance": ["SPRINT"],
    "MEd ball hug ankle hops": ["PLYO_L"],
    "Med ball half kneeling rotationss in & step out": ["PLYO_U"],
    "Push ups/chest pass": ["PLYO_U"],
    "push ups": ["PLYO_U"],
    "band assisted jumping pushup": ["PLYO_U"],
    "skater jumps with MB rotations": ["PLYO_L", "PLYO_U"],
    "lateral lunge to Medball scoop - [video link removed]": ["PLYO_U"],
    "MB rotational Alternating FFE Reverse lunge": ["UKD"],
    "Squat to Chest Pass": ["PLYO_U"],
    "Rotational Floor side to side slams": ["PLYO_U"],
    "6/6 plank up downs": ["ISO_TRICEP"],
    "Shoulders taps": ["CORE"],
    "KB high pull": ["OLY"],
    "Heavy calf raises double db": ["ISO_CALF"],
    "fast hamstring curls sliders": ["ISO_HAM"],
    "HAMSTRING SLIDERS RUNNERS": ["ISO_HAM"],
    "Suitcase DB RFE iso holds / RFE lunge jumps": ["UKD", "PLYO_L"],
    "bent over barbell rows same weight of front squats": ["HPULL"],
    "Jumping Jacks": ["COND"],
    "Burpees": ["COND"],
    "Dumbbell curl to press": ["ISO_BICEP"],
    "FAST HIGH BAR (D)BOX": ["BKD"],
    "HIGH BAR": ["BKD"],
    "LOW BAR": ["BKD"],
    "UNILATERAL": ["VPULL"],  # 4 TRACKS G56: truncated entry in the slot that reads 'UNILATERAL LAT PULL DOWN' in E56/F55
    "TEST": [], "DELOAD": [], "DELOAD WEEK": [],
    "*MEDBALLS": ["PLYO_U"], "*MEDBALLS ": ["PLYO_U"], "**MEDBALLS**": ["PLYO_U"], "*MEDBALL": ["PLYO_U"],
    "MB slams": ["PLYO_U"],
}


def tag_item(it, tab, slot_kind):
    """Attach tags to one item. slot_kind: 'byop', 'baseball', 'conjugate', 'hybrid', None."""
    tags, src = [], None
    text = it.get("text")
    slot = it.get("slot")
    if slot_kind == "byop":
        cat, pur = slot.get("CATEGORY"), slot.get("PURPOSE")
        t = BYOP_CATEGORY.get(cat) if cat else None
        if t is None and pur is not None:
            t = BYOP_PURPOSE.get(pur.strip())
        if t:
            tags, src = [t], "slot"
    elif slot_kind == "hybrid":
        b, d = (slot.get("B") or ""), (slot.get("D") or "")
        bmap = {"STRENGTH": None, "OLY/ POWER": "OLY", "UNI HD": "UHD", "HOR PULL": "HPULL", "A/C": None,
                "UNI KD/ HOR ROW": ["UKD", "HPULL", "CORE"], "UNI KD": "UKD", "OH PUSH": "VPUSH", "FB": None}
        dmap = {"SQUATS": "BKD", "DEADLIFTS": "BHD", "BENCH PRESS": "HPUSH", "JUMPS": "PLYO_L", "SPEED": "SPRINT",
                "DISTANCE": "COND", "UPPER ACCESORY": "ACCESSORY_UPPER", "LOWER ACCESORY": "ACCESSORY_LOWER",
                "CLEANS": "OLY", "SNATCHES": "OLY", "UNI RDLs": "UHD", "UNI RDLS": "UHD", "DB ROWS": "HPULL",
                "LUNGES/ ROWS": ["UKD", "HPULL", "CORE"], "OH press": "VPUSH", "STEP UPS": "UKD"}
        t = dmap.get(d) or bmap.get(b)
        if b == "FB":
            t = ["VPULL", "HPUSH"]  # C101 'VEr pull/ hor push'
        if t:
            tags, src = (t if isinstance(t, list) else [t]), "slot"
        # weekly cell content can add tags (e.g. '3x6 - DB bench press/ core', 'UNI RDL/ CORE/ UNI GB')
        if text:
            for x in OVERRIDES.get(text, classify_text(text)):
                if x not in tags and x not in ("ACCESSORY_UPPER", "ACCESSORY_LOWER"):
                    tags.append(x)
    if not tags and text is not None:
        tags = list(OVERRIDES.get(text, OVERRIDES.get(str(text).strip(), classify_text(text))))
        src = "name"
        if re.search(r"push split jerk|push jerk", str(text), re.I):
            tags = ["VPUSH", "OLY"]  # overhead jerk = vertical push with triple-extension drive
        if str(text).startswith("Fast run/ walk back"):
            tags = ["SPRINT"]  # coach: 'This is NOT a sprint, this is a fast run' (speed-endurance, Part A slot)
        if slot_kind == "baseball" and isinstance(slot, str):
            st = BB_SLOT.get(slot.strip().lower())
            LFAM = {"BKD", "BHD", "UKD", "UHD"}
            if st in LFAM and len(tags) == 1 and tags[0] in LFAM and tags[0] != st:
                tags, src = [st], "slot (coach lower-pattern label overrides name)"
            # coach's slot label wins when the name gives a resistance tag of another family or nothing;
            # athletic/core/conditioning names in a resistance slot are kept (they ARE what is programmed)
            if st and (not tags):
                tags, src = [st], "slot"
            elif st and st in ("ISO_CALF",) and set(tags) & {"PLYO_L"}:
                tags, src = ["ISO_CALF"], "slot (calf slot holding hops)"
            elif st in ("VPULL",) and "ISO_LAT" in tags:
                tags, src = ["VPULL"], "slot"
            elif st == "ISO_TRICEP" and set(tags) & {"HPUSH", "PLYO_U", "CORE"}:
                tags, src = ["ISO_TRICEP"], "slot (tricep slot holding push-up variant)"
            elif st == "ISO_DELT" and set(tags) & {"HPULL", "OLY", "HPUSH", "VPUSH", "ISO_BICEP"}:
                tags, src = tags, "name (in coach 'shoulders' slot)"
    it["tags"] = tags
    it["tag_source"] = src
    # ROLE = the pattern the coach's slot label assigns (used for pairing/alternation rules R8/R9);
    # falls back to the movement tags when no pattern label exists.
    role = None
    if slot_kind == "baseball" and isinstance(slot, str):
        st = BB_SLOT.get(slot.strip().lower())
        LOWER_LAB = {"BKD", "BHD", "UKD", "UHD", "ISO_CALF"}
        UPPER_LAB = {"HPULL", "VPULL", "HPUSH", "VPUSH", "ISO_DELT", "ISO_BICEP", "ISO_TRICEP"}
        LOWER_MOV = {"PLYO_L", "LOADED_JUMP", "BKD", "BHD", "UKD", "UHD", "ISO_QUAD", "ISO_HAM", "ISO_CALF", "SPRINT",
                     "DRILL", "OLY"}
        UPPER_MOV = {"PLYO_U", "HPULL", "VPULL", "HPUSH", "VPUSH", "ISO_DELT", "ISO_BICEP", "ISO_TRICEP", "ISO_CHEST"}
        mov = set(tags)
        same_region = (st in LOWER_LAB and (mov & LOWER_MOV)) or (st in UPPER_LAB and (mov & UPPER_MOV))
        # the label's pattern is adopted only when the programmed movement sits in the same body region
        # (e.g. 'DB Squat Jumps' in the 'bkd' slot -> BKD role; 'Broad jumps' typed beside a 'horiz push' label
        # in an inserted row -> keeps its own movement tag)
        if st in LOWER_LAB | UPPER_LAB and same_region:
            role = [st]
    it["role"] = role if role else list(tags)
    return it
