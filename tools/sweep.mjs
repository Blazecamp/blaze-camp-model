#!/usr/bin/env node
// tools/sweep.mjs - B4 (integration). The random-intake sweep: N seeded random valid intakes (tests/helpers/random-intake.mjs) +
// one competitive athlete per picker sport + one "stay athletic and active" client per activity, generated on the reference
// fixture and on the compiled model; every plan is validated and (with --render) rendered in EN and ES. Prints per model: plans
// ok, throws, failing error checks (count of plans per check id + the first examples), failing warn checks, main days above the
// session size range (v0.5: no minutes are compared, CT-01), plans that train no group directly, render problems. Exits 1 when a
// plan is not ok, throws or fails an error check. Deterministic (same N -> same intakes).
//
//   node tools/sweep.mjs                    # 1500 random + 52 sports + 26 activities, fixture and model/
//   node tools/sweep.mjs 300 --model-only   # a quicker pass on model/ only
//   node tools/sweep.mjs 1500 --render      # also render every plan in EN and ES and scan the text
import { generate } from '../engine/generate.mjs';
import { renderPlan } from '../engine/render.mjs';
import { loadFixtureModel, loadCompiledModel } from '../tests/helpers/models.mjs';
import { randomIntake, sportIntake, activityIntake } from '../tests/helpers/random-intake.mjs';

const args = process.argv.slice(2);
const N = Number(args.find(a => /^\d+$/.test(a)) || 1500);
const render = args.includes('--render');
const models = [];
if (!args.includes('--model-only')) models.push(['fixture', loadFixtureModel()]);
if (!args.includes('--fixture-only')) { const m = loadCompiledModel(); if (m) models.push(['model/', m]); else console.log('model/ is not compiled - fixture only'); }

const BAD_TEXT = /undefined|\[object|NaN|\{[a-z_]+\}|\b(warning|note|why|offer|exercise|detail|check)\.[a-z_]+\.[a-z_.]+/;
let bad = 0;
for (const [label, model] of models) {
  const intakes = [
    ...Array.from({ length: N }, (_, i) => ['random-' + i, randomIntake(i, model)]),
    ...model.profiles.picker.sports.map((s, k) => ['sport-' + s.id, sportIntake(k, model)]),
    ...model.profiles.picker.activities.map((a, k) => ['activity-' + a.id, activityIntake(k, model)])
  ];
  const st = { ok: 0, notOk: [], throws: [], err: {}, warn: {}, over: 0, overPlans: new Set(), noGroup: [], renderBad: [] };
  for (const [name, intake] of intakes) {
    let plan;
    try { plan = generate(intake, model); } catch (e) { st.throws.push(name + ': ' + e.message); continue; }
    if (plan.status !== 'ok') { st.notOk.push(name + ': ' + plan.status); continue; }
    st.ok++;
    for (const c of plan.validation.checks) if (!c.pass) (c.severity === 'error' ? (st.err[c.id] ||= []) : (st.warn[c.id] ||= [])).push(name + ' ' + JSON.stringify(c.violations[0]).slice(0, 200));
    // v0.5 (CT-01): no minute limit to compare against - the sweep counts the sessions above their size range instead (R4-SES-02)
    const sizeMax = plan.meta.session_size ? plan.meta.session_size.range[1] : Infinity;
    for (const w of plan.weeks) for (const d of w.days) if (d.kind === 'main' && d.exercise_count > sizeMax) { st.over++; st.overPlans.add(name); }
    if ((plan.meta.stairway || []).some(b => !b.circuit && (b.groups || []).length === 0)) st.noGroup.push(name);
    if (render) for (const lang of ['en', 'es']) {
      let txt;
      try { txt = renderPlan(plan, model, { lang }); } catch (e) { st.renderBad.push(`${name} ${lang}: ${e.message}`); continue; }
      const m = txt.match(BAD_TEXT);
      if (m) st.renderBad.push(`${name} ${lang}: ...${txt.slice(Math.max(0, m.index - 50), m.index + 50).replace(/\n/g, ' ')}...`);
    }
  }
  const counts = (o) => JSON.stringify(Object.fromEntries(Object.entries(o).map(([k, v]) => [k, v.length])));
  console.log(`${label}: ${intakes.length} intakes (${N} random + ${model.profiles.picker.sports.length} sports + ${model.profiles.picker.activities.length} activities) · ok ${st.ok} · not ok ${st.notOk.length} · throws ${st.throws.length}`);
  console.log(`  error checks failing (plans): ${counts(st.err)}`);
  console.log(`  warn checks failing (plans):  ${counts(st.warn)}`);
  console.log(`  main days above the session size range: ${st.over} in ${st.overPlans.size} plans · plans training no group directly: ${st.noGroup.length}${render ? ` · render problems: ${st.renderBad.length}` : ''}`);
  for (const x of [...st.notOk, ...st.throws].slice(0, 5)) console.log('  ! ' + x);
  for (const [id, list] of Object.entries(st.err)) for (const x of list.slice(0, 3)) console.log(`  ${id} ${x}`);
  for (const x of st.renderBad.slice(0, 5)) console.log('  render ' + x);
  if (st.notOk.length || st.throws.length || Object.keys(st.err).length || st.renderBad.length) bad++;
}
process.exit(bad ? 1 : 0);
