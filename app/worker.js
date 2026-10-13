// app/worker.js - builds the plan off the main thread so the page never freezes (a physique plan can take 10-20 s).
// Message in: {type:'generate', id, intake}. Messages out: {type:'ready'} once the model is loaded,
// {type:'plan', id, plan, ms} or {type:'error', id, message}. Nothing is stored; the worker ends with the page.
import { fetchModel } from './model-loader.js';
import { generate } from '../engine/generate.mjs';

let modelPromise = null;
const model = () => { if (!modelPromise) modelPromise = fetchModel(); return modelPromise; };

// a model that cannot load here is reported with id null: the page then builds on its own thread instead
model().then(() => self.postMessage({ type: 'ready' }), (e) => self.postMessage({ type: 'error', id: null, message: String(e && e.message || e) }));

self.onmessage = async (ev) => {
  const msg = ev.data || {};
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
