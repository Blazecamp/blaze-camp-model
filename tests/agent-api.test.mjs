// tests/agent-api.test.mjs - the HTTP API (agent/http.mjs behind api/*.mjs on Vercel), called with mock req / res the way the
// Vercel Node runtime calls a function: questions, a plan as Markdown / JSON / PDF, the liability gate (no accepted release ->
// error), a forbidden key -> error, missing answers -> the problems and the prefilled link, no-store on every response.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { ROOT } from './helpers/models.mjs';
import plan from '../api/plan.mjs';
import questions from '../api/questions.mjs';
import openapi from '../api/openapi.mjs';
import { decodePrefill } from '../app/prefill.js';
import * as B from '../app/intake-builder.js';

const intake08 = () => JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/intakes/08-pickleball-genpop.json'), 'utf8'));

/** a request as Vercel gives it (a readable stream with headers; body unparsed) and a response that records what is sent */
function call(handler, { method = 'GET', url = '/', body, headers = {} } = {}) {
  const req = Readable.from(body === undefined ? [] : [Buffer.from(typeof body === 'string' ? body : JSON.stringify(body))]);
  Object.assign(req, { method, url, headers: { host: 'plan.example.org', 'x-forwarded-proto': 'https', ...headers } });
  return new Promise((resolve, reject) => {
    const res = {
      statusCode: 200, headers: {},
      setHeader(k, v) { this.headers[k.toLowerCase()] = v; },
      end(b) {
        const buf = Buffer.isBuffer(b) ? b : Buffer.from(b || '');
        const type = this.headers['content-type'] || '';
        resolve({ status: this.statusCode, headers: this.headers, buf, json: type.startsWith('application/json') ? JSON.parse(buf.toString('utf8')) : null, text: buf.toString('utf8') });
      }
    };
    Promise.resolve(handler(req, res)).catch(reject);
  });
}

const env = (vars, fn) => async () => {
  const saved = {};
  for (const k of ['BRAND', 'SITE_URL', 'SITE_URL_BLAZECAMP', 'SITE_URL_SONHABITOS']) { saved[k] = process.env[k]; delete process.env[k]; }
  Object.assign(process.env, vars);
  try { await fn(); } finally { for (const [k, v] of Object.entries(saved)) { if (v === undefined) delete process.env[k]; else process.env[k] = v; } }
};

test('api: GET /api/questions (EN and one language), no-store; POST is refused', env({}, async () => {
  const r = await call(questions, { url: '/api/questions?lang=es' });
  assert.equal(r.status, 200);
  assert.equal(r.headers['cache-control'], 'no-store');
  assert.equal(r.json.brand, 'blazecamp');
  assert.equal(r.json.questions.find(q => q.id === 'goal').prompt, 'Tu objetivo');
  const both = await call(questions, { url: '/api/questions' });
  assert.equal(both.json.questions.find(q => q.id === 'goal').prompt.en, 'Your goal');
  assert.equal((await call(questions, { method: 'POST', url: '/api/questions' })).status, 405);
}));

test('api: POST /api/plan - an intake as Markdown (overview), JSON and PDF', env({}, async () => {
  const md = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: intake08(), format: 'md' } });
  assert.equal(md.status, 200, md.text.slice(0, 300));
  assert.equal(md.headers['cache-control'], 'no-store');
  assert.equal(md.json.status, 'ok');
  assert.match(md.json.markdown, /Use at your own risk/);
  assert.match(md.json.markdown, /Model by Coach Lalo/);
  assert.equal(md.json.summary.days_per_week, 2);
  const raw = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: intake08(), format: 'md', view: 'week', weeks: [1] }, headers: { accept: 'text/markdown' } });
  assert.match(raw.headers['content-type'], /text\/markdown/);
  assert.match(raw.text, /Week 1/);
  const js = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: intake08() } });
  assert.equal(js.json.plan.status, 'ok');
  assert.equal(js.json.plan.weeks.length, 12);
  const pdf = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: intake08(), format: 'pdf', lang: 'es' } });
  assert.equal(pdf.headers['content-type'], 'application/pdf');
  assert.equal(pdf.buf.subarray(0, 5).toString('latin1'), '%PDF-');
  assert.match(pdf.headers['content-disposition'], /Blaze-Camp-plan-active-2026-10-12\.es\.pdf/);
}));

test('api: the liability gate - release not accepted -> 422 with the error; a forbidden key -> 422', env({}, async () => {
  const i = intake08();
  i.release.accepted = false;
  const r = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: i, format: 'md' } });
  assert.equal(r.status, 422);
  assert.equal(r.json.status, 'invalid');
  assert.ok(r.json.errors.some(e => e.code === 'release_missing'), JSON.stringify(r.json.errors));
  assert.ok(!('plan' in r.json) && !('markdown' in r.json));
  const f = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: { ...intake08(), sex: 'female' } } });
  assert.equal(f.status, 422);
  assert.ok(f.json.errors.some(e => e.code === 'forbidden_key' && e.field === 'sex'));
  const g = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: { ...intake08(), sleep: 'bad' } } });
  assert.ok(g.json.errors.some(e => e.code === 'forbidden_key'));
}));

test('api: answers without the release or the health check -> the problems and the prefilled link of this deployment', env({}, async () => {
  const r = await call(plan, { method: 'POST', url: '/api/plan', body: { answers: { goal: 'strength', days: 4 }, lang: 'es' } });
  assert.equal(r.status, 422);
  assert.equal(r.json.status, 'needs_answers');
  assert.ok(r.json.problems.some(p => /health check/.test(p)) && r.json.problems.some(p => /release is not accepted/.test(p)));
  const u = new URL(r.json.link);
  assert.equal(u.origin, 'https://plan.example.org');
  const d = decodePrefill(u.hash, B.defaultAnswers('2026-10-13'));
  assert.equal(d.answers.goal, 'strength');
  assert.equal(d.lang, 'es');
  // with the health check and the release: a plan
  const ok = await call(plan, { method: 'POST', url: '/api/plan', body: { answers: { goal: 'strength', days: 4, health: 'none', accepted: true }, format: 'md' } });
  assert.equal(ok.status, 200, ok.text.slice(0, 400));
  assert.match(ok.json.link, /^https:\/\/plan\.example\.org\/#a=/);
}));

test('api: Son Hábitos deployment (env BRAND) - its words and its own disclaimer pages on this host', env({ BRAND: 'sonhabitos' }, async () => {
  const r = await call(plan, { method: 'POST', url: '/api/plan', body: { intake: intake08(), format: 'md', lang: 'es' } });
  assert.equal(r.status, 200, r.text.slice(0, 300));
  assert.match(r.json.markdown, /https:\/\/plan\.example\.org\/disclaimer\.es\.html/);
  assert.match(r.json.markdown, /Son Hábitos · Nati Vera/);
  const s = r.json.markdown.split('Lalo Vera y BFit Studios Corp., que opera como Son Hábitos').join('');
  assert.doesNotMatch(s, /blaze|\blalo\b|\bgerardo\b/i);
}));

test('api: bad requests and the OpenAPI description', env({}, async () => {
  assert.equal((await call(plan, { url: '/api/plan' })).status, 405);
  assert.equal((await call(plan, { method: 'POST', url: '/api/plan', body: 'not json' })).status, 400);
  assert.equal((await call(plan, { method: 'POST', url: '/api/plan', body: {} })).status, 400);
  assert.equal((await call(plan, { method: 'POST', url: '/api/plan', body: { intake: intake08(), format: 'docx' } })).status, 400);
  const o = await call(openapi, { url: '/api/openapi' });
  assert.equal(o.json.openapi, '3.1.0');
  assert.equal(o.json.servers[0].url, 'https://plan.example.org');
  assert.ok(o.json.paths['/api/plan'].post.operationId && o.json.paths['/api/questions'].get.operationId);
  assert.match(JSON.stringify(o.json), /I accept/);
}));
