// tools/compile/sources.mjs - B1 (model compiler): the read-only sources the compiler reads, and their fingerprints.
// Paths are relative to the code root (resolved from import.meta.url). Nothing here writes; synthesis/ etc. are read-only.
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { fileURLToPath } from 'node:url';

export const BASE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

/** every file the compile reads, in manifest order (relative to BASE) */
export const SOURCE_FILES = [
  'generator_spec_v1.json',
  'coach_answers_round2.md',
  'synthesis/02_exercise_catalog.json',
  'synthesis/03_volume_rules.json',
  'synthesis/04_profiles.json',
  'synthesis/05_templates.json',
  'synthesis/06_periodization.json',
  'synthesis/10_equipment_model.json',
  'synthesis/11_training_variables.json',
  'synthesis/12_volume_algorithm_v1.json'
];

/** @param {string} rel @returns {any} parsed JSON */
export function readSourceJSON(rel) {
  return JSON.parse(fs.readFileSync(path.join(BASE, rel), 'utf8'));
}

/** @param {string} rel @returns {string} hex sha256 of the file bytes */
export function sha256File(rel) {
  return crypto.createHash('sha256').update(fs.readFileSync(path.join(BASE, rel))).digest('hex');
}

/** @returns {{spec:any, cat:any[], vol03:any, prof:any, tpl:any, per06:any, eqm:any, tv11:any, alg12:any, round2:string, sha:Object<string,string>}} */
export function loadSources() {
  const sha = {};
  for (const f of SOURCE_FILES) sha[f] = sha256File(f);
  return {
    spec: readSourceJSON('generator_spec_v1.json'),
    round2: fs.readFileSync(path.join(BASE, 'coach_answers_round2.md'), 'utf8'),
    cat: readSourceJSON('synthesis/02_exercise_catalog.json'),
    vol03: readSourceJSON('synthesis/03_volume_rules.json'),
    prof: readSourceJSON('synthesis/04_profiles.json'),
    tpl: readSourceJSON('synthesis/05_templates.json'),
    per06: readSourceJSON('synthesis/06_periodization.json'),
    eqm: readSourceJSON('synthesis/10_equipment_model.json'),
    tv11: readSourceJSON('synthesis/11_training_variables.json'),
    alg12: readSourceJSON('synthesis/12_volume_algorithm_v1.json'),
    sha
  };
}

/** stable key sort: _meta first, then plain code-unit order (no localeCompare, CONTRACTS §1.3) */
export function sortKeys(o) {
  return Object.fromEntries(Object.entries(o).sort(([a], [b]) => (a === '_meta' ? -1 : b === '_meta' ? 1 : a < b ? -1 : a > b ? 1 : 0)));
}
