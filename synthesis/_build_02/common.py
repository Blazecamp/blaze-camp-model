# -*- coding: utf-8 -*-
"""Shared helpers for the Blaze Camp exercise-catalog merge (read-only analysis)."""
import re, json, datetime, os

ROOT = "/Users/blazecamp/Library/Application Support/Claude/scratch-workspaces/83ae7031-57e0-42ef-bdf5-367a4e003c8c/ad065e19-f0c9-4863-bdf7-041381884595/scratch-2026-10-07-304072/blaze-camp-model"
AN = ROOT + "/analysis"
OUT = ROOT + "/synthesis"
SCR = os.path.dirname(os.path.abspath(__file__))

URL_RE = re.compile(r'(https?://\S+|youtube\.com\S*|youtu\.be\S*)', re.I)

TYPO = [
    (r'\btripple\b', 'triple'), (r'\bharmstring', 'hamstring'), (r'\bglidder', 'glider'),
    (r'\bsesaw', 'seesaw'), (r'\bstricted\b', 'strict'), (r'\bcoppenhaggen', 'copenhagen'),
    (r'\bfliez\b', 'flies'), (r'\bsqaut', 'squat'), (r'\bsqats\b', 'squats'), (r'\bdeaflits\b', 'deadlifts'),
    (r'\bdealifts\b', 'deadlifts'), (r'\bdeadlfts\b', 'deadlifts'), (r'\bmointain\b', 'mountain'),
    (r'\bwindchield\b', 'windshield'), (r'\bwinshield\b', 'windshield'), (r'\bwhipers\b', 'wipers'),
    (r'\bwiper\b', 'wipers'), (r'\bcosak\b', 'cossack'), (r'\bbellow\b', 'below'), (r'\bstationay\b', 'stationary'),
    (r'\brevere\b', 'reverse'), (r'\bduble\b', 'double'), (r'\bdoubke\b', 'double'), (r'\bdoubdle\b', 'double'),
    (r'\bressisted\b', 'resisted'), (r'\bpronted\b', 'pronated'), (r'\bahmmer\b', 'hammer'),
    (r'\bbycicle\b', 'bicycle'), (r'\bhallow\b', 'hollow'), (r'\bthurts\b', 'thrusts'), (r'\bsigle\b', 'single'),
    (r'\bropte\b', 'rope'), (r'tr[ií]ceps', 'triceps'), (r'\bwighted\b', 'weighted'), (r'\bobilque\b', 'oblique'),
    (r'\bstace\b', 'stance'), (r'\bdumbell\b', 'dumbbell'), (r'\bkickbakcs\b', 'kickbacks'),
    (r'\bdirectly\b', 'directly'), (r'\bdireclty\b', 'directly'), (r'\bextentions?\b', 'extensions'),
    (r'\bextensiona\b', 'extensions'), (r'\bmarchs\b', 'marches'), (r'\bgettups\b', 'getups'),
    (r'\bspeacialty\b', 'specialty'), (r'\bunilarteral\b', 'unilateral'), (r'\bunlateral\b', 'unilateral'),
    (r'\bdomnant\b', 'dominant'), (r'\bsagital\b', 'sagittal'), (r'\bintermidiate\b', 'intermediate'),
    (r'\bfoundatinonal\b', 'foundational'), (r'\bwigth', 'weight'), (r'\bweigths\b', 'weights'),
    (r'\brythmic\b', 'rhythmic'), (r'\boscilating\b', 'oscillating'), (r'\broational\b', 'rotational'),
    (r'\brotationss\b', 'rotations'), (r'\bbotton\b', 'bottom'), (r'\bcardo\b', 'cardio'), (r'\bdcontra\b', 'contra'),
    (r'\bdeadlfts\b', 'deadlifts'), (r'\bspring\b', 'sprint'), (r'\bpresercibe\b', 'prescribe'),
    (r'\bbend over\b', 'bent over'), (r'\bfron squat', 'front squat'), (r'\bz bar\b', 'ez bar'),
    (r'\bbd overhead\b', 'db overhead'), (r'\blandline\b', 'landmine'), (r'\bshoulder wide grip\b', 'shoulder width grip'),
    (r'\bscaption\b', 'scaption'), (r'\bdeclined\b', 'decline'), (r'\bfliped\b', 'flipped'), (r'\bsumm?o\b', 'sumo'), (r'skull crusher', 'skullcrusher'), (r'\bsuported\b', 'supported'), (r'\bparalell\b', 'parallel'),
]

def strip_urls(s):
    s = URL_RE.sub(' ', s)
    s = re.sub(r'\s+-\s*$', '', s.strip())
    s = re.sub(r'\s+-\s*-?\s*$', '', s)
    return re.sub(r'\s+', ' ', s).strip(' -')

def urls_in(s):
    return [u.rstrip(').,') for u in URL_RE.findall(s or '')]

def disp(v):
    """Sheet display text for a raw cell value (dates typed as N-N / N/N)."""
    if isinstance(v, dict):
        return v.get('interpreted_text') or v.get('displayed_as') or json.dumps(v)
    return '' if v is None else str(v)

def _case_like(src, rep):
    if src.isupper() and len(src) > 1:
        return rep.upper()
    if src[:1].isupper():
        return rep[:1].upper() + rep[1:]
    return rep

def fix_typos(s):
    t = s
    for a, b in TYPO:
        t = re.sub(a, lambda m, b=b: _case_like(m.group(0), b), t, flags=re.I)
    return t

SING_EXC = {'press', 'cross', 'abs', 'glutes', 'triceps', 'biceps', 'chess', 'ss', 'reps', 'tabs', 'lats', 'delts', 'traps', 'quads', 'calves', 'hips', 'dubs', 'secs'}

def nkey(s):
    """Aggressive normalisation for matching (not for display)."""
    s = disp(s)
    s = strip_urls(s)
    s = s.replace('✅', ' ').replace('👇', ' ')
    s = fix_typos(s)
    s = s.lower()
    s = s.replace('&', ' and ')
    s = re.sub(r'\bwith\b', 'w/', s)
    s = re.sub(r'\bw/(?=\S)', 'w/ ', s)
    s = re.sub(r'push[\s-]*ups?', 'pushup', s)
    s = re.sub(r'pull[\s-]*ups?', 'pullup', s)
    s = re.sub(r'chin[\s-]*ups?', 'chinup', s)
    s = re.sub(r'sit[\s-]*ups?', 'situp', s)
    s = re.sub(r'step[\s-]*ups?', 'stepup', s)
    s = re.sub(r'v[\s-]*ups?', 'vup', s)
    s = re.sub(r'\bpull[\s-]*downs?', 'pulldown', s)
    s = re.sub(r'\blat pulldown', 'latpulldown', s)
    s = re.sub(r'\bdumbbells?\b', 'db', s)
    s = re.sub(r'\bdbs\b', 'db', s)
    s = re.sub(r'\bkettlebells?\b', 'kb', s)
    s = re.sub(r'\bkbs\b', 'kb', s)
    s = re.sub(r'\b(medicine ball|med ball|medball|mb)\b', 'medball', s)
    s = re.sub(r'\bsingle[\s-]*leg\b', 'sl', s)
    s = re.sub(r'\bsingle[\s-]*arm\b', 'sa', s)
    s = re.sub(r'\bez[\s-]*bar\b', 'ezbar', s)
    s = re.sub(r'\bhex[\s-]*bar\b', 'hexbar', s)
    s = re.sub(r'\btrap[\s-]*bar\b', 'hexbar', s)
    s = re.sub(r'[^a-z0-9/ ]+', ' ', s)
    words = []
    for w in s.split():
        if len(w) > 3 and w.endswith('s') and not w.endswith('ss') and w not in SING_EXC:
            w = w[:-1]
        words.append(w)
    return ' '.join(words).strip()

def slugify(s):
    s = fix_typos(disp(s)).lower()
    s = s.replace('&', ' and ')
    s = re.sub(r'[^a-z0-9]+', '-', s).strip('-')
    return s[:80]

def load(p):
    with open(p) as f:
        return json.load(f)

def dump(o, p):
    with open(p, 'w') as f:
        json.dump(o, f, indent=1, ensure_ascii=False, default=str)
