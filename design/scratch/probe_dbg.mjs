import fs from 'node:fs'; import path from 'node:path'; import { pathToFileURL, fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url)); const SNAP = path.join(HERE, 'snap');
const { loadModel } = await import(pathToFileURL(path.join(SNAP, 'engine', 'model.mjs')).href);
const { generate } = await import(pathToFileURL(path.join(SNAP, 'engine', 'generate.mjs')).href);
const dir = path.join(SNAP, 'model'); const mf = JSON.parse(fs.readFileSync(path.join(dir,'manifest.json'),'utf8')); const f = mf.files; const read=(r)=>JSON.parse(fs.readFileSync(path.join(dir,r),'utf8'));
const model = loadModel({ manifest: mf, catalog: read(f.catalog), rules: read(f.rules), templates: read(f.templates), profiles: read(f.profiles), i18n: { en: read(f.i18n.en), es: read(f.i18n.es), es_review: read(f.i18n.es_review) } });
const [,, name, days, minutes, wds] = process.argv;
const intake = JSON.parse(fs.readFileSync(path.join(SNAP, 'intakes', name + '.json'), 'utf8'));
if (days) { intake.schedule.days_per_week = Number(days); intake.schedule.session_minutes = Number(minutes); if (wds) intake.schedule.weekdays = wds.split(","); }
globalThis.__BC_DBG = true;
let n = 0; const orig = console.error; console.error = (...a) => { n++; orig(...a); };
const p = generate(intake, model);
globalThis.__BC_DBG = false; console.error = orig;
console.log('probe/debug lines', n);
