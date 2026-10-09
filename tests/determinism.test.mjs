// tests/determinism.test.mjs - CONTRACTS §1.3 / §8: same intake + model -> byte-identical plan; key order and identity
// fields never change the plan; engine sources hold no clock, randomness or locale API. Owner: B4.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { generate, generateWith, realModulesStatus } from '../engine/generate.mjs';
import { STUB_DEPS } from './helpers/stub-modules.mjs';
import { loadFixtureModel, allSamples, ROOT } from './helpers/models.mjs';

const model = loadFixtureModel();
const REAL = realModulesStatus().ready;
const gen = (intake) => (REAL ? generate(intake, model) : generateWith(STUB_DEPS, intake, model));
const LABEL = REAL ? 'real modules' : 'stub modules';

function shuffleKeys(o, salt = 0) {
  if (Array.isArray(o)) return o.map((x, i) => shuffleKeys(x, salt + i));
  if (!o || typeof o !== 'object') return o;
  const keys = Object.keys(o);
  const order = keys.map((k, i) => [k, (i * 7 + salt * 13 + k.length) % keys.length]).sort((a, b) => b[1] - a[1] || (a[0] < b[0] ? 1 : -1)).map(x => x[0]);
  const out = {};
  for (const k of order) out[k] = shuffleKeys(o[k], salt + 1);
  return out;
}

for (const { name, intake } of allSamples()) {
  test(`${name}: twice -> identical, shuffled key order -> identical, id / email / comments ignored (${LABEL})`, () => {
    const a = JSON.stringify(gen(intake), null, 2);
    assert.equal(JSON.stringify(gen(structuredClone(intake)), null, 2), a);
    const shuffled = shuffleKeys(structuredClone(intake));
    assert.notDeepEqual(Object.keys(shuffled), Object.keys(intake));
    assert.equal(JSON.stringify(gen(shuffled), null, 2), a);
    const renamed = { ...structuredClone(intake), id: 'someone-else', email: 'x@example.com', _comment: 'different comment' };
    renamed.release = { ...renamed.release, accepted_at: '2026-10-01T10:00:00Z', signer_name: 'Guardian Name' };
    const b = gen(renamed);
    assert.equal(b.seed, JSON.parse(a).seed);
    assert.equal(b.intake_hash, JSON.parse(a).intake_hash);
    assert.deepEqual(b.weeks, JSON.parse(a).weeks);
  });
}

test('a different intake gives a different seed', () => {
  const [s1, s2] = allSamples();
  assert.notEqual(gen(s1.intake).seed, gen(s2.intake).seed);
});

test('engine sources: no Date.now / argument-less Date / Math.random / Intl / localeCompare / toLocale* / performance.now / node: imports', () => {
  const dir = path.join(ROOT, 'engine');
  const bad = [
    [/Date\.now\s*\(/, 'Date.now'], [/new Date\(\s*\)/, 'new Date()'], [/Math\.random\s*\(/, 'Math.random'], [/\bIntl\./, 'Intl'],
    [/\.localeCompare\s*\(/, 'localeCompare'], [/\.toLocale[A-Za-z]*\s*\(/, 'toLocale*'], [/performance\.now/, 'performance.now'],
    [/from\s+['"]node:/, 'node: import'], [/\bprocess\./, 'process'], [/\bconsole\./, 'console'], [/\bfetch\s*\(/, 'fetch']
  ];
  const hits = [];
  for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.mjs')).sort()) {
    const src = fs.readFileSync(path.join(dir, f), 'utf8').split('\n').filter(l => !/^\s*(\/\/|\*)/.test(l)).join('\n');
    for (const [re, what] of bad) if (re.test(src)) hits.push(f + ': ' + what);
  }
  assert.deepEqual(hits, []);
});
