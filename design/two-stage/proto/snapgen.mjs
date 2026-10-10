// design/two-stage/proto/snapgen.mjs - generate a sample plan IN MEMORY from the frozen engine snapshot (design/scratch/snap).
// Read-only on engine/, model/, samples/. Used only to read the current engine's day layouts (fixed blocks, stations, time classes).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..', '..');
export const SNAP = path.join(ROOT, 'design', 'scratch', 'snap');
const ENG = path.join(SNAP, 'engine');
const MOD = path.join(SNAP, 'model');
export function readModelDir(dir) {
  const manifest = JSON.parse(fs.readFileSync(path.join(dir, 'manifest.json'), 'utf8'));
  const f = manifest.files;
  const read = (rel) => JSON.parse(fs.readFileSync(path.join(dir, rel), 'utf8'));
  const review = f.i18n.es_review && fs.existsSync(path.join(dir, f.i18n.es_review)) ? read(f.i18n.es_review) : { missing_keys: [], machine_translated: [] };
  return { manifest, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: review } };
}
export async function load() {
  const { loadModel } = await import(pathToFileURL(path.join(ENG, 'model.mjs')).href);
  const gen = await import(pathToFileURL(path.join(ENG, 'generate.mjs')).href);
  const model = loadModel(readModelDir(MOD));
  return { model, gen, ENG, MOD };
}
export function intake(name) { return JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', name + '.json'), 'utf8')); }
