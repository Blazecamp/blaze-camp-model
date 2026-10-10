import fs from 'node:fs';
import { buildInstance } from './canon_endpoint.mjs';
import { extend } from './examples.mjs';
import { plan } from './pipeline.mjs';
const R = JSON.parse(fs.readFileSync(new URL('../../model/rules.json', import.meta.url), 'utf8'));
const TPL = JSON.parse(fs.readFileSync(new URL('../../model/templates.json', import.meta.url), 'utf8'));
const c = { plans: 0, sessionRelax: 0, witnessWeek1: 0, structureFallback: 0, peakCut: 0, opened: 0, helperLifts: 0, evening: 0 };
for (const family of Object.keys(TPL.families)) for (const days of [2, 3, 4, 5, 6]) for (const minutes of [30, 45, 60, 75, 90, 105, 120]) for (const level of ['L1', 'L2', 'L3']) {
  const keepOrder = family === 'athletic' ? R.session.time_fit.keep_order_r2.athletic : R.session.time_fit.keep_order;
  let I; try { I = extend(buildInstance({ family, days, minutes, level, keepOrder, athleticPeak: family === 'athletic' ? 1.3 : 1 })); } catch (e) { continue; }
  if (!I.present.length) continue;
  const r = plan(I, { fit: 1 }); if (!r.weeks) continue; c.plans++;
  if (r.notes.some((n) => /per-session/.test(n))) c.sessionRelax++;
  if (r.notes.some((n) => /week 1 from the witness/.test(n))) c.witnessWeek1++;
  if (r.notes.some((n) => /no preferred structure/.test(n))) c.structureFallback++;
  if (r.notes.some((n) => /lowered by one set/.test(n))) c.peakCut++;
  if (r.opened) c.opened++; if (r.helperLifts) c.helperLifts++; if (r.evenPeak + r.evenWeek1) c.evening++;
}
console.log(JSON.stringify(c));
