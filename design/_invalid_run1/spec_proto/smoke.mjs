import { buildInstance, selectGroups, CASES } from './canon_endpoint.mjs';
import { prep, select } from './reduced.mjs';
const cpu = () => { const u = process.cpuUsage(); return (u.user + u.system) / 1000; };
for (const c of CASES) {
  const I = buildInstance(c.o);
  let t = cpu(); let ref; try { ref = selectGroups(I, { nodeLimit: 20000 }); } catch (e) { ref = { kept: ['UNKNOWN'], log: [] }; } const tr = cpu() - t;
  for (const hall of [false, true]) {
    const P = prep(I, { hall });
    t = cpu(); const s = select(P, 200000); const ts = cpu() - t;
    console.log(c.name.slice(0, 40), '| ref', ref.kept.join(','), `(${ref.log.reduce((a, l) => a + l.nodes, 0)} nodes, ${tr.toFixed(0)} ms)`, '| reduced' + (hall ? '+hall' : ''), s.kept.join(','), `(${s.nodes} nodes, max ${s.maxNodes}, ${ts.toFixed(1)} ms)`, s.kept.join() === ref.kept.join() ? 'SAME' : 'DIFF', s.log.map((l) => l.path[0] + l.nodes).join(' '));
  }
}
