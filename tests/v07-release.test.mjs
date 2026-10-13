// Blaze Camp release "model v1.4 + engine 0.7.0" (2026-10-13). The model label moves to 1.4.0 (round 5, CH5, CH6); the plans do
// not move. The engine seeds its tie-breaks from the model version (CONTRACTS §1.3), so rules.determinism.seed_version_map keeps
// the 1.3.0 seed for the 1.4.0 label (engine/DECISIONS.md G-305). Without it every pick that ties would reshuffle, the 8 sample
// plans the coach graded (COACH-R5 R5-GRD-01 ... 08) included.
import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadFixtureModel, loadCompiledModel } from './helpers/models.mjs';
import { generate } from '../engine/generate.mjs';
import { ENGINE_VERSION } from '../engine/version.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const models = [['fixture', loadFixtureModel(), '1.4.0-fixture', '1.3.0-fixture'], ...(loadCompiledModel() ? [['model/', loadCompiledModel(), '1.4.0', '1.3.0']] : [])];
const intake08 = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/intakes/08-pickleball-genpop.json'), 'utf8'));

describe('G-305: model 1.4.0 keeps the 1.3.0 seeds', () => {
  it('engine 0.7.0', () => assert.equal(ENGINE_VERSION, '0.7.0'));
  for (const [label, m, version, seedVersion] of models) {
    it(`${label}: the model is ${version} and maps its seed to ${seedVersion}`, () => {
      assert.equal(m.version, version);
      assert.equal(m.rules.rules_version, '1.4.0');
      assert.equal(m.rules.determinism.seed_version_map[version], seedVersion);
    });
    it(`${label}: a plan prints model ${version} and carries the seed a ${seedVersion} model gives`, () => {
      const p = generate(structuredClone(intake08), m);
      assert.equal(p.status, 'ok');
      assert.equal(p.model_version, version);
      const asOld = generate(structuredClone(intake08), { ...m, version: seedVersion, rules: { ...m.rules, determinism: { seed_version_map: {} } } });
      assert.equal(p.seed, asOld.seed);
      const noMap = generate(structuredClone(intake08), { ...m, rules: { ...m.rules, determinism: { seed_version_map: {} } } });
      assert.notEqual(noMap.seed, p.seed, 'without the map the seed follows the label');
      if (label === 'model/') {
        const committed = JSON.parse(fs.readFileSync(path.join(ROOT, 'samples/plans/08-pickleball-genpop.json'), 'utf8'));
        assert.equal(committed.seed, p.seed, 'the committed sample 08 carries the same seed');
      }
    });
  }
  it('model/: every committed sample plan prints model 1.4.0', () => {
    const dir = path.join(ROOT, 'samples/plans');
    for (const f of fs.readdirSync(dir).filter(x => x.endsWith('.json'))) assert.equal(JSON.parse(fs.readFileSync(path.join(dir, f), 'utf8')).model_version, '1.4.0', f);
  });
});

describe('Release 1.4.0: round-5 confirmations recorded in rules.release (coverage_matrix_round5.md)', () => {
  for (const [label, m] of models) {
    it(`${label}: R5-VOL-08, R5-ATH-03, R5-ATH-07, R5-GEN-03 are recorded as approved; the values are unchanged`, () => {
      const R = m.rules;
      const c = R.release.confirmations;
      assert.equal(R.release.model_version, '1.4.0');
      assert.match(c['volume.x3.nonfocus_start'], /R5-VOL-08/);
      assert.equal(R.volume.x3.nonfocus_start.start, 16);
      assert.match(c['athletic.x1.scale_by_days'], /R5-ATH-03/);
      assert.equal(R.athletic.x1.scale_by_days.floor, 0.75);
      assert.match(c['session.size.by_type.stay_active'], /R5-ATH-07/);
      assert.deepEqual(R.session.size.by_type.stay_active.range, [5, 10]);
      assert.match(c['session.size.by_type.*.default'], /R5-GEN-03/);
      const d = Object.fromEntries(Object.entries(R.session.size.by_type).map(([k, v]) => [k, v.default]));
      for (const [k, v] of [['general', 7], ['aesthetics', 7], ['strength', 6], ['bootcamp', 7], ['athletic', 12], ['older', 6]]) assert.equal(d[k], v, k);
    });
  }
});
