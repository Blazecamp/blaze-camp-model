"""Load-position zone tagger + the coach's level rule (COACH-ANSWER CAT-04, Dr. Pat Davidson's zones).

Coach (coach_answers.md CAT-04): level = skill + stability demand + load POSITION.
  Zone 1 = load close to the body / at the bottom / in front (arms low): goblet, front-loaded zercher  -> foundational
  Zone 2 = horizontal (high pressure, but safer to push and pull); load racked on the body (barbell front squat) -> intermediate
  Zone 3 = overhead / vertical, or load BEHIND the body (barbell back squat)                            -> advanced
  Machines / cables change this: easier, because the machine / cable does the stabilising work.

Every tag is INFERRED from the exercise NAME (the library has no load-position column).  The zone is where the external
load (or the hands, for bodyweight upper-body work) sits relative to the trunk; for moving loads (raises, chops) it is the
END position, because that is how the coach's own ladders read (FUNCTIONAL BIOMECHANICS SYSTEM: 'chop down' FOUNDATIONAL ->
'midline' INTERMEDIATE -> 'up' ADVANCED, BC9:BC20).  Unloaded lower-body work has no zone (None): its zone is set by the
LOADING list (ALL ABOUT LUNGES!C22:C33) when load is added.
"""
import re


def _has(n, *words):
    return any(w in n for w in words)


def load_zone(name, category='', impl_class=''):
    """returns dict(zone=1|2|3|None, path=str|None, behind_body=bool, basis=str)"""
    n = ' ' + re.sub(r'\s+', ' ', name.lower()).strip() + ' '
    out = lambda z, why, path=None, behind=False: dict(zone=z, path=path, behind_body=behind, basis='INFERRED from name: ' + why)

    # explicit coach zone labels
    if 'zone1, zone 2, zone 3' in n:
        return out(None, "the coach writes all three zones into the name ('Cable Machine Curls (Zone1, Zone 2, Zone 3')", path='1/2/3')
    if 'zone 1 and zone 3' in n:
        return out(None, "the coach writes zones 1 and 3 into the name", path='1/3')
    if '(zone 3)' in n:
        return out(3, "the coach writes '(Zone 3)' into the name")

    # behind the body (coach: back-loaded = advanced)
    if _has(n, 'back squat', 'high bar', 'low bar', 'goodmorning', 'good morning', 'back racked', 'calf raises w/ barbell', 'barbell calf'):
        return out(3, 'load behind the body (bar on the back)', behind=True)

    # arm isolation first (avoid matching press keywords)
    if _has(n, 'incline seated db curls', 'kickback', 'incline bench bicep'):
        return out(1, 'upper arm low and BEHIND the trunk (shoulder extension)', behind=True)
    if _has(n, 'spider', 'trx bicep'):
        return out(2, 'upper arm at ~90 degrees to the trunk')
    # [verify 2026-10-08] 'comeback/curl' is a COD route (L91), not an arm curl
    if _has(n, 'curl') and not _has(n, 'leg curl', 'hamstring', 'harmstring', 'nordic', 'glidder', 'comeback'):
        return out(1, 'upper arm at the side')
    if _has(n, 'skullcrusher', 'tate press'):
        return out(2, 'upper arm at ~90 degrees to the trunk (lying)')
    if _has(n, 'push down', 'pushdown', 'tricep extensions', 'tricep ext') and 'overhead' not in n:
        return out(1, 'upper arm at the side (pushdown)')

    # overhead
    if _has(n, 'snatch') and not _has(n, 'pull', 'grip'):
        return out(3, 'bar received overhead')
    if _has(n, 'jerk'):
        return out(3, 'bar driven overhead')
    if _has(n, 'thruster'):
        return out(3, 'front rack to overhead', path='2->3')
    if _has(n, 'overhead throw', 'situps to overhead'):
        return out(3, 'ball released from overhead')
    if _has(n, 'overhead'):
        return out(3, 'overhead position')
    if _has(n, 'push press', 'handstand', 'pike push', 'z press', 'standing db press', 'standing barbell', 'kneeling db press',
            'kneeling barbell press', 'sesaw', 'alternating db press', 'oh press', 'shoulder press', 'arnold'):
        return out(3, 'press finishes overhead')
    if _has(n, 'incline seated', 'high incline'):
        return out(3, 'steep-incline press: arms finish near overhead', path='2->3')
    if _has(n, 'landmine press'):
        return out(2, 'landmine arc press: finishes in front, above shoulder height', path='2->3')
    if _has(n, 'pull up', 'pull-up', 'pullup', 'pull ups', 'chin up', 'lat pull', 'pulldown', 'pull down', 'toes to bar', 'hanging',
            'knees to chest'):
        return out(3, 'arms overhead (hanging or pulling from overhead)')

    # dips: arms low but the shoulders are extended behind the body
    if re.search(r'\bdips?\b', n):
        return out(3, 'hands at the sides with the shoulders extended BEHIND the body (coach: behind the body = advanced); '
                      'ambiguous because arm elevation itself is zone 1', behind=True)

    # chops / crunches / scoops / slams: END position
    if _has(n, 'chop down', 'crunch down', 'down crunch', 'slam'):
        return out(1, 'high-to-low: ends low', path='3->1')
    if _has(n, 'chop up', 'crunch up', 'up crunch'):
        return out(3, 'low-to-high: ends high', path='1->3')
    if _has(n, 'chop midline', 'crunch midline', 'midline crunch'):
        return out(2, 'ends at mid-line (horizontal)')
    if _has(n, 'scoop'):
        return out(2, 'ball starts low by the hip and is released forward/up', path='1->2')
    if 'woodchopper' in n:
        return out(None, 'chop direction not stated')

    # racked on the front of the body / horizontal
    if _has(n, 'front squat', 'front rack', 'double front rack', 'on shoulder', 'front racked'):
        return out(2, 'load racked on the front of the body (elbows up, arms horizontal)')
    if _has(n, 'power clean', ' clean ', 'clean & jerk') and not _has(n, 'pull'):
        return out(2, 'bar received in the front rack')
    if _has(n, 'chest pass', 'push up box', 'plyo push', 'push up stick'):
        return out(2, 'horizontal push')
    if _has(n, 'row', 'face pull', 'renegade') and 'upright' not in n:
        return out(2, 'horizontal pull')
    if _has(n, 'incline') and _has(n, 'press'):
        return out(2, 'incline press: between horizontal and overhead', path='2->3')
    if _has(n, 'bench press', 'press on floor', 'floor press', 'chest press', 'machine bench', 'push up', 'pushup', 'push-up',
            'flies', 'fliez', ' fly ', 'pallof', 'oblique rotation', 'russian twist', 'offset plank', 'flat bench',
            'cable press', 'db press'):
        return out(2, 'arms at shoulder height relative to the trunk (horizontal)')
    if _has(n, 'reverse fl'):
        return out(2, 'reverse fly: arms at ~90 degrees to the trunk')

    # raises (end position)
    if _has(n, 'lateral raise', 'side raise', 'front raise', 'hammer side', 'upright row'):
        return out(2, 'starts with the arms low and ends at shoulder height', path='1->2')

    # low / front / close loads (zone 1)
    if _has(n, 'zercher', 'goblet', 'hex', 'suitcase', 'landmine', 'sumo squats w/', 'low db squat', 'db squat', 'medball hug',
            'plate reach', 'deadlift', 'stiff leg', 'swing', 'pull through', 'hip thrust', 'camporini', 'calf raises w/ db',
            'db calf', 'clean pull', 'snatch pull', 'high pull', 'db depth drop', 'db ankle', 'db repeat', 'weighted situps',
            'weighted squat', 'staggered stance dl', 'db dl', ' dl ') or re.search(r'\brdl\b', n):
        return out(1, 'load held low, at the sides, or hugged in front close to the body')

    # machines that set the position themselves
    if impl_class == 'machine' or _has(n, 'machine', 'leg press', 'hack squat', 'pendulum', 'ghd', 'hyper extension', 'reverse hyper'):
        return out(None, 'the machine sets the load position (supported); zone not applicable')

    return out(None, 'unloaded or load position not stated (zone set by the LOADING list when load is added)')


SUPPORT_WORDS = ('kneeling push', 'incline push', 'seated', 'on floor', 'floor press', 'box.', 'box squat', 'on the wall', 'foam roller',
                 'chest suported', 'chest-supported', 'bench push', 'wall assisted')
ASSIST_WORDS = ('assisted', 'seated pull ups', 'trx', 'rings', 'inverted')


def guidance(name, impl_class, constraint):
    """How much stabilising work the set-up takes away (coach: 'the machine/cable does the stabilising work')."""
    n = name.lower()
    if impl_class == 'machine' or 'assisted' in n:
        return 2, 'machine-guided or assisted'
    if impl_class in ('cable', 'cable/band') or 'cable' in n:
        return 1, 'cable-guided'
    if any(w in n for w in ASSIST_WORDS):
        return 1, 'feet on the floor / suspension assistance'
    if (constraint or 0) >= 4 or any(w in n for w in SUPPORT_WORDS) or 'seal' in n:
        return 1, 'supported (seat, floor, box, wall, chest pad or knees)'
    return 0, 'unsupported free weight / bodyweight'


def coach_level_estimate(name, zone, skill, impl_class, constraint):
    """Coach's CAT-04 rule as a number (0 = foundational, 1 = intermediate, 2 = advanced): POSITION first
    (zone 1 -> 0, zone 2 -> 1, zone 3 -> 2; unloaded -> skill: low 0, moderate 1, high 2), minus the guidance the
    machine / cable / support provides.  Skill and stability are NOT added on top of the zone: the coach's own anchor
    'barbell front squat = intermediate' (CAT-04) is a high-skill lift that he still calls intermediate."""
    base = (zone - 1) if zone is not None else {'low': 0, 'moderate': 1, 'high': 2}.get(skill, 0)
    g, why = guidance(name, impl_class, constraint)
    return max(0, min(2, base - g)), g, why
