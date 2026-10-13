// The API functions must load on a Node without ES-module syntax detection (Vercel's runtime): app/*.js are ES modules by
// app/package.json, the vendored jsPDF is CommonJS by app/vendor/package.json. Regression for the FUNCTION_INVOCATION_FAILED
// of 2026-10-13 (every /api call answered 500).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { ROOT } from './helpers/models.mjs';

const script = `
import { Readable } from 'node:stream';
const out = [];
const call = async (name, req) => {
  const { default: h } = await import(${JSON.stringify(ROOT)} + '/api/' + name + '.mjs');
  await new Promise((done) => h(req, { statusCode: 0, headers: {}, setHeader(k, v) { this.headers[k] = v; }, end(b) { out.push([name, this.statusCode, this.headers['Content-Type'], b.length]); done(); } }));
};
await call('questions', { method: 'GET', url: '/api/questions?lang=es', headers: { host: 'x.vercel.app' }, query: { lang: 'es' } });
await call('openapi', { method: 'GET', url: '/api/openapi', headers: { host: 'x.vercel.app' } });
const body = JSON.stringify({ answers: { goal: 'general', days: 3, accepted: true, health: 'none' }, lang: 'en', format: 'pdf' });
await call('plan', Object.assign(Readable.from([body]), { method: 'POST', url: '/api/plan', headers: { host: 'x.vercel.app', 'content-type': 'application/json' } }));
console.log(JSON.stringify(out));
`;

test('api: every function loads and answers without ES-module syntax detection (both brands)', () => {
  for (const brand of ['blazecamp', 'sonhabitos']) {
    const r = spawnSync(process.execPath, ['--no-experimental-detect-module', '--input-type=module', '-e', script], { encoding: 'utf8', env: { ...process.env, BRAND: brand }, timeout: 180000 });
    assert.equal(r.status, 0, r.stderr.slice(0, 600));
    const out = JSON.parse(r.stdout.trim().split('\n').pop());
    assert.deepEqual(out.map(o => [o[0], o[1]]), [['questions', 200], ['openapi', 200], ['plan', 200]], brand);
    assert.match(out[2][2], /application\/pdf/);
  }
});
