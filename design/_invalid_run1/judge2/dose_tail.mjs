// Judge 2 - the research chain, unchanged, on one mainstream intake: stay-active racket player, 3 days x 60 min.
import { CASES, runCase } from '../research/proto_endpoint.mjs';
const t0 = process.hrtime.bigint();
const out = runCase({ name: 'X   E2 template (stay-active racket player, L2), 3 days x 60 min', o: { ...CASES[1].o, days: 3, minutes: 60 }, offers: false });
console.log(out.join('\n'));
console.log(`\nwall time ${(Number(process.hrtime.bigint() - t0) / 1e9).toFixed(1)} s`);
