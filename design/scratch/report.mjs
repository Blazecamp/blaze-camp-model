// design/scratch/report.mjs - prints the diagnosis tables from design/scratch/out/measure.json (markdown fragments)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
const HERE = path.dirname(fileURLToPath(import.meta.url));
const file = process.argv[2] || path.join(HERE, 'out', 'measure.json');
const all = JSON.parse(fs.readFileSync(file, 'utf8'));
const GROUPS = ['quads', 'hips', 'back', 'chest', 'shoulders', 'biceps', 'triceps', 'calves'];
const short = (n) => n.replace(/^0(\d)-/, '$1 ').replace(/-/g, ' ');
const pct = (x) => (x === null || x === undefined || !isFinite(x) ? '-' : Math.round(x) + '%');
const sec = process.argv[3] || 'all';

if (sec === 'all' || sec === 'overview') {
  console.log('\n### Overview\n');
  console.log('| Sample | Days x min | Level | Time check fits | Trained directly | Not trained directly (reason) | Below floor declared | Lowered peak | Failed checks | ms |');
  console.log('|---|---|---|---|---|---|---|---|---|---|');
  for (const o of all) {
    const nt = (o.time_check.not_trained || []).map(x => x.group + ' (' + x.reason + ')').join(', ') || '-';
    const bf = (o.time_check.below_floor || []).map(x => x.group).join(', ') || '-';
    console.log(`| ${short(o.name)} | ${o.days} x ${o.minutes} | ${o.level} | ${o.time_check.fits ? 'yes' : 'no'} | ${(o.time_check.trained || []).join(', ')} | ${nt} | ${bf} | ${(o.time_check.lowered_peak || []).join(', ') || '-'} | ${o.validation_failed.map(v => v.id + ' (' + v.severity + ')').join(', ') || '-'} | ${o.ms} |`);
  }
}

if (sec === 'all' || sec === 'groups') {
  console.log('\n### Weekly sets per trained group (main days, group credit), stairway block 1, week 1 -> last\n');
  for (const o of all) {
    for (const s of o.stair) {
      console.log(`\n**${short(o.name)}** - block ${s.training_block}, weeks ${s.weeks[0]}-${s.weeks[s.weeks.length - 1]}${s.test_weeks.length ? ' (test weeks ' + s.test_weeks.join(', ') + ')' : ''}; total main sets ${s.total_main.join(' · ')}; weekly rise % ${s.rise_pct.join(' · ')}\n`);
      console.log('| Group | Sets by week | Floor | Weeks under floor | Flat transitions | Longest flat run | Drops | Growth (last / first) | Reaches final value in week |');
      console.log('|---|---|---|---|---|---|---|---|---|');
      for (const g of GROUPS) {
        const x = s.groups[g];
        if (!x) continue;
        console.log(`| ${g}${x.below_floor_declared ? ' (below floor, declared)' : ''} | ${x.sets.join(' · ')} | ${x.floor} | ${x.floor_miss_weeks} / ${x.sets.length} | ${x.flat_transitions} / ${x.transitions} | ${x.longest_flat_run} | ${x.drops} | ${x.growth} | ${x.reaches_last_value_in_week} of ${x.sets.length} |`);
      }
      const un = Object.entries(s.untrained_sets_main).filter(([, v]) => v.some(x => x > 0));
      if (un.length) console.log(`\nNot trained directly but still credited (main days): ${un.map(([g, v]) => g + ' ' + v[0] + ' -> ' + v[v.length - 1]).join('; ')}`);
    }
  }
}

if (sec === 'all' || sec === 'summary') {
  console.log('\n### Stairway summary (all trained groups, first stairway block)\n');
  console.log('| Sample | Weeks | Trained groups | Group-weeks under floor (undeclared) | Flat transitions / all | Groups with a flat run >= 3 | Groups at their final value before the last week | Mean growth | Planned growth G(N) | Max weekly total rise | Weeks with total flat or down |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|');
  const G = { 4: 1.1356, 5: 1.1696, 6: 1.2281, 7: 1.265, 8: 1.3282, 10: 1.4365, 12: 1.554 };
  for (const o of all) {
    const s = o.stair[0];
    if (!s) { console.log(`| ${short(o.name)} | - | - | - | - | - | - | - | - | - | - |`); continue; }
    const gs = Object.entries(s.groups);
    const under = gs.reduce((a, [, x]) => a + (x.below_floor_declared ? 0 : x.floor_miss_weeks), 0);
    const flat = gs.reduce((a, [, x]) => a + x.flat_transitions, 0), tr = gs.reduce((a, [, x]) => a + x.transitions, 0);
    const runs = gs.filter(([, x]) => x.longest_flat_run >= 3).map(([g]) => g);
    const early = gs.filter(([, x]) => x.reaches_last_value_in_week < x.sets.length).map(([g, x]) => g + ' (wk ' + x.reaches_last_value_in_week + ')');
    const mg = gs.length ? gs.reduce((a, [, x]) => a + x.growth, 0) / gs.length : 0;
    const maxRise = s.rise_pct.length ? Math.max(...s.rise_pct) : null;
    const flatTot = s.rise_pct.filter(x => x <= 0).length;
    console.log(`| ${short(o.name)} | ${s.weeks.length} | ${gs.length} | ${under} | ${flat} / ${tr} | ${runs.join(', ') || '-'} | ${early.join(', ') || '-'} | ${mg.toFixed(2)} | ${G[s.weeks.length] || '-'} | ${maxRise === null ? '-' : maxRise + '%'} | ${flatTot} of ${s.rise_pct.length} |`);
  }
}

if (sec === 'all' || sec === 'minutes') {
  console.log('\n### Minutes per day vs the chosen minutes (main days)\n');
  console.log('| Sample | Limit | Non-test main days | Over limit (engine est.) | Over limit +10 % (engine) | Max engine est. | Over limit (independent) | Over +10 % (independent) | Max independent | Mean indep. - est. | Optional days max |');
  console.log('|---|---|---|---|---|---|---|---|---|---|---|');
  for (const o of all) {
    const md = o.days_report.filter(d => d.kind === 'main' && !d.optional && !d.test);
    const lim = o.minutes;
    const over = md.filter(d => d.est > d.limit).length, over10 = md.filter(d => d.est > d.limit * 1.1).length;
    const io = md.filter(d => d.indep > d.limit).length, io10 = md.filter(d => d.indep > d.limit * 1.1).length;
    const maxE = Math.max(...md.map(d => d.est)), maxI = Math.max(...md.map(d => d.indep));
    const diff = md.reduce((a, d) => a + (d.indep - d.est), 0) / md.length;
    const opt = o.days_report.filter(d => d.optional || d.kind === 'optional');
    console.log(`| ${short(o.name)} | ${lim} | ${md.length} | ${over} | ${over10} | ${maxE} | ${io} | ${io10} | ${Math.round(maxI)} | ${diff.toFixed(1)} | ${opt.length ? Math.max(...opt.map(d => d.est)) : '-'} |`);
  }
  console.log('\n#### Test-week main days\n');
  console.log('| Sample | Test-week main days | Max engine est. | Max independent |');
  console.log('|---|---|---|---|');
  for (const o of all) {
    const td = o.days_report.filter(d => d.kind === 'main' && !d.optional && d.test);
    if (!td.length) { console.log(`| ${short(o.name)} | 0 | - | - |`); continue; }
    console.log(`| ${short(o.name)} | ${td.length} | ${Math.max(...td.map(d => d.est))} | ${Math.round(Math.max(...td.map(d => d.indep)))} |`);
  }
}

if (sec === 'all' || sec === 'exercises') {
  console.log('\n### Exercises per day (main days, all weeks)\n');
  console.log('| Sample | Minutes | Exercises / day (excl. core) min-max | Resistance / day min-max | Athletic+power / day | Prehab / day | Days with a 1-exercise group (not calves) | Days with a 5+-exercise group | Field-athlete cap 12 breaches |');
  console.log('|---|---|---|---|---|---|---|---|---|');
  for (const o of all) {
    const md = o.days_report.filter(d => d.kind === 'main' && !d.optional);
    const mm = (k) => `${Math.min(...md.map(d => d[k]))}-${Math.max(...md.map(d => d[k]))}`;
    const ones = md.filter(d => d.one_exercise_groups.length);
    const fives = md.filter(d => d.over_four_groups.length);
    const cap = o.family === 'athletic' ? md.filter(d => d.exercises_total - d.prehab > 12).length : '-';
    const onesEx = [...new Set(ones.map(d => d.weekday + ':' + d.one_exercise_groups.join('+')))].slice(0, 4).join(', ');
    console.log(`| ${short(o.name)} | ${o.minutes} | ${mm('exercises_total')} | ${mm('resistance')} | ${mm('athletic')} | ${mm('prehab')} | ${ones.length} / ${md.length}${onesEx ? ' (' + onesEx + ')' : ''} | ${fives.length} | ${cap} |`);
  }
}

if (sec === 'all' || sec === 'athletic') {
  console.log('\n### Athletic budget vs delivered (stairway weeks; week 1 -> last; planned (target))\n');
  for (const o of all) {
    const rows = o.athletic.filter(r => r.block_type === 'stairway').map(r => {
      // the reactive (plyo) and ballistic (jump) keys trade places as the Receive-Create stage moves: read them together too
      const j = r.jump_contacts || { target: 0, planned: 0 }, p = r.plyo_contacts || { target: 0, planned: 0 };
      return { ...r, all_jumps: { target: (j.target || 0) + (p.target || 0), planned: (j.planned || 0) + (p.planned || 0) } };
    });
    if (!rows.length) continue;
    const keys = [...new Set(rows.flatMap(r => Object.keys(r).filter(k => typeof r[k] === 'object' && r[k] && 'target' in r[k])))];
    const parts = [];
    for (const k of keys) {
      const p = rows.map(r => r[k] ? r[k].planned : null), t = rows.map(r => r[k] ? r[k].target : null);
      if (t.every(x => !x) && p.every(x => !x)) continue;
      let flat = 0; for (let i = 1; i < p.length; i++) if ((p[i] || 0) <= (p[i - 1] || 0)) flat++;
      const ratio = p.map((x, i) => (t[i] ? (x || 0) / t[i] : null)).filter(x => x !== null);
      const mr = ratio.length ? Math.min(...ratio) : null, Mr = ratio.length ? Math.max(...ratio) : null;
      parts.push(`${k}: ${p[0]} -> ${p[p.length - 1]} (${t[0]} -> ${t[t.length - 1]}), delivered ${pct(100 * mr)}-${pct(100 * Mr)} of target, flat/down weeks ${flat}/${p.length - 1}`);
    }
    console.log(`- **${short(o.name)}**: ${parts.join('; ')}; plyo share planned ${rows.map(r => r.planned_share === null ? '-' : Math.round(100 * r.planned_share)).join('·')} % vs target ${Math.round(100 * rows[0].share_target)} -> ${Math.round(100 * rows[rows.length - 1].share_target)} %`);
  }
}

if (sec === 'all' || sec === 'churn') {
  console.log('\n### Exercise-block integrity\n');
  console.log('| Sample | Slots whose exercise changes inside an exercise block | Slots present only part of their exercise block |');
  console.log('|---|---|---|');
  for (const o of all) console.log(`| ${short(o.name)} | ${o.exercise_changes_inside_block} | ${o.slots_partial_in_block} |`);
}
