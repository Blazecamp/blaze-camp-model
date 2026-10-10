// Judge 2: a constructed case for lemma L3 of design_template-parametric.md (the keep search tests the "minimum point" only).
// Real template athletic.3, real time model. An L1 athlete at 45 min (work lift minimum 2 sets below 60 min), last exercise block
// with strength rest on the bilateral hip work lift. Only hips is in the keep list; the fixed minutes are chosen so Wednesday has
// about 34 free minutes and Friday about 19.
import { buildProblem, plan, exists, evaluate, mins, realizeCell, depthFor } from '../sim_template-parametric/tpp.mjs';
import * as SAMPLES from '../sim_template-parametric/samples.mjs';
const base = SAMPLES.swimmer(45);
const cfg = { ...base, name: 'L3 probe', level: 'L1', tests: {}, room: [], pattern: { enabled: false }, athleteCap: undefined, athleticCountedBase: {},
  groups: { hips: { F: 10, S: 10, C: 13, mc: 2 } }, keep: ['hips'],
  fixed: { Mon: [{ label: 'fixed', minutes: 48 }], Wed: [{ label: 'fixed', minutes: 15.45 }], Fri: [{ label: 'fixed', minutes: 30.45 }] } };
const P = buildProblem(cfg);
for (const c of P.cellsOf('hips')) console.log('cell', c.key, 'lead', c.lead, 'slots', c.slots.map((s) => s.bucket + (s.role === 'work' ? '(work)' : '') + ' ' + s.min + '-' + s.max).join(', '), 'values', c.values.join(','));
const S = { state: { hips: 'FULL' }, room: {}, pattern: [] }, full = ['hips'];
const allow = new Map(); for (const c of P.cellsOf('hips')) allow.set(c.key, c.lead ? c.values : [0].concat(c.values));
const caps = {}; for (const d of P.dayIds) caps[d] = P.band;
const show = (r) => (r ? JSON.stringify([...r].map(([k, v]) => k + '=' + v.n + ' sets/' + v.k + ' exercises')) : 'null ("does not fit")');
console.log('band', mins(P.band), 'min a day');
console.log('keep-search question (minimum point):', show(exists(P, S, full, { allow, target: null, caps })));
for (const T of [12, 13]) { const r = exists(P, S, full, { allow, target: { hips: T }, caps }); console.log('exact total hips =', T, ':', show(r)); if (r) { const ev = evaluate(P, S, r, cfg.N, { regular: true }); console.log('   minutes in week 12:', P.dayIds.map((d) => d + ' ' + mins(ev.min[d])).join(', '), '| credited hips', ev.Q.hips / 4); } }
try { const R = plan(P); console.log('plan(): hips state =', R.S.state.hips); } catch (e) { console.log('plan():', e.message); }
