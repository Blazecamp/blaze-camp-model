#!/usr/bin/env node
// agent/questions.mjs - the web tool's questions as data, for an AI agent that asks them in a conversation. Built from the same
// sources the wizard uses, so it never drifts: the answer fields and choices of app/intake-builder.js, the wizard's words
// (app/i18n.js with the brand's words), and the model's own words (model/i18n: sports, positions, places, pain areas, the health
// questions and the release texts, with the brand's legal wording). agent/questions.json is this output for the default brand;
// tests/agent-questions.test.mjs checks that it is current and that it covers every field buildIntake reads.
//   node agent/questions.mjs [--brand <id>] [--write]     prints the JSON (or writes agent/questions.json)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as B from '../app/intake-builder.js';
import { ui } from '../app/i18n.js';
import { brandUi } from '../app/brand-apply.js';
import { stripMarkers } from '../app/md.js';
import { loadBrand, modelFor, siteUrlFor, ROOT } from './core.mjs';

/** the rules an agent follows while asking (AGENT_PLAYBOOK.md says the same in full) */
export const AGENT_RULES = [
  'Ask the questions in this order, one or two at a time, offering the choices. Skip a question whose `when` does not hold. Keep the defaults the person does not care about.',
  'Never ask for sex, gender, sleep, stress, job, lifestyle or energy, and never ask how long a session should be: the plan has no such inputs (the engine refuses them).',
  'Ask all 5 health questions (or "none of these apply"). A yes does not stop the plan: it is built with a health warning (see a medical professional first). Never say which answer caused it.',
  'Before building, show the release text (release.<version> below, in the plan language) and get an explicit "I accept" from the person in this conversation (for role client: from the coach; under 18: from a parent or legal guardian, then guardian: true). Never assume or pre-tick acceptance. Only then send accepted: true.',
  'When the person building the plan is not the one talking to you (for example the coach sends it to a client), or they prefer to accept on the web page, give them the prefilled link instead: it opens the web tool with every answer filled in, and they answer the health check, accept the release and tap Build themselves.',
  'Nothing is stored: do not keep the answers after the plan is delivered.',
  'Talk in plain words (the coach\'s rule): short sentences, common words, one idea at a time, no jargon without a plain explanation ("reps left in the tank", not "RIR"). Keep exercise names as given, and show the release and the health warning exactly as given.'
];

/** every answer field buildIntake reads, with the question that fills it (tests/agent-questions.test.mjs) */
export async function buildQuestions(o = {}) {
  const brand = await loadBrand(o.brand);
  let site = null;
  try { site = siteUrlFor(brand, o.site); } catch { site = null; }
  // a brand with its own disclaimer pages and no known site: the words do not depend on the address; the link is left out
  const model = modelFor(brand, site || (brand.legal ? 'https://localhost/' : null));
  const T = brandUi(brand, ui);
  const app = (k, a) => ({ en: T('en', k, a), es: T('es', k, a) });
  const mt = (k, a) => ({ en: stripMarkers(model.t('en', k, a)), es: stripMarkers(model.t('es', k, a)) });
  const has = (k) => model.has('en', k);
  const verbatim = (k) => ({ en: model.t('en', k), es: model.t('es', k) });
  const def = B.defaultAnswers('2026-01-05');
  const P = model.profiles.picker;
  const R = model.rules;
  const L = R.legal || {};
  const opt = (value, label, sub) => ({ value, label, ...(sub ? { sub } : {}) });

  const sports = P.sports.map(s => ({
    value: s.id, label: mt(s.name_key), group: s.group,
    ...(s.positions && s.positions.length ? { positions: s.positions.map(p => opt(p.value, mt(p.name_key))) } : {}),
    ...(s.second_choice && (s.second_choice.options || []).length ? { second_choice: { label: mt(s.second_choice.name_key), options: s.second_choice.options.map(x => opt(x.value, mt(x.name_key))) } } : {})
  }));
  const activities = P.activities.map(a => ({
    value: a.id, label: mt(a.name_key),
    ...((a.league_sport || []).length ? { league: a.league_sport.map(x => opt(x.value, model.hasSport(x.profile) ? mt(model.sport(x.profile).name_key) : { en: x.value.replace(/_/g, ' '), es: x.value.replace(/_/g, ' ') })) } : {}),
    ...((a.style || []).length ? { style: a.style.map(x => opt(x.value, has('activity.style.' + x.value) ? mt('activity.style.' + x.value) : app('activity.style.' + x.value))) } : {}),
    ...(a.event_type ? { has_event_date: true } : {})
  }));
  const weekdays = B.WEEKDAYS.map(d => opt(d, mt('weekday.' + d)));

  const Q = [
    { id: 'lang', screen: 'start', prompt: app('lang.toggle'), type: 'choice', choices: [opt('en', { en: 'English', es: 'Inglés' }), opt('es', { en: 'Spanish', es: 'Español' })], default: brand.lang_default, required: true,
      notes: 'The plan language (not an answers field: pass it as `lang`). Ask in the person\'s language; both are complete.' },
    { id: 'role', screen: 'you', prompt: app('about.role'), type: 'choice', choices: [opt('self', app('about.role.self')), opt('client', app('about.role.client'))], default: def.role, required: true },
    { id: 'health_route', screen: 'safety', when: 'role == "client"', prompt: mt('intake.health_route.label'), type: 'choice', choices: ['coach_screen', 'coach_own_sop'].map(r => opt(r, mt('intake.health_route.opt.' + r))), default: def.health_route, required: true,
      notes: { en: 'coach_own_sop skips the health questions; the plan then prints: ' + stripMarkers(model.t('en', 'warn.coach_bypass')), es: stripMarkers(model.t('es', 'warn.coach_bypass')) } },
    { id: 'age', screen: 'you', prompt: app('about.age'), type: 'integer', min: 10, max: 90, default: def.age, required: true, notes: app('about.minor_note') },
    { id: 'weight', screen: 'you', prompt: app('about.weight'), type: 'number', min: 20, max: 700, default: def.weight, required: true },
    { id: 'unit', screen: 'you', prompt: mt('intake.units.label'), type: 'choice', choices: ['lb', 'kg'].map(u => opt(u, mt('intake.units.opt.' + u))), default: def.unit, required: true },
    { id: 'years', screen: 'you', prompt: app('about.years'), type: 'choice', choices: B.YEARS_CHOICES.map(y => opt(y, app('about.years.' + y))), default: def.years, required: true },
    { id: 'goal', screen: 'goal', prompt: app('screen.goal'), type: 'choice', choices: B.GOALS.map(g => opt(g, app('goal.' + g), app('goal.' + g + '.sub'))), default: null, required: true },
    { id: 'sport.id', screen: 'goal', when: 'goal == "athletic"', prompt: app('goal.pick_sport'), type: 'choice', choices: sports, default: null, required: true,
      notes: 'Each sport lists its positions (sport.position) and, for some, a second choice (sport.detail).' },
    { id: 'sport.position', screen: 'goal', when: 'goal == "athletic" and the sport has positions', prompt: app('sport.position_opt'), type: 'choice', choices_from: 'sport.id -> positions', default: null, required: false, notes: app('sport.position.any') },
    { id: 'sport.detail', screen: 'goal', when: 'goal == "athletic" and the sport has a second_choice', prompt: app('sport.detail'), type: 'choice', choices_from: 'sport.id -> second_choice.options', default: null, required: false },
    { id: 'sport.season', screen: 'goal', when: 'goal == "athletic"', prompt: app('sport.season'), type: 'choice', choices: B.SEASON_TYPES.map(s => opt(s, app('sport.season.' + s))), default: def.sport.season, required: false },
    { id: 'sport.season_date', screen: 'goal', when: 'sport.season != "no_season"', prompt: app('sport.season_date'), type: 'date', default: null, required: true },
    { id: 'sport.level', screen: 'goal', when: 'goal == "athletic"', prompt: app('sport.level'), type: 'choice', choices: B.LEVELS_OF_PLAY.map(l => opt(l, mt('intake.level_of_play.opt.' + l))), default: null, required: false },
    { id: 'sport.practice', screen: 'goal', when: 'goal == "athletic"', prompt: app('sport.practice'), type: 'integer', min: 0, max: 7, default: def.sport.practice, required: false,
      notes: 'Team practices are not built into the plan; the plan tells the athlete to account for them (CH5-01).' },
    { id: 'activity.id', screen: 'goal', when: 'goal == "active"', prompt: app('goal.pick_activity'), type: 'choice', choices: activities, default: null, required: true },
    { id: 'activity.league', screen: 'goal', when: 'goal == "active" and the activity has league choices', prompt: app('activity.league'), type: 'choice', choices_from: 'activity.id -> league', default: null, required: false },
    { id: 'activity.style', screen: 'goal', when: 'goal == "active" and the activity has style choices', prompt: app('activity.style'), type: 'choice', choices_from: 'activity.id -> style', default: null, required: false },
    { id: 'activity.play_days', screen: 'goal', when: 'goal == "active"', prompt: app('activity.play_days'), type: 'multi', choices: weekdays, default: [], required: false },
    { id: 'activity.event_date', screen: 'goal', when: 'goal == "active"', prompt: app('activity.event'), type: 'date', default: null, required: false, notes: app('activity.event_hint') },
    { id: 'focus', screen: 'goal', when: 'goal == "muscle"', prompt: app('focus.label'), type: 'multi', max_slots: 2, choices: B.FOCUS_CHOICES.map(f => opt(f, has('intake.focus.opt.' + f) ? mt('intake.focus.opt.' + f) : { en: f, es: f })), default: [], required: false,
      notes: { ...app('focus.intro'), rule: 'At most 2 slots; v_taper takes both.' } },
    { id: 'format', screen: 'goal', when: 'goal in ["fat_loss", "general"]', prompt: app('format.label'), type: 'choice', choices: ['gym', 'bootcamp'].map(f => opt(f, app('format.' + f), app('format.' + f + '.sub'))), default: def.format, required: false },
    { id: 'days', screen: 'week', prompt: app('week.days'), type: 'choice', choices: B.DAYS_CHOICES.map(d => opt(d, { en: String(d), es: String(d) })), default: def.days, required: true, notes: app('week.two_day_note') },
    { id: 'weekdays', screen: 'week', prompt: app('week.weekdays'), type: 'multi', choices: weekdays, default: null, required: false,
      notes: 'Exactly `days` weekdays, or leave it out: the plan then uses its template\'s own days.' },
    { id: 'equipment', screen: 'week', prompt: app('week.kit'), type: 'choice', choices: R.equipment.intake_profiles.map(p => opt(p, mt('intake.equipment.opt.' + p), app('kit.sub.' + p))), default: def.equipment, required: true },
    { id: 'split', screen: 'week', when: 'goal == "muscle" and days in [4, 6]', prompt: app('week.split'), type: 'choice', choices: ['default', 'upper_lower', 'ppl'].map(s => opt(s, app('week.split.' + s))), default: def.split, required: false,
      notes: 'upper_lower only with 4 days, ppl only with 6 days.' },
    { id: 'supersets', screen: 'week', prompt: app('week.supersets'), type: 'choice', choices: ['normal', 'more'].map(s => opt(s, app('week.supersets.' + s))), default: def.supersets, required: false,
      notes: 'more = the template\'s exercise pairs are done as supersets (CH7-07).' },
    { id: 'weeks', screen: 'week', prompt: app('week.length'), type: 'choice', choices: [12, 8].map(w => opt(w, app('week.length.' + w))), default: def.weeks, required: false },
    { id: 'start_date', screen: 'week', prompt: app('week.start'), type: 'date', default: null, required: false, notes: 'Default: the next Monday.' },
    { id: 'tests', screen: 'week', prompt: app('week.tests'), type: 'multi', choices: B.TEST_CHOICES.map(t => opt(t, mt('intake.tests.opt.' + t))), default: [], required: false, notes: 'Tests only in week 1 and the last week.' },
    { id: 'extras', screen: 'week', prompt: app('kit.extras'), type: 'multi', choices: B.EXTRA_CHOICES.map(x => opt(x, mt('equipment.token.' + x))), default: [], required: false },
    { id: 'pain', screen: 'safety', prompt: app('health.pain'), type: 'list', item: { area: Object.keys(R.volume.pain.areas).map(a => opt(a, mt('intake.pain.opt.' + a))), severity: B.SEVERITIES.map(s => opt(s, app('health.sev.' + s))) },
      default: [], required: false, notes: { ...app('health.pain_hint'), shape: '[{area, severity}]; an empty list = nothing hurts. Severe pain is planned with the moderate pain rules and the health warning.' } },
    { id: 'health', screen: 'safety', when: 'not (role == "client" and health_route == "coach_own_sop")', prompt: app('health.questions'), intro: mt('health.intro'), type: 'choice',
      choices: [opt('none', mt('health.none')), opt('some', mt('health.some'))], default: null, required: true,
      questions: B.SAFETY_KEYS.map(k => ({ key: k, prompt: mt('intake.safety.opt.' + k) })),
      notes: { ...app('health.warn_note'), parq: L.parq_url || null, rule: 'Read the 5 questions to the person. "some" -> ask each one yes / no and send safety {key: true|false}.' } },
    { id: 'safety', screen: 'safety', when: 'health == "some"', prompt: mt('intake.safety.label'), type: 'yes_no_each', keys: B.SAFETY_KEYS, default: def.safety, required: true },
    { id: 'accepted', screen: 'safety', prompt: app('safety.release'), type: 'release', default: false, required: true,
      notes: 'Show the release text for the version that applies (release.client for the person themselves, release.coach for a coach building for a client, release.minor in addition under 18), then ask for an explicit "I accept". Never assume it.' },
    { id: 'guardian', screen: 'safety', when: 'age < 18', prompt: app('accept.guardian'), type: 'boolean', default: false, required: true, notes: mt('release.minor') }
  ];

  const url = site && L.disclaimer_url ? { en: L.disclaimer_url.en, es: L.disclaimer_url.es } : (!brand.legal && L.disclaimer_url ? { en: L.disclaimer_url.en, es: L.disclaimer_url.es } : null);
  return {
    schema: 'agent-questions/1',
    brand: brand.id,
    brand_name: brand.name,
    model_version: model.version,
    answers_shape: 'app/intake-builder.js > defaultAnswers: send only what you asked; the rest keeps the defaults. Dotted ids are nested (sport.id -> {sport: {id}}).',
    rules: AGENT_RULES,
    never_ask: ['sex', 'gender', 'sleep', 'stress', 'job', 'life', 'energy', 'recovery', 'session length / minutes'],
    release: {
      versions: {
        'release.client': { who: 'the person builds their own plan (role self, 18 or older)', text: verbatim('release.client') },
        'release.coach': { who: 'a coach builds for a client (role client)', text: verbatim('release.coach') },
        'release.minor': { who: 'the athlete is under 18: a parent or legal guardian reads and accepts it (guardian: true)', text: verbatim('release.minor') }
      },
      accept_line: mt('release.own_risk'),
      full_text: url,
      markers: '[LEGAL REVIEW] / [REVISIÓN LEGAL] are reviewer notes kept in the model; the web tool hides them. The sentences are the release as written.'
    },
    questions: Q
  };
}

/** the questions with only one language's words ({en, es} -> the one string; extra keys kept beside it as `text`) */
export function questionsInLang(v, l) {
  if (Array.isArray(v)) return v.map(x => questionsInLang(x, l));
  if (v && typeof v === 'object') {
    if (typeof v.en === 'string' && typeof v.es === 'string') {
      const { en, es, ...rest } = v;
      void en; void es;
      return Object.keys(rest).length ? { text: v[l], ...questionsInLang(rest, l) } : v[l];
    }
    return Object.fromEntries(Object.entries(v).map(([k, x]) => [k, questionsInLang(x, l)]));
  }
  return v;
}

// CLI: print or write agent/questions.json
if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const arg = (n) => { const i = process.argv.indexOf(n); return i > 0 ? process.argv[i + 1] : undefined; };
  const q = await buildQuestions({ brand: arg('--brand'), site: arg('--site') });
  const json = JSON.stringify(q, null, 1) + '\n';
  if (process.argv.includes('--write')) { fs.writeFileSync(path.join(ROOT, 'agent', 'questions.json'), json); console.log('wrote agent/questions.json'); } else process.stdout.write(json);
}
