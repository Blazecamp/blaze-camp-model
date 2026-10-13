// app/intake-builder.js - the wizard's answers -> one intake/2 object (engine/CONTRACTS.md §2.1, engine/intake.mjs validateIntake).
// Pure module (no DOM, no storage, no clock: "today" is passed in), shared by the page and tests/app.test.mjs.
// Only fields with a coach answer behind them are asked (AGENTS.md §10 "Few inputs"); everything else takes the engine's default.
// No sex, gender, sleep, stress, job or lifestyle field exists here (H13, H16), and no session length (CT-01, R4-SES-01).

export const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
export const GOALS = ['muscle', 'strength', 'fat_loss', 'general', 'athletic', 'active'];
export const FORMAT_GOALS = ['fat_loss', 'general'];
export const YEARS_CHOICES = [0, 0.5, 1, 2, 3, 5];
export const DAYS_CHOICES = [2, 3, 4, 5, 6];
export const SEVERITIES = ['mild', 'moderate', 'severe'];
export const SAFETY_KEYS = ['heart', 'surgery_6mo', 'pregnant_postpartum_6mo', 'injury_in_treatment', 'doctor_said_no'];
export const SEASON_TYPES = ['no_season', 'next_season_start', 'in_season_until', 'competition_date'];
export const LEVELS_OF_PLAY = ['youth_club', 'high_school', 'college', 'pro', 'masters', 'amateur'];
// Focus muscle choices shown (rules.volume.focus.intake_map minus the retired side_delts / rear_delts, R3-VOL-01)
export const FOCUS_CHOICES = ['chest', 'back', 'shoulders', 'v_taper', 'quads', 'glutes', 'hamstrings', 'biceps', 'triceps', 'calves', 'core'];
export const FOCUS_BOTH_SLOTS = ['v_taper'];
export const TEST_CHOICES = ['strength', 'cardio', 'speed_agility', 'jumps', 'body'];
// extra kit a person may add to a profile (equipment tokens with i18n names in model/i18n: equipment.token.*). No bands (H01).
export const EXTRA_CHOICES = ['dumbbell', 'kettlebell', 'barbell', 'rack', 'bench', 'pullup_bar', 'cable', 'medball', 'box', 'sled', 'jump_rope', 'trx', 'cardio_machine_cal', 'open_space_long'];
// static weekday fallbacks; the page asks the engine for the template's own weekdays (validateIntake fills them)
export const DEFAULT_WEEKDAYS = {
  2: ['Mon', 'Thu'], 3: ['Mon', 'Wed', 'Fri'], 4: ['Mon', 'Tue', 'Thu', 'Fri'], 5: ['Mon', 'Tue', 'Wed', 'Fri', 'Sat'], 6: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
};
export const YOUTH_AGE = 18;

/** the first Monday on or after `todayIso` (YYYY-MM-DD) - the default start date */
export function nextMonday(todayIso) {
  const [y, m, d] = String(todayIso).split('-').map(Number);
  const t = new Date(Date.UTC(y, m - 1, d));
  const dow = t.getUTCDay(); // 0 = Sunday
  const add = dow === 1 ? 0 : (8 - dow) % 7;
  t.setUTCDate(t.getUTCDate() + add);
  return t.toISOString().slice(0, 10);
}

/** today's date in the person's own time zone as YYYY-MM-DD (the page passes a Date) */
export function isoOf(date) {
  const p = (n) => String(n).padStart(2, '0');
  return `${date.getFullYear()}-${p(date.getMonth() + 1)}-${p(date.getDate())}`;
}

/** the wizard's starting answers: every choice has a sensible default except the goal-specific pick, health and the release */
export function defaultAnswers(todayIso) {
  return {
    role: 'self', health_route: 'coach_screen',
    age: 30, weight: 170, unit: 'lb', years: 1,
    goal: null, format: 'gym',
    sport: { id: null, position: null, detail: null, season: 'no_season', season_date: null, level: null, practice: 0 },
    activity: { id: null, play_days: [], league: null, style: null, event_date: null },
    focus: [],
    split: 'default', supersets: 'normal',
    days: 3, weekdays: DEFAULT_WEEKDAYS[3].slice(), weeks: 12, start_date: nextMonday(todayIso), tests: [],
    equipment: 'FULL_GYM', extras: [],
    pain: [],
    health: null, safety: Object.fromEntries(SAFETY_KEYS.map(k => [k, false])),
    accepted: false, guardian: false
  };
}

export const isMinor = (a) => typeof a.age === 'number' && a.age < YOUTH_AGE;

/** the release version the engine expects for these answers (engine/intake.mjs expectedRelease) */
export function releaseVersion(a) {
  if (isMinor(a)) return 'release.minor';
  return a.role === 'client' ? 'release.coach' : 'release.client';
}

/** Focus slots used (v_taper takes both) */
export function focusSlots(list) {
  return (list || []).reduce((n, f) => n + (FOCUS_BOTH_SLOTS.includes(f) ? 2 : 1), 0);
}

/** toggle a Focus muscle, keeping at most 2 slots */
export function toggleFocus(list, f) {
  const cur = (list || []).slice();
  const i = cur.indexOf(f);
  if (i >= 0) { cur.splice(i, 1); return cur; }
  const next = [...cur, f];
  while (focusSlots(next) > 2 && next.length > 1) next.shift(); // the oldest pick makes room
  return next;
}

/** which detail step a goal needs: 'sport' | 'activity' | 'focus' | 'format' | null */
export function detailStepFor(goal) {
  if (goal === 'athletic') return 'sport';
  if (goal === 'active') return 'activity';
  if (goal === 'muscle') return 'focus';
  if (FORMAT_GOALS.includes(goal)) return 'format';
  return null;
}

/** the split choices the template offers for a goal and day count (rules.template_select.split_style_variants) */
export function splitChoices(goal, days) {
  if (goal !== 'muscle') return [];
  if (days === 6) return ['default', 'ppl'];
  if (days === 4) return ['default', 'upper_lower'];
  return [];
}

const sortWeekdays = (arr) => WEEKDAYS.filter(d => (arr || []).includes(d));

/**
 * The wizard's answers -> intake/2 (CONTRACTS §2.1 as amended). Every value is one the engine's validator accepts.
 * @param {object} a answers (defaultAnswers shape) @param {{lang?:'en'|'es'}} [opts]
 */
export function buildIntake(a, opts = {}) {
  const lang = opts.lang === 'es' ? 'es' : 'en';
  const goal = a.goal;
  const minor = isMinor(a);
  const intake = {
    schema: 'intake/2',
    lang,
    units: a.unit === 'kg' ? 'kg' : 'lb',
    role: a.role === 'client' ? 'client' : 'self',
    health_route: a.role === 'client' ? (a.health_route === 'coach_own_sop' ? 'coach_own_sop' : 'coach_screen') : null,
    safety: Object.fromEntries(SAFETY_KEYS.map(k => [k, !!(a.health === 'some' && a.safety && a.safety[k])])),
    release: { accepted: !!a.accepted, version: releaseVersion(a), lang, guardian: minor ? !!a.guardian : null },
    age: Math.round(Number(a.age)),
    body_weight: { value: Number(a.weight), unit: a.unit === 'kg' ? 'kg' : 'lb' },
    experience: { years_consistent: Number(a.years) },
    goal,
    format: FORMAT_GOALS.includes(goal) ? (a.format === 'bootcamp' ? 'bootcamp' : 'gym') : null,
    sport: null,
    activity: null,
    priority_muscles: goal === 'muscle' ? (a.focus || []).slice(0, 2) : [],
    schedule: { days_per_week: a.days, weekdays: a.weekdays && a.weekdays.length ? sortWeekdays(a.weekdays) : null, start_date: a.start_date },
    plan: { mode: a.weeks === 8 ? 'fixed_8' : 'fixed_12', tests: a.tests && a.tests.length ? TEST_CHOICES.filter(t => a.tests.includes(t)) : ['none'] },
    equipment: { profile: a.equipment, extras: (a.extras || []).slice() },
    pain: (a.pain || []).filter(p => p && p.area && SEVERITIES.includes(p.severity)).map(p => ({ area: p.area, side: null, severity: p.severity, worse_with: [] })),
    prefs: { split_style: splitChoices(goal, a.days).includes(a.split) ? a.split : 'default', supersets_for_fatigue: a.supersets === 'more' }
  };
  if (goal === 'athletic') {
    const s = a.sport || {};
    const dated = s.season && s.season !== 'no_season';
    intake.sport = {
      competitive: 'competitive', sport: s.id, position: s.position || null, position_detail: s.detail || null,
      level_of_play: LEVELS_OF_PLAY.includes(s.level) ? s.level : null,
      season: { type: SEASON_TYPES.includes(s.season) ? s.season : 'no_season', date: dated ? s.season_date : null },
      practice: { practice_days_per_week: Number.isInteger(s.practice) ? s.practice : 0, game_days: [] }
    };
  }
  if (goal === 'active') {
    const ac = a.activity || {};
    intake.activity = { ids: ac.id ? [ac.id] : [], play_days: sortWeekdays(ac.play_days), event_date: ac.event_date || null };
    if (ac.league) intake.activity.league_sport = ac.league;
    if (ac.style) intake.activity.style = ac.style;
  }
  return intake;
}

/**
 * What the wizard still needs before a step can move on (the page disables Next and says why). Returns a UI key or null.
 * @param {string} step @param {object} a
 */
export function stepBlocker(step, a) {
  switch (step) {
    case 'about': return a.age >= 10 && a.age <= 90 && a.weight > 0 ? null : 'err.generic';
    case 'goal': return a.goal ? null : 'err.generic';
    case 'sport': {
      const s = a.sport || {};
      if (!s.id) return 'sport.search';
      if (s.season !== 'no_season' && !/^\d{4}-\d{2}-\d{2}$/.test(String(s.season_date || ''))) return 'sport.season_date';
      return null;
    }
    case 'activity': return a.activity && a.activity.id ? null : 'activity.search';
    case 'week':
      if ((a.weekdays || []).length !== a.days) return 'week.weekdays_hint';
      return /^\d{4}-\d{2}-\d{2}$/.test(String(a.start_date || '')) ? null : 'week.start';
    case 'health': return a.role === 'client' && a.health_route === 'coach_own_sop' ? null : (a.health ? null : 'health.pick');
    case 'accept': return a.accepted && (!isMinor(a) || a.guardian) ? null : 'accept.required';
    default: return null;
  }
}

/** the wizard's steps for these answers, in order */
export function stepsFor(a) {
  // (before a goal is picked the count assumes a detail step - most goals have one - so "Step n of 7" does not jump)
  const d = a.goal ? detailStepFor(a.goal) : 'sport';
  return ['about', 'goal', ...(d ? [d] : []), 'week', 'kit', 'health', 'accept'];
}

/**
 * The page's 4 screens (the coach's brief: few clicks, little scrolling). Each screen holds one or more of the steps above, so
 * every blocker and every intake field stays exactly the same:
 *   you    = about
 *   goal   = goal + its detail (sport / activity / focus / format), shown inline under the goal cards
 *   week   = week + kit (the equipment), with plan length, start date, split, tests and extra kit under "Options"
 *   safety = health (pain + health check) + accept (the release, H20)
 */
export const SCREENS = ['you', 'goal', 'week', 'safety'];
export function stepsOfScreen(screen, a) {
  switch (screen) {
    case 'you': return ['about'];
    case 'goal': { const d = a && a.goal ? detailStepFor(a.goal) : null; return d ? ['goal', d] : ['goal']; }
    case 'week': return ['week', 'kit'];
    case 'safety': return ['health', 'accept'];
    default: return [];
  }
}
/** what a screen still needs before it can move on: the first step blocker on it (a UI key) or null */
export function screenBlocker(screen, a) {
  for (const st of stepsOfScreen(screen, a)) { const b = stepBlocker(st, a); if (b) return b; }
  return null;
}
/** the screen that holds a step (to send an engine error back to the right screen) */
export function screenOfStep(step) {
  if (step === 'about') return 'you';
  if (['goal', 'sport', 'activity', 'focus', 'format'].includes(step)) return 'goal';
  if (step === 'week' || step === 'kit') return 'week';
  return 'safety';
}

/** set the day count and keep the chosen weekdays when they still fit, else the defaults */
export function withDays(a, days, defaults) {
  const def = (defaults && defaults.length === days ? defaults : DEFAULT_WEEKDAYS[days]).slice();
  return { ...a, days, weekdays: def };
}

/** toggle one weekday, never more than `days` picked (the oldest pick drops) */
export function toggleWeekday(list, wd, days) {
  const cur = sortWeekdays(list);
  if (cur.includes(wd)) return cur.filter(x => x !== wd);
  const next = [...cur, wd];
  return sortWeekdays(next.length > days ? next.slice(next.length - days) : next);
}

/**
 * The answers a sample intake corresponds to (tests and the QA harness: the 8 coach samples re-entered through the wizard's code path).
 * Fields the wizard does not ask (equipment detail, game days, growth stage ...) are left to the engine's defaults.
 */
export function answersFromIntake(i, todayIso) {
  const a = defaultAnswers(todayIso || (i.schedule && i.schedule.start_date) || '2026-10-12');
  a.role = i.role || 'self';
  if (i.health_route) a.health_route = i.health_route;
  a.age = i.age; a.weight = i.body_weight.value; a.unit = i.body_weight.unit || i.units || 'lb';
  a.years = i.experience.years_consistent;
  a.goal = i.goal; a.format = i.format || 'gym';
  if (i.sport) {
    a.sport = { id: i.sport.sport, position: i.sport.position || null, detail: i.sport.position_detail || null,
      season: i.sport.season ? i.sport.season.type : 'no_season', season_date: i.sport.season ? i.sport.season.date : null,
      level: i.sport.level_of_play || null, practice: i.sport.practice ? i.sport.practice.practice_days_per_week || 0 : 0 };
  }
  if (i.activity) a.activity = { id: i.activity.ids[0], play_days: i.activity.play_days || [], league: i.activity.league_sport || null, style: i.activity.style || null, event_date: i.activity.event_date || null };
  a.focus = (i.focus_muscles || i.priority_muscles || []).map(f => (f === 'side_delts' || f === 'rear_delts' ? 'shoulders' : f)).filter((f, k, arr) => arr.indexOf(f) === k);
  a.split = (i.prefs && i.prefs.split_style) || 'default';
  a.supersets = i.prefs && i.prefs.supersets_for_fatigue ? 'more' : 'normal';
  a.days = i.schedule.days_per_week; a.weekdays = i.schedule.weekdays || DEFAULT_WEEKDAYS[a.days].slice();
  a.start_date = i.schedule.start_date;
  a.weeks = i.plan && i.plan.mode === 'fixed_8' ? 8 : 12;
  a.tests = ((i.plan && i.plan.tests) || []).filter(t => t !== 'none');
  a.equipment = i.equipment.profile; a.extras = (i.equipment.extras || []).slice();
  a.pain = (i.pain || []).map(p => ({ area: p.area, severity: p.severity }));
  const anyYes = SAFETY_KEYS.some(k => i.safety && i.safety[k]);
  a.health = anyYes ? 'some' : 'none';
  a.safety = Object.fromEntries(SAFETY_KEYS.map(k => [k, !!(i.safety && i.safety[k])]));
  a.accepted = !!(i.release && i.release.accepted);
  a.guardian = !!(i.release && i.release.guardian);
  return a;
}
