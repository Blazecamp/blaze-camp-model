// Offers, toggles and the monotonicity sweep for the three samples (design/design_template-parametric.md, sections 8 and 14).
// node design/sim_template-parametric/variants.mjs
import { buildProblem, plan, certify, mins } from './tpp.mjs';
import * as SAMPLES from './samples.mjs';

const RANK = { FULL: 3, PATTERN: 1, NONE: 0 };
function solve(cfg) {
  const P = buildProblem(cfg);
  const t0 = process.hrtime.bigint();
  try {
    const R = plan(P);
    const ms = Number(process.hrtime.bigint() - t0) / 1e6;
    const maxDay = Math.max(...R.rows.flatMap((r) => P.dayIds.map((d) => r.ev.min[d])));
    return { ok: true, key: cfg.keep.map((g) => RANK[R.S.state[g]]), states: R.S.state, R, P, ms, maxDay, viol: certify(P, R),
      line: `${cfg.keep.filter((g) => R.S.state[g] === 'FULL').map((g) => `${g} ${R.a[g]}->${R.z[g]}`).join(', ') || '-'}` +
        `${R.S.pattern.length ? '; kept: ' + R.S.pattern.map((p) => p.g).join(', ') : ''}` +
        `${(cfg.room || []).some((r) => R.S.room[r.id]) ? '; room on: ' + cfg.room.filter((r) => R.S.room[r.id]).map((r) => r.id).join(', ') : ''}` +
        `; longest day ${mins(maxDay).toFixed(1)} min` };
  } catch (e) { return { ok: false, line: 'T0 does not fit: ' + e.message, key: cfg.keep.map(() => -1), ms: Number(process.hrtime.bigint() - t0) / 1e6 }; }
}
const lexGE = (a, b) => { for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) return a[i] > b[i]; return true; };
const out = [];
let PLANS = 0, VIOL = 0, STEPS = 0, WORSE = 0;
const MIN = [30, 45, 60, 75, 90, 105, 120];
for (const [name, mk, base] of [['08 pickleball 2 days', SAMPLES.pickleball, 45], ['04 CrossFit-style class 4 days', SAMPLES.crossfit, 60], ['01 swimming 3 days', SAMPLES.swimmer, 60]]) {
  out.push(`\n## ${name}: session-length sweep (the R3-SES-02 step-1 offers are these re-solves)`);
  let prev = null, viol = 0, worse = 0, lower = 0, steps = 0; const notes = [];
  for (const m of MIN) {
    const r = solve(mk(m));
    out.push(`  ${String(m).padStart(3)} min ${m === base ? '(chosen)' : '        '} ${r.line}   [${r.ms.toFixed(0)} ms${r.ok ? ', certify ' + r.viol.length : ''}]`);
    if (r.ok) { viol += r.viol.length; PLANS++; VIOL += r.viol.length; }
    if (prev && prev.ok && r.ok) {
      STEPS++; steps++;
      if (!lexGE(r.key, prev.key)) { worse++; WORSE++; }
      // direct sets of a trained group in the last week (helper credit can move by a quarter set when another group's split changes)
      for (const g of prev.R.full) if (r.R.full.includes(g) && r.R.z[g] < prev.R.z[g]) { lower++; notes.push(`${g} ${prev.R.z[g]} -> ${r.R.z[g]} at ${m} min (added: ${r.R.full.filter((x) => !prev.R.full.includes(x)).join(', ') || 'nothing'})`); }
    }
    prev = r;
  }
  out.push(`  monotonicity over the ${steps} comparable steps: keep vector worse ${worse}; a trained group's peak (direct sets) lower ${lower}${notes.length ? ' (' + notes.join('; ') + ')' : ''}; certify violations in all plans ${viol}`);
}
out.push('\n## Toggles and readings');
const show = (label, cfg) => { const r = solve(cfg); if (r.ok) { PLANS++; VIOL += r.viol.length; } out.push(`  ${label.padEnd(62)} ${r.line}   [${r.ms.toFixed(0)} ms${r.ok ? ', certify ' + r.viol.length : ''}]`); return r; };
show('08 pickleball 2 x 45 (as planned)', SAMPLES.pickleball(45));
show('08 pickleball 2 x 45, fit factor 1.00 (strict minutes)', SAMPLES.pickleball(45, { phi: 1.0 }));
show('08 pickleball 2 x 45, no kept movement stations', SAMPLES.pickleball(45, { pattern: { enabled: false } }));
show('08 pickleball 2 x 45, strict minutes and no kept stations', SAMPLES.pickleball(45, { phi: 1.0, pattern: { enabled: false } }));
{ const c = SAMPLES.pickleball(45); for (const d of Object.keys(c.fixed)) c.fixed[d] = c.fixed[d].filter((x) => !x.label.startsWith('core opener')); show('08 pickleball 2 x 45, core opener switched off (user toggle)', c); }
{ const c = SAMPLES.pickleball(45); for (const d of Object.keys(c.fixed)) c.fixed[d] = c.fixed[d].filter((x) => !['rotational medball throw', 'low-impact landing / jump'].includes(x.label)); show('08 pickleball 2 x 45, athletic block switched off (user toggle)', c); }
show('08 pickleball 3 x 45 (offer: one more day)', SAMPLES.pickleball3(45));
show('08 pickleball 3 x 60', SAMPLES.pickleball3(60));
show('04 CrossFit class 4 x 60 (as planned)', SAMPLES.crossfit(60));
show('04 CrossFit class 4 x 60, fit factor 1.00 (strict minutes)', SAMPLES.crossfit(60, { phi: 1.0 }));
show('04 CrossFit class 4 x 75', SAMPLES.crossfit(75));
show('04 CrossFit class 4 x 75, 14 sets of a group allowed in a session', SAMPLES.crossfit(75, { perSession: 14 }));
show('04 CrossFit class 4 x 90, 14 sets of a group allowed in a session', SAMPLES.crossfit(90, { perSession: 14 }));
show('01 swimming 3 x 60 (as planned)', SAMPLES.swimmer(60));
show('01 swimming 3 x 60, fit factor 1.00 (strict minutes)', SAMPLES.swimmer(60, { phi: 1.0 }));
show('01 swimming 3 x 60, no tests', SAMPLES.swimmer(60, { tests: {} }));
show('01 swimming 3 x 60, no kept movement stations', SAMPLES.swimmer(60, { pattern: { enabled: false } }));
show('01 swimming 3 x 60, work lifts without the late strength rest', SAMPLES.swimmer(60, { heavy: () => false }));
out.push(`\n## Totals: ${PLANS} plans solved and certified in the sweep and the toggles, ${VIOL} violations; ${STEPS} comparable session-length steps, keep vector worse in ${WORSE}`);
console.log(out.join('\n'));

// the two readings of "never flat" vs "the ceiling in the last week" (weekly total of every resistance set)
{
  const lines = ['\n## Stairway tier order: last-week landing first (default) vs never-flat first'];
  for (const [name, mk] of [['08 pickleball 2 x 45', SAMPLES.pickleball], ['04 CrossFit class 4 x 60', SAMPLES.crossfit], ['01 swimming 3 x 60', SAMPLES.swimmer]]) {
    for (const landing of ['first', 'after_never_flat']) {
      const cfg = mk(); cfg.landing = landing; const P = buildProblem(cfg); const R = plan(P); const cv = certify(P, R).length;
      const tot = R.rows.map((r) => Object.values(r.ev.slots).flat().reduce((a, x) => a + x.n, 0));
      lines.push(`  ${name.padEnd(26)} ${landing.padEnd(17)} total ${tot.join(' ')} | flat weeks ${tot.slice(1).filter((x, i) => x === tot[i]).length} | certify ${cv} | ${R.full.map((g) => g + ' ' + R.v[g].join(' ')).join(' | ')}`);
    }
  }
  console.log(lines.join('\n'));
}
// repeatability and timing: 20 fresh solves of each sample
{
  const lines = ['\n## Timing (20 fresh solves each, this machine, Node ' + process.version + ') and repeatability'];
  for (const [name, mk] of [['08 pickleball 2 x 45', SAMPLES.pickleball], ['04 CrossFit class 4 x 60', SAMPLES.crossfit], ['01 swimming 3 x 60', SAMPLES.swimmer]]) {
    const ts = []; let sig = null, same = true;
    for (let i = 0; i < 20; i++) { const P = buildProblem(mk()); const t0 = process.hrtime.bigint(); const R = plan(P); ts.push(Number(process.hrtime.bigint() - t0) / 1e6);
      const x = JSON.stringify([R.S.state, R.z, R.a, R.v, R.rows.map((r) => r.ev.min)]); if (sig === null) sig = x; else if (sig !== x) same = false; }
    ts.sort((a, b) => a - b);
    lines.push(`  ${name.padEnd(26)} median ${ts[10].toFixed(1)} ms, min ${ts[0].toFixed(1)}, max ${ts[19].toFixed(1)}; identical plans in all runs: ${same}`);
  }
  console.log(lines.join('\n'));
}
