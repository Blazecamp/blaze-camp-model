// design/two-stage/proto/athletic.mjs - PROTOTYPE of stage SA (athletic pre-plan) for two samples.
// Stations and their sets come from an athletic LEVEL (0 = the protected minimum). The weekly targets come from the sport profile
// (here: the engine snapshot's budget for the same intake). For every budget FAMILY (ground contacts, throws, ...):
//   planned(w) = max(planned(w-1), min(capacity(w), round(scale x target(w))))   with ONE scale per budget key = min(1, capacity / target),
// so the dose climbs with the stairway, lands on the capacity in the last week and never drops; it is then shared out over the
// family's stations by a divisor (Webster) rule - a larger total never takes from any station - and per-set doses stay in bounds.
// Minutes depend on stations and sets only, so they are known BEFORE any resistance set is placed.   node athletic.mjs
const BLOCK = (w) => (w <= 4 ? 0 : w <= 8 ? 1 : 2);
const STAGE = ['RC1 Land', 'RC2 Land & Go', 'RC3 Repeat'];
const SEC = { jump: 99, upper: 99, ankle: 54, throw: 96, olympic: 180 };   // seconds per set (work + rest)
function webster(total, weights) {
  const n = weights.map(() => 0);
  for (let k = 0; k < total; k++) { let best = 0, bv = -1; weights.forEach((wt, i) => { const v = wt / (2 * n[i] + 1); if (v > bv) { bv = v; best = i; } }); n[best]++; }
  return n;
}
function plan(name, N, stations, families, perSet) {
  console.log(`\n### ${name}`);
  for (const F of families) {
    const famPlanned = new Array(N).fill(0), famTarget = new Array(N).fill(0);
    const lines = [];
    for (const k of F.keys) {
      const st = stations.filter((s) => s.key === k), target = F.targets[k];
      target.forEach((t, w) => { famTarget[w] += t; });
      if (!st.length) { if (target.some((t) => t > 0)) lines.push(`   ${k}: no station at this level (target ${target[0]} -> ${target[N - 1]})`); continue; }
      if (k === 'olympic_sets') {
        for (let w = 1; w <= N; w++) famPlanned[w - 1] += st.reduce((a, s) => a + s.sets[BLOCK(w)], 0);
        st.forEach((s) => lines.push(`   ${(s.day + ' ' + s.name).padEnd(30)} sets ${[1, 5, 9].filter((w) => w <= N).map((w) => s.sets[BLOCK(w)]).join(' -> ')} (by exercise block)`));
        continue;
      }
      const cap = [], min = []; for (let w = 1; w <= N; w++) { const e = BLOCK(w); cap.push(st.reduce((a, s) => a + s.sets[e] * perSet[k][1], 0)); min.push(st.reduce((a, s) => a + s.sets[e] * perSet[k][0], 0)); }
      let num = 1, den = 1; for (let w = 0; w < N; w++) if (target[w] > 0 && cap[w] * den < target[w] * num) { num = cap[w]; den = target[w]; }      // ONE scale per key = min(1, capacity / target)
      const rows = st.map(() => []), prevS = st.map(() => 0); let prev = 0; const planned = [];
      for (let w = 0; w < N; w++) {
        const e = BLOCK(w + 1);
        const A = Math.max(prev, min[w], Math.min(cap[w], Math.round((target[w] * num) / den)));
        const share = webster(A, st.map((s) => s.sets[e]));
        st.forEach((s, i) => { const tot = Math.min(s.sets[e] * perSet[k][1], Math.max(share[i], prevS[i], s.sets[e] * perSet[k][0])); prevS[i] = tot; rows[i].push(`${s.sets[e]}x${Math.ceil(tot / s.sets[e])}`); });
        prev = prevS.reduce((a, b) => a + b, 0); planned.push(prev); famPlanned[w] += prev;
      }
      lines.push(`   ${k}: target ${target.join(' ')}`);
      lines.push(`   ${''.padEnd(k.length)}  planned ${planned.join(' ')}   (scale ${Math.round((100 * num) / den)} %; capacity of this level ${cap[N - 1]})`);
      st.forEach((s, i) => lines.push(`      ${(s.day + ' ' + s.name).padEnd(30)} ${rows[i].join(' ')}`));
    }
    console.log(`${F.name}: target ${famTarget.join(' ')} | planned ${famPlanned.join(' ')}`);
    for (let i = 1; i < N; i++) if (famPlanned[i] < famPlanned[i - 1]) console.log('   !! the family DROPS in week', i + 1);
    console.log(lines.join('\n'));
  }
  const secByDay = {};
  for (const s of stations) for (let w = 1; w <= N; w++) (secByDay[s.day] = secByDay[s.day] || new Array(N).fill(0))[w - 1] += s.sets[BLOCK(w)] * SEC[s.cls] + (s.paired ? 30 : 60);
  console.log('stage by exercise block: ' + [1, 5, 9].filter((w) => w <= N).map((w) => `weeks ${w}-${Math.min(N, w + 3)} ${STAGE[BLOCK(w)]}`).join(', '));
  console.log('athletic minutes per day by week: ' + Object.entries(secByDay).map(([d, a]) => `${d} ${a.map((x) => (x / 60).toFixed(1)).join(' ')}`).join(' | '));
}
const PS = { jump_contacts: [3, 8], low_contacts: [6, 25], throws: [6, 20], upper_contacts: [3, 10] };
plan('01 swimmer, athletic level 0 (the approved structure at its smallest dose)', 12, [
  { key: 'jump_contacts', day: 'Mon', name: 'box jump', cls: 'jump', sets: [2, 2, 2] },
  { key: 'jump_contacts', day: 'Fri', name: 'broad / box jump', cls: 'jump', sets: [2, 2, 2], paired: true },
  { key: 'low_contacts', day: 'Wed', name: 'ankle hops', cls: 'ankle', sets: [2, 2, 2] },
  { key: 'upper_contacts', day: 'Wed', name: 'push-up landing / box', cls: 'upper', sets: [2, 2, 2] },
  { key: 'throws', day: 'Wed', name: 'overhead throw', cls: 'throw', sets: [2, 2, 2] },
  { key: 'throws', day: 'Fri', name: 'rotational scoop', cls: 'throw', sets: [2, 2, 2], paired: true },
  { key: 'olympic_sets', day: 'Mon', name: 'hang power clean', cls: 'olympic', sets: [2, 3, 3] },
  { key: 'olympic_sets', day: 'Wed', name: 'single-arm DB snatch', cls: 'olympic', sets: [2, 2, 3] },
  { key: 'olympic_sets', day: 'Fri', name: 'clean pull', cls: 'olympic', sets: [2, 2, 2] },
], [
  { name: 'ground contacts', keys: ['jump_contacts', 'low_contacts', 'plyo_contacts'], targets: { jump_contacts: [37, 38, 39, 41, 40, 41, 42, 43, 44, 45, 46, 46], low_contacts: [8, 10, 11, 13, 14, 15, 17, 20, 22, 24, 27, 27], plyo_contacts: [0, 0, 0, 0, 2, 2, 2, 2, 3, 3, 3, 3] } },
  { name: 'upper contacts', keys: ['upper_contacts'], targets: { upper_contacts: [14, 14, 14, 14, 15, 15, 15, 16, 16, 16, 16, 16] } },
  { name: 'throws', keys: ['throws'], targets: { throws: [35, 36, 37, 38, 39, 40, 41, 42, 43, 44, 45, 45] } },
  { name: 'olympic sets', keys: ['olympic_sets'], targets: { olympic_sets: [5, 5, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8] } },
], PS);
plan('08 pickleball, athletic level 0 (one athletic piece a day)', 12, [
  { key: 'throws', day: 'Mon', name: 'rotational medball scoop', cls: 'throw', sets: [2, 2, 2] },
  { key: 'jump_contacts', day: 'Thu', name: 'low box jump / squat jump', cls: 'jump', sets: [2, 2, 2] },
], [
  { name: 'ground contacts', keys: ['jump_contacts', 'low_contacts', 'plyo_contacts'], targets: { jump_contacts: [7, 7, 7, 8, 6, 6, 6, 6, 6, 6, 6, 5], low_contacts: [35, 38, 42, 46, 42, 46, 50, 54, 58, 63, 68, 73], plyo_contacts: [0, 0, 0, 0, 2, 2, 2, 3, 3, 3, 3, 4] } },
  { name: 'throws', keys: ['throws'], targets: { throws: [51, 53, 54, 56, 58, 59, 61, 62, 64, 66, 67, 69] } },
  { name: 'olympic sets', keys: ['olympic_sets'], targets: { olympic_sets: [4, 4, 5, 5, 5, 6, 6, 7, 7, 7, 8, 8] } },
], PS);
