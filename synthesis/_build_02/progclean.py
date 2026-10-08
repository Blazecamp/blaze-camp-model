# -*- coding: utf-8 -*-
import re
from common import strip_urls, nkey

CUE_PATTERNS = [
    (r'\s*@\s*\d+\s*%', 'pct'),
    (r'\((?:1|1-2|1 - 2)\s*RIR\)', 'rir'),
    (r'\((?:mid weight|MID WEIGHT)\)', 'load'),
    (r'\((?:2 min rest)\)', 'rest'),
    (r'\((?:30 seconds)\)', 'time'),
    (r'\(5 sets - [\d/]+\)', 'dose'),
    (r'\(FULL RANGE OF MOTION\)', 'rom'),
    (r'\(no leg drive\)', 'tech'),
    (r'\(cardio of choice\)', 'mode'),
    (r'\(steady pace\)', 'pace'),
    (r'\(slow\)', 'tempo'),
    (r'\(only 1 set of max pushups per set of bench\)', 'dose'),
    (r'\bUNBROKEN\b', 'dose'),
    (r'\s*-?\s*light weights - same speed for all reps', 'load/tempo'),
    (r'\s*same weight of front squats', 'load'),
    (r'\s*10 reps all rounds', 'dose'),
    (r'\s*12 on each side', 'dose'),
    (r'\s+\d+/\d+$', 'dose'),
    (r'\s*-\s*Medial pressure - contralateral loading', 'cue'),
    (r'^HEAVY:\s*', 'load'),
    (r'^\s*(?:Heavy|HEAVY|heavy)\s+', 'load'),
    (r'\s+(?:heavy|HEAVY)$', 'load'),
    (r'^\s*(?:FAST|Fast|fast)\s+', 'speed'),
    (r'^\s*(?:SLOW|Slow|slow)\s+', 'tempo'),
    (r'\s+slow$', 'tempo'),
    (r'^\s*Max speed\s+', 'speed'),
    (r'^\s*Really high\s+', 'intent'),
]

def clean_prog(name):
    s = strip_urls(str(name))
    cues = []
    m = re.match(r'^\s*(\d+\s*[xX]\s*\d*(?:/\s*)?)\s*[-/]?\s*(?=[A-Za-z])', s)
    if m and not re.match(r'^\s*\d+x\d+m', s):
        cues.append(('dose_prefix', m.group(1).strip()))
        s = s[m.end():]
    changed = True
    while changed:
        changed = False
        for pat, kind in CUE_PATTERNS:
            mm = re.search(pat, s)
            if mm:
                cues.append((kind, mm.group(0).strip()))
                s = (s[:mm.start()] + ' ' + s[mm.end():]).strip(' -')
                changed = True
    s = re.sub(r'\s+', ' ', s).strip(' -:')
    return s, cues
