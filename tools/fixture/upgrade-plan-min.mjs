#!/usr/bin/env node
// tools/fixture/upgrade-plan-min.mjs - engine 0.5.0 / V2: brings the hand-specified plan fixture tests/fixtures/plan-min.json to the
// V2 plan/2 shape. Idempotent and deterministic (no clock). Usage: node tools/fixture/upgrade-plan-min.mjs
//   * item.video   -> the YouTube search link built from the exercise's English name + the name to copy (COACH-R4 R4-LIB-05: no
//                     third-party video link)
//   * item.swap_notes, item.instead_of (R4-LIB-04), meta.addons (R4-LIB-01)
//   * V3: release_stamp.accepted (R4-SCP-02), day.skeleton (R4-SES-05; null on the fixture's hand-made days)
// The fixture's exercises, sets and words are not touched (the plan stays the hand-specified one, DECISIONS G-22).
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadModel } from '../../engine/model.mjs';
import { videoOf, swapNotes } from '../../engine/library.mjs';

const BASE = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');
const file = path.join(BASE, 'tests', 'fixtures', 'plan-min.json');
const raw = JSON.parse(fs.readFileSync(path.join(BASE, 'engine', 'fixtures', 'mini-model.json'), 'utf8'));
delete raw._fixture;
const model = loadModel(raw);
const plan = JSON.parse(fs.readFileSync(file, 'utf8'));

const order = (it, keys) => { const out = {}; for (const k of keys) if (k in it) out[k] = it[k]; for (const k of Object.keys(it)) if (!(k in out)) out[k] = it[k]; return out; };
const ITEM_KEYS = ['slot_id', 'station_id', 'bucket', 'role', 'origin', 'group', 'exercise_id', 'name_key', 'detail', 'text_key', 'cue_key', 'video', 'sets', 'reps', 'set_reps', 'effort', 'rest', 'load', 'tempo_key', 'superset', 'laterality', 'loading', 'credits', 'athletic', 'aerobic', 'circuit', 'wod', 'test', 'progression', 'notes', 'swaps', 'swap_notes', 'instead_of', 'flags', 'why', 'superset_suggested'];
let n = 0;
for (const w of plan.weeks) for (const d of w.days) for (const b of d.blocks) {
  b.items = b.items.map((it) => {
    const ex = it.exercise_id && model.hasEx(it.exercise_id) ? model.ex(it.exercise_id) : null;
    const next = { ...it, video: ex ? videoOf(model, ex) : null, swap_notes: ex ? swapNotes(model, ex.id, it.swaps || []) : [], instead_of: it.instead_of ?? null };
    n++;
    return order(next, ITEM_KEYS);
  });
}
// engine 0.5.0 / V3 (COACH-R4 R4-SCP-02): the release stamp says the terms and the release were accepted before the plan was built;
// a day carries the coach's skeleton it follows - the hand-specified fixture days follow none (null: its two mixed days predate
// R4-SES-05; DECISIONS G-41)
if (plan.release_stamp && plan.release_stamp.accepted !== true) plan.release_stamp = { ...plan.release_stamp, accepted: true };
const DAY_KEYS = ['weekday', 'day_type', 'kind', 'optional', 'label_key', 'full_body', 'format', 'est_minutes', 'aerobic_minutes', 'exercise_count', 'skeleton', 'easy_to_remove'];
for (const w of plan.weeks) w.days = w.days.map((d) => order({ ...d, skeleton: d.skeleton ?? null }, DAY_KEYS));
if (!('addons' in plan.meta)) {
  const meta = {};
  for (const [k, v] of Object.entries(plan.meta)) { meta[k] = v; if (k === 'tests') meta.addons = []; }
  plan.meta = meta;
}
fs.writeFileSync(file, JSON.stringify(plan, null, 2) + "\n");
console.log(JSON.stringify({ file: path.relative(BASE, file), items: n }));
