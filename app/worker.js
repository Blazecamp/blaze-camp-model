// app/worker.js - builds the plan off the main thread so the page never freezes (a physique plan can take 10-20 s).
// Messages in: {type:'generate', id, intake} and {type:'edit', id, plan, edits, base} (the person's edits, engine/edit.mjs; with
// base: true the plan's own conflicts are returned too, so the page names only what an edit changed). Messages out: {type:'ready'}
// once the model is loaded, {type:'plan', id, plan, ms}, {type:'edited', id, plan, conflicts, base_conflicts} or
// {type:'error', id, message}. Nothing is stored; the worker ends with the page.
import { fetchModel } from './model-loader.js';
import { generate } from '../engine/generate.mjs';
import { applyPlanEdits } from '../engine/edit.mjs';

let modelPromise = null;
const model = () => { if (!modelPromise) modelPromise = fetchModel(); return modelPromise; };

// a model that cannot load here is reported with id null: the page then builds on its own thread instead
model().then(() => self.postMessage({ type: 'ready' }), (e) => self.postMessage({ type: 'error', id: null, message: String(e && e.message || e) }));

self.onmessage = async (ev) => {
  const msg = ev.data || {};
  if (msg.type === 'edit') {
    try {
      const m = await model();
      const res = applyPlanEdits(msg.plan, msg.edits, m);
      const base = msg.base ? applyPlanEdits(msg.plan, [], m).conflicts : null;
      self.postMessage({ type: 'edited', id: msg.id, plan: res.plan, conflicts: res.conflicts, base_conflicts: base });
    } catch (e) {
      self.postMessage({ type: 'error', id: msg.id, message: String(e && e.message || e) });
    }
    return;
  }
  if (msg.type !== 'generate') return;
  try {
    const m = await model();
    const t0 = performance.now();
    const plan = generate(msg.intake, m);
    self.postMessage({ type: 'plan', id: msg.id, plan, ms: Math.round(performance.now() - t0) });
  } catch (e) {
    self.postMessage({ type: 'error', id: msg.id, message: String(e && e.message || e) });
  }
};
