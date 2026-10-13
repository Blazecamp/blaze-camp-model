// tests/agent-questions.test.mjs - the questions an AI agent asks (agent/questions.mjs, agent/questions.json): built from the
// wizard's own sources, current, covering every answer field app/intake-builder.js > buildIntake reads, with the health
// questions and the release texts verbatim from the model; never a forbidden input.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from './helpers/models.mjs';
import * as B from '../app/intake-builder.js';
import { buildQuestions, questionsInLang, AGENT_RULES } from '../agent/questions.mjs';

const withoutSiteEnv = async (fn) => {
  const saved = {};
  for (const k of Object.keys(process.env)) if (k === 'SITE_URL' || k.startsWith('SITE_URL_') || k === 'BRAND') { saved[k] = process.env[k]; delete process.env[k]; }
  try { return await fn(); } finally { Object.assign(process.env, saved); }
};

/** every answer path buildIntake reads (a Proxy records the reads) over answers that take every branch */
function pathsRead() {
  const seen = new Set();
  const spy = (obj, prefix) => new Proxy(obj, {
    get(t, k) {
      if (typeof k !== 'string') return t[k];
      const p = prefix ? prefix + '.' + k : k;
      seen.add(p);
      const v = t[k];
      return v && typeof v === 'object' && !Array.isArray(v) ? spy(v, p) : v;
    }
  });
  const base = B.defaultAnswers('2026-10-12');
  const variants = [
    { goal: 'muscle', focus: ['chest'], days: 4, split: 'upper_lower' },
    { goal: 'athletic', sport: { ...base.sport, id: 'soccer', position: 'winger', season: 'next_season_start', season_date: '2027-02-01', level: 'college', practice: 3 } },
    { goal: 'active', activity: { ...base.activity, id: 'rec_league', league: 'soccer', play_days: ['Sat'], event_date: '2027-01-10' } },
    { goal: 'fat_loss', format: 'bootcamp', role: 'client', health_route: 'coach_own_sop' },
    { goal: 'general', age: 16, guardian: true, health: 'some', safety: { ...base.safety, heart: true }, pain: [{ area: 'knee', severity: 'mild' }], tests: ['strength'], extras: ['dumbbell'] }
  ];
  for (const v of variants) B.buildIntake(spy({ ...base, ...v, accepted: true }, ''), { lang: 'en' });
  return [...seen];
}

test('agent questions: cover every answer field buildIntake reads', async () => {
  const q = await withoutSiteEnv(() => buildQuestions({ brand: 'blazecamp' }));
  const ids = new Set(q.questions.map(x => x.id));
  const read = pathsRead();
  assert.ok(read.length > 20, 'the spy saw the reads');
  for (const p of read) {
    const top = p.split('.')[0];
    const id = top === 'safety' ? 'safety' : (['sport', 'activity'].includes(top) && p.includes('.') ? p : top);
    if (['sport', 'activity'].includes(id)) continue;   // the object itself; its fields are checked one by one
    assert.ok(ids.has(id), `buildIntake reads ${p}: question ${id}`);
  }
  // and every defaultAnswers key has a question (sport / activity through their fields)
  for (const k of Object.keys(B.defaultAnswers('2026-10-12'))) {
    if (k === 'sport' || k === 'activity') assert.ok([...ids].some(i => i.startsWith(k + '.')), k);
    else assert.ok(ids.has(k), `answer ${k} has a question`);
  }
});

test('agent questions: agent/questions.json is current (node agent/questions.mjs --write)', async () => {
  const q = await withoutSiteEnv(() => buildQuestions({ brand: 'blazecamp' }));
  const file = JSON.parse(fs.readFileSync(path.join(ROOT, 'agent/questions.json'), 'utf8'));
  assert.deepEqual(file, JSON.parse(JSON.stringify(q)));
});

test('agent questions: no forbidden input, the release verbatim, the 5 health questions, EN and ES complete', async () => {
  const q = await withoutSiteEnv(() => buildQuestions({ brand: 'blazecamp' }));
  const en = JSON.parse(fs.readFileSync(path.join(ROOT, 'model/i18n/en.json'), 'utf8'));
  const es = JSON.parse(fs.readFileSync(path.join(ROOT, 'model/i18n/es.json'), 'utf8'));
  for (const v of ['release.client', 'release.coach', 'release.minor']) {
    assert.equal(q.release.versions[v].text.en, en[v], `${v} EN verbatim`);
    assert.equal(q.release.versions[v].text.es, es[v], `${v} ES verbatim`);
  }
  const ids = q.questions.map(x => x.id);
  for (const bad of ['sex', 'gender', 'sleep', 'stress', 'job', 'life', 'energy', 'session_minutes', 'minutes']) assert.ok(!ids.some(i => i.split('.').pop() === bad), bad);
  assert.doesNotMatch(JSON.stringify(q.questions), /session_minutes|"sex"|"gender"/);
  const h = q.questions.find(x => x.id === 'health');
  assert.deepEqual(h.questions.map(x => x.key), B.SAFETY_KEYS);
  assert.ok(AGENT_RULES.some(r => /I accept/.test(r)) && AGENT_RULES.some(r => /Never assume/.test(r)));
  // every word in both languages
  const walk = (v, p) => {
    if (v && typeof v === 'object' && typeof v.en === 'string') { assert.ok(v.en && typeof v.es === 'string' && v.es, `${p}: EN and ES`); return; }
    if (v && typeof v === 'object') for (const [k, x] of Object.entries(v)) walk(x, p + '.' + k);
  };
  walk(q.questions, 'questions');
  // sports, positions and activities come from the model's picker
  const sport = q.questions.find(x => x.id === 'sport.id');
  assert.equal(sport.choices.length, 52);
  assert.equal(q.questions.find(x => x.id === 'activity.id').choices.length, 26);
  // one language
  const one = questionsInLang(q, 'es');
  assert.equal(one.questions.find(x => x.id === 'goal').choices[0].label, 'Ganar músculo');
});

test('agent questions: Son Hábitos - its legal party wording, no other brand', async () => {
  const q = await withoutSiteEnv(() => buildQuestions({ brand: 'sonhabitos', site: 'https://plan.example.org/' }));
  assert.equal(q.brand, 'sonhabitos');
  assert.ok(q.release.versions['release.client'].text.en.includes('Lalo Vera and BFit Studios Corp., doing business as Son Hábitos'));
  assert.equal(q.release.full_text.es, 'https://plan.example.org/disclaimer.es.html');
  const s = JSON.stringify(q).split('Lalo Vera and BFit Studios Corp., doing business as Son Hábitos').join('').split('Lalo Vera y BFit Studios Corp., que opera como Son Hábitos').join('');
  assert.doesNotMatch(s, /blaze|\blalo\b|\bgerardo\b/i);
});
