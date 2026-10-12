// tests/helpers/models.mjs - load the fixture / compiled model and the sample intakes (engine/CONTRACTS.md §8). Owner: B4.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModel } from '../../engine/model.mjs';

export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
export const FIXTURE_PATH = path.join(ROOT, 'engine', 'fixtures', 'mini-model.json');
export const MODEL_DIR = path.join(ROOT, 'model');
export const INTAKE_DIR = path.join(ROOT, 'samples', 'intakes');

let fixtureRaw = null, fixtureModel = null, compiled;

/** raw fixture object (without _fixture), parsed once; callers must not mutate it (loadModel freezes it) @returns {object} */
export function readFixtureRaw() {
  if (!fixtureRaw) {
    fixtureRaw = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
    delete fixtureRaw._fixture;
  }
  return fixtureRaw;
}

/** a fresh, unfrozen copy of the raw fixture (for mutation tests of assertModel) @returns {object} */
export function cloneFixtureRaw() {
  const raw = JSON.parse(fs.readFileSync(FIXTURE_PATH, 'utf8'));
  delete raw._fixture;
  return raw;
}

/** @returns {object} Model built from engine/fixtures/mini-model.json (cached) */
export function loadFixtureModel() {
  if (!fixtureModel) fixtureModel = loadModel(readFixtureRaw());
  return fixtureModel;
}

let noFlagModel = null;
/**
 * engine 0.7 (COACH-R5 R5-GEN-02; DECISIONS G-270): the fixture without rules.legal.health_flag - the model shape of engine 0.6, on
 * which a health-check flag still stops the plan (status refer). Kept to test that retired path. (cached) @returns {object}
 */
export function loadModelWithoutHealthFlag() {
  if (!noFlagModel) {
    const raw = cloneFixtureRaw();
    delete raw.rules.legal.health_flag;
    noFlagModel = loadModel(raw);
  }
  return noFlagModel;
}

/** read a compiled model directory (model/manifest.json + the files it lists) @param {string} [dir] @returns {object|null} raw */
export function readModelDir(dir = MODEL_DIR) {
  const mf = path.join(dir, 'manifest.json');
  if (!fs.existsSync(mf)) return null;
  const manifest = JSON.parse(fs.readFileSync(mf, 'utf8'));
  const f = manifest.files;
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
  return {
    manifest, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles),
    i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: f.i18n.es_review && fs.existsSync(path.join(dir, f.i18n.es_review)) ? read(f.i18n.es_review) : { missing_keys: [], machine_translated: [] } }
  };
}

/** @returns {object|null} Model from model/ (null when B1 has not compiled it yet, so tests can skip) */
export function loadCompiledModel() {
  if (compiled === undefined) {
    const raw = readModelDir();
    compiled = raw ? loadModel(raw) : null;
  }
  return compiled;
}

/** @param {string} name e.g. '01-swimming' or '01' @returns {object} intake/2 (fresh copy) */
export function loadSample(name) {
  const file = fs.readdirSync(INTAKE_DIR).filter(f => f.endsWith('.json')).sort().find(f => f === name + '.json' || f.startsWith(name + '-') || f.startsWith(name));
  if (!file) throw new Error('no sample ' + name);
  return JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, file), 'utf8'));
}

/** @returns {Array<{name:string, intake:object}>} every samples/intakes/*.json, sorted by file name */
export function allSamples() {
  return fs.readdirSync(INTAKE_DIR).filter(f => f.endsWith('.json')).sort()
    .map(f => ({ name: f.replace(/\.json$/, ''), intake: JSON.parse(fs.readFileSync(path.join(INTAKE_DIR, f), 'utf8')) }));
}
