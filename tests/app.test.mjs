// tests/app.test.mjs - the Plan Builder's pure modules (app/): the UI words in English and Spanish, the wizard answers -> intake/2
// mapping (every choice gives an intake the engine accepts), the plan view model, and the product rules the page must keep
// (no stored data, no sex / lifestyle / session-length field, the release gate). The browser checks live in app/README.md.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, loadCompiledModel } from './helpers/models.mjs';
import { validateIntake } from '../engine/intake.mjs';
import { generate } from '../engine/generate.mjs';
import { STRINGS, ui, initialLang } from '../app/i18n.js';
import * as B from '../app/intake-builder.js';
import * as V from '../app/plan-view.js';
import { inline, markdown, stripMarkers, plain } from '../app/md.js';

const model = loadCompiledModel();
const TODAY = '2026-10-13';
const ok = (a) => ({ ...a, accepted: true, guardian: true, health: a.health || 'none' });
const check = (a, label) => {
  const intake = B.buildIntake(ok(a), { lang: a.lang || 'en' });
  const v = validateIntake(intake, model);
  assert.ok(v.ok, `${label}: ${JSON.stringify(v.errors)}`);
  return v;
};

test('app i18n: English and Spanish hold the same keys, none empty, the same placeholders', () => {
  const en = Object.keys(STRINGS.en).sort(), es = Object.keys(STRINGS.es).sort();
  assert.deepEqual(es, en);
  for (const k of en) {
    for (const l of ['en', 'es']) assert.ok(String(STRINGS[l][k]).trim().length > 0, `${l} ${k} empty`);
    const ph = (s) => (String(s).match(/\{\w+\}/g) || []).sort().join(',');
    assert.equal(ph(STRINGS.es[k]), ph(STRINGS.en[k]), `placeholders of ${k}`);
  }
  assert.equal(ui('es', 'nav.step', { n: 2, total: 7 }), 'Paso 2 de 7');
  assert.equal(initialLang(null, 'es-MX'), 'es');
  assert.equal(initialLang(null, 'en-US'), 'en');
  assert.equal(initialLang('en', 'es-MX'), 'en');
});

test('app i18n: every model key the page reads exists in English and Spanish', () => {
  const src = ['main.js', 'plan-view.js'].map(f => fs.readFileSync(path.join(ROOT, 'app', f), 'utf8')).join('\n');
  const keys = new Set([...src.matchAll(/mt\('([a-z_.]+[a-z_])'/g)].map(m => m[1]));
  for (const k of keys) for (const l of ['en', 'es']) assert.ok(model.has(l, k), `${l}: ${k}`);
  for (const p of model.rules.equipment.intake_profiles) for (const l of ['en', 'es']) assert.ok(model.has(l, 'intake.equipment.opt.' + p), p);
  for (const k of B.SAFETY_KEYS) for (const l of ['en', 'es']) assert.ok(model.has(l, 'intake.safety.opt.' + k), k);
  for (const f of B.FOCUS_CHOICES) for (const l of ['en', 'es']) assert.ok(model.has(l, 'intake.focus.opt.' + f), f);
  for (const x of B.TEST_CHOICES) for (const l of ['en', 'es']) assert.ok(model.has(l, 'intake.tests.opt.' + x), x);
  for (const x of B.EXTRA_CHOICES) assert.ok(model.has('en', 'equipment.token.' + x), x);
  for (const ar of Object.keys(model.rules.volume.pain.areas)) assert.ok(model.has('es', 'intake.pain.opt.' + ar), ar);
  for (const p of model.rules.equipment.intake_profiles) assert.ok(STRINGS.en['kit.sub.' + p] && STRINGS.es['kit.sub.' + p], p);
});

test('app wizard: every goal x days x equipment x age gives an intake the engine accepts', () => {
  const sports = model.profiles.picker.sports, acts = model.profiles.picker.activities;
  let n = 0;
  for (const goal of B.GOALS) for (const days of B.DAYS_CHOICES) for (const equipment of model.rules.equipment.intake_profiles) for (const age of [15, 34, 67]) {
    const a = B.defaultAnswers(TODAY);
    a.goal = goal; a.age = age; a.equipment = equipment;
    Object.assign(a, B.withDays(a, days, null));
    if (goal === 'athletic') {
      const s = sports[n % sports.length];
      a.sport = { ...a.sport, id: s.id, position: s.positions.length ? s.positions[n % s.positions.length].value : null, season: B.SEASON_TYPES[n % 4], season_date: '2027-03-01', practice: n % 8 };
    }
    if (goal === 'active') { const ac = acts[n % acts.length]; a.activity = { ...a.activity, id: ac.id, play_days: ['Sat'], event_date: n % 2 ? '2027-02-14' : null }; }
    if (goal === 'muscle') a.focus = [['chest', 'back'], ['v_taper'], [], ['glutes']][n % 4];
    if (B.FORMAT_GOALS.includes(goal)) a.format = n % 2 ? 'bootcamp' : 'gym';
    a.unit = n % 2 ? 'kg' : 'lb'; a.weight = a.unit === 'kg' ? 80 : 175;
    a.years = B.YEARS_CHOICES[n % B.YEARS_CHOICES.length];
    a.weeks = n % 3 ? 12 : 8;
    a.split = (B.splitChoices(goal, days)[1]) || 'default';
    a.tests = n % 5 ? [] : ['strength', 'body'];
    check(a, `${goal}/${days}/${equipment}/${age}`);
    n++;
  }
  assert.ok(n >= 700);
});

test('app wizard: every sport, position, second choice and activity option is accepted', () => {
  for (const s of model.profiles.picker.sports) {
    for (const p of [null, ...s.positions.map(x => x.value)]) {
      const a = { ...B.defaultAnswers(TODAY), goal: 'athletic' };
      a.sport = { ...a.sport, id: s.id, position: p, detail: s.second_choice ? s.second_choice.options[0].value : null };
      check(a, `${s.id}/${p}`);
    }
  }
  for (const ac of model.profiles.picker.activities) {
    for (const extra of [{}, ...ac.league_sport.map(x => ({ league: x.value })), ...ac.style.map(x => ({ style: x.value }))]) {
      const a = { ...B.defaultAnswers(TODAY), goal: 'active' };
      a.activity = { ...a.activity, id: ac.id, play_days: ['Wed', 'Sun'], ...extra };
      check(a, `${ac.id}/${JSON.stringify(extra)}`);
    }
  }
});

test('app wizard: pain, health answers, coach mode and the release versions', () => {
  for (const area of Object.keys(model.rules.volume.pain.areas)) for (const severity of B.SEVERITIES) {
    check({ ...B.defaultAnswers(TODAY), goal: 'general', pain: [{ area, severity }] }, `${area}/${severity}`);
  }
  const yes = { ...B.defaultAnswers(TODAY), goal: 'strength', health: 'some', safety: { ...B.defaultAnswers(TODAY).safety, heart: true } };
  assert.equal(B.buildIntake(yes).safety.heart, true);
  // 'None of these apply' clears any yes the person toggled before
  assert.equal(B.buildIntake({ ...yes, health: 'none' }).safety.heart, false);
  check(yes, 'health yes');
  check({ ...B.defaultAnswers(TODAY), goal: 'general', role: 'client', health_route: 'coach_own_sop' }, 'coach bypass');
  check({ ...B.defaultAnswers(TODAY), goal: 'general', role: 'client', health_route: 'coach_screen' }, 'coach screen');
  assert.equal(B.releaseVersion({ age: 16, role: 'self' }), 'release.minor');
  assert.equal(B.releaseVersion({ age: 16, role: 'client' }), 'release.minor');
  assert.equal(B.releaseVersion({ age: 30, role: 'client' }), 'release.coach');
  assert.equal(B.releaseVersion({ age: 30, role: 'self' }), 'release.client');
  // H20: without the box ticked, no plan (the engine refuses; the page's Build button stays disabled)
  const noRelease = B.buildIntake({ ...B.defaultAnswers(TODAY), goal: 'general', health: 'none' });
  assert.equal(validateIntake(noRelease, model).ok, false);
  assert.equal(B.stepBlocker('accept', { ...B.defaultAnswers(TODAY), age: 30 }), 'accept.required');
  // a minor needs the guardian's box too
  assert.equal(B.stepBlocker('accept', { ...B.defaultAnswers(TODAY), age: 16, accepted: true, guardian: false }), 'accept.required');
  assert.equal(B.stepBlocker('accept', { ...B.defaultAnswers(TODAY), age: 16, accepted: true, guardian: true }), null);
  assert.equal(B.buildIntake({ ...B.defaultAnswers(TODAY), age: 16, accepted: true, guardian: false }).release.guardian, false);
});

test('app wizard: no sex, gender, lifestyle or session-length field ever (H13, H16, CT-01)', () => {
  const intake = B.buildIntake(ok({ ...B.defaultAnswers(TODAY), goal: 'athletic', sport: { ...B.defaultAnswers(TODAY).sport, id: 'soccer' } }));
  const keys = JSON.stringify(intake);
  for (const k of ['sex', 'gender', 'sleep', 'stress', 'job', 'life', 'energy', 'session_minutes', 'email']) assert.ok(!new RegExp(`"${k}"`).test(keys), k);
});

test('app wizard: helpers - weekdays, Focus slots, steps, start date', () => {
  assert.equal(B.nextMonday('2026-10-13'), '2026-10-19');
  assert.equal(B.nextMonday('2026-10-12'), '2026-10-12');
  assert.equal(B.nextMonday('2026-10-18'), '2026-10-19');
  assert.deepEqual(B.toggleWeekday(['Mon', 'Wed', 'Fri'], 'Tue', 3), ['Tue', 'Wed', 'Fri']);
  assert.deepEqual(B.toggleWeekday(['Mon', 'Wed'], 'Fri', 3), ['Mon', 'Wed', 'Fri']);
  assert.deepEqual(B.toggleWeekday(['Mon', 'Wed', 'Fri'], 'Wed', 3), ['Mon', 'Fri']);
  assert.deepEqual(B.toggleFocus(['chest'], 'back'), ['chest', 'back']);
  assert.deepEqual(B.toggleFocus(['chest', 'back'], 'glutes'), ['back', 'glutes']);
  assert.deepEqual(B.toggleFocus(['chest'], 'v_taper'), ['v_taper']);
  assert.deepEqual(B.toggleFocus(['v_taper'], 'chest'), ['chest']);
  assert.equal(B.focusSlots(['v_taper']), 2);
  assert.deepEqual(B.stepsFor({ goal: 'strength' }), ['about', 'goal', 'week', 'kit', 'health', 'accept']);
  assert.deepEqual(B.stepsFor({ goal: 'athletic' }), ['about', 'goal', 'sport', 'week', 'kit', 'health', 'accept']);
  assert.equal(B.stepsFor({ goal: null }).length, 7);
  assert.equal(B.stepBlocker('week', { ...B.defaultAnswers(TODAY), days: 4 }), 'week.weekdays_hint');
});

test('app wizard: the 8 coach samples, re-entered as wizard answers, are accepted', () => {
  for (const f of fs.readdirSync(path.join(ROOT, 'samples', 'intakes'))) {
    const i = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples', 'intakes', f), 'utf8'));
    const a = B.answersFromIntake(i);
    const v = validateIntake(B.buildIntake(a, { lang: i.lang }), model);
    assert.ok(v.ok, f + ' ' + JSON.stringify(v.errors));
    assert.equal(v.intake.goal, i.goal);
    assert.equal(v.intake.schedule.days_per_week, i.schedule.days_per_week);
    assert.equal(v.intake.equipment.profile, i.equipment.profile);
  }
});

test('app build + view: plans from wizard answers render every day in EN and ES with no raw key', () => {
  const cases = [
    { goal: 'general', days: 2 },
    { goal: 'fat_loss', format: 'bootcamp', days: 3, equipment: 'FIELD_TRACK_KIT', extras: ['dumbbell', 'kettlebell'] },
    { goal: 'athletic', days: 3, sport: { ...B.defaultAnswers(TODAY).sport, id: 'basketball' } },
    { goal: 'active', days: 4, activity: { id: 'crossfit_class', play_days: [], league: null, style: null, event_date: null }, equipment: 'HOME_BARBELL' },
    { goal: 'strength', days: 3, age: 16, health: 'some', safety: { ...B.defaultAnswers(TODAY).safety, surgery_6mo: true } }
  ];
  const RAW = /\b(?:ui\.plan|intake\.|warning\.|note\.|exercise\.|why\.|slot\.|reps\.|effort\.|block\.|group\.|refer\.|guide\.)[a-z_]/;
  for (const c of cases) {
    const a = ok({ ...B.defaultAnswers(TODAY), ...c });
    Object.assign(a, B.withDays(a, a.days, null));
    const plan = generate(B.buildIntake(a), model);
    assert.equal(plan.status, 'ok', JSON.stringify(c));
    if (c.health === 'some') assert.equal(plan.meta.health.warn, true);
    if (c.age === 16) assert.equal(plan.release_stamp.version, 'release.minor');
    for (const lang of ['en', 'es']) {
      const lg = V.legal(plan, model, lang);
      assert.ok(lg.short && lg.full && lg.url, 'release line');
      if (c.health === 'some') assert.ok(lg.health && lg.health.line && !/LEGAL|REVISIÓN/.test(lg.health.line));
      for (const w of plan.weeks) {
        const wi = V.weekInfo(plan, model, lang, w.n);
        assert.ok(wi.phase, 'phase');
        for (const tab of V.dayTabs(plan, w.n)) {
          const card = V.dayCard(plan, model, lang, w.n, tab.weekday);
          if (['main', 'optional', 'aerobic'].includes(card.kind)) assert.ok(card.mapped, `${c.goal} W${w.n} ${tab.weekday} mapped`);
          const s = JSON.stringify(card);
          assert.ok(!/undefined|NaN|\[object/.test(s), s.slice(0, 200));
          assert.ok(!RAW.test(card.blocks.map(b => b.items.map(r => r.name + r.dose + r.meta.join('')).join('')).join('')), `${c.goal} raw key`);
        }
      }
      const grid = V.setsGrid(plan, model, lang);
      for (const g of grid) for (const r of g.rows) assert.equal(r.values.length, g.to - g.from + 1, r.name);
      assert.ok(V.planSections(plan, model, lang).some(x => x.id === 'progress'));
    }
  }
});

test('app markdown: escapes HTML, keeps the engine escapes, hides reviewer markers, http links only', () => {
  assert.equal(inline('<b>x</b>'), '&lt;b&gt;x&lt;/b&gt;');
  assert.equal(inline('**Name \\(bonus\\)**'), '<strong>Name (bonus)</strong>');
  assert.equal(inline('a [Watch](https://www.youtube.com/results?search_query=a%20b) · `Copy`'), 'a <a href="https://www.youtube.com/results?search_query=a%20b" target="_blank" rel="noopener noreferrer">Watch</a> · <code>Copy</code>');
  assert.equal(inline('[x](javascript:alert(1))').includes('javascript'), false);
  assert.equal(stripMarkers('See a professional. [LEGAL REVIEW]'), 'See a professional.');
  assert.equal(stripMarkers('Hola. [REVISIÓN LEGAL: texto provisional]'), 'Hola.');
  assert.equal(plain('_hi_ **there**'), 'hi there');
  assert.ok(markdown('| A | B |\n|---|---|\n| 1 | 2 |').includes('<td>1</td>'));
});

test('app: the page keeps no data - no storage but the language choice, no network but its own files', () => {
  const dir = path.join(ROOT, 'app');
  const src = fs.readdirSync(dir).filter(f => f.endsWith('.js')).map(f => [f, fs.readFileSync(path.join(dir, f), 'utf8')]);
  for (const [f, s] of src) {
    assert.ok(!/sessionStorage|indexedDB|document\.cookie|sendBeacon|XMLHttpRequest/.test(s), f);
    const ls = s.match(/localStorage\.(\w+)\(([^)]*)\)/g) || [];
    for (const call of ls) assert.ok(/'bc\.lang'/.test(call), `${f}: ${call}`);
    for (const m of s.matchAll(/fetch\(([^,)]+)/g)) assert.ok(!/https?:/.test(m[1]), `${f}: ${m[0]}`);
  }
  // pure modules: no DOM
  for (const f of ['i18n.js', 'intake-builder.js', 'plan-view.js', 'md.js']) {
    const s = fs.readFileSync(path.join(dir, f), 'utf8');
    assert.ok(!/\b(document|window|localStorage|navigator)\./.test(s), f);
  }
  const html = fs.readFileSync(path.join(dir, 'index.html'), 'utf8');
  assert.ok(!/<script[^>]+src="https?:/.test(html), 'no external script');
});

test('app site build: tools/build-site.mjs copies only the tool, with paths that resolve inside the site', async () => {
  const { execFileSync } = await import('node:child_process');
  const os = await import('node:os');
  const out = fs.mkdtempSync(path.join(os.tmpdir(), 'bc-site-'));
  try {
    execFileSync(process.execPath, [path.join(ROOT, 'tools', 'build-site.mjs'), '--out', out], { stdio: 'pipe' });
    for (const f of ['index.html', 'main.js', 'worker.js', 'engine/generate.mjs', 'engine/progression/stairway.mjs', 'model/rules.json', 'model/i18n/es.json', 'DISCLAIMER.md', 'DISCLAIMER.es.md', 'LICENSE']) {
      assert.ok(fs.existsSync(path.join(out, f)), f);
    }
    for (const f of ['engine/fixtures', 'samples', 'raw', 'dumps', 'tests', 'screenshots', 'model/CHANGELOG.md']) assert.ok(!fs.existsSync(path.join(out, f)), f);
    const main = fs.readFileSync(path.join(out, 'main.js'), 'utf8');
    assert.ok(main.includes("'./engine/intake.mjs'") && !main.includes("'../"));
    const vercel = JSON.parse(fs.readFileSync(path.join(ROOT, 'vercel.json'), 'utf8'));
    assert.equal(vercel.buildCommand, 'node tools/build-site.mjs');
    assert.equal(vercel.outputDirectory, 'site');
  } finally { fs.rmSync(out, { recursive: true, force: true }); }
});
