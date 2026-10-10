// Minimal deterministic min-cost flow (successive shortest paths, Bellman-Ford / SPFA with a FIFO queue).
// Research prototype for design/algorithm_research.md - not engine code. Integer capacities and integer costs only,
// so the result is exact and identical on every JS engine (no floating point in the decision path).
// Negative arc costs are allowed as long as the input graph has no negative cycle (our graphs are DAGs).

export class MinCostFlow {
  constructor(n) { this.n = n; this.head = new Int32Array(n).fill(-1); this.to = []; this.cap = []; this.cost = []; this.next = []; }
  /** add arc u->v; returns the arc index (its reverse is index ^ 1) */
  addEdge(u, v, cap, cost) {
    if (!Number.isInteger(cap) || !Number.isInteger(cost)) throw new Error('integer cap / cost only');
    const e = this.to.length;
    this.to.push(v, u); this.cap.push(cap, 0); this.cost.push(cost, -cost);
    this.next.push(this.head[u], this.head[v]);
    this.head[u] = e; this.head[v] = e + 1;
    return e;
  }
  /** push up to maxFlow units s->t at minimum cost; stops early when the cheapest path has cost >= stopCost */
  run(s, t, maxFlow = Infinity, stopCost = Infinity) {
    let flow = 0, cost = 0;
    const n = this.n, dist = new Array(n), inq = new Uint8Array(n), prevE = new Int32Array(n);
    while (flow < maxFlow) {
      dist.fill(Infinity); prevE.fill(-1); dist[s] = 0;
      const q = [s]; inq.fill(0); inq[s] = 1; let qi = 0;
      while (qi < q.length) {                       // SPFA; deterministic: FIFO, adjacency in insertion order
        const u = q[qi++]; inq[u] = 0;
        for (let e = this.head[u]; e !== -1; e = this.next[e]) {
          if (this.cap[e] <= 0) continue;
          const v = this.to[e], nd = dist[u] + this.cost[e];
          if (nd < dist[v]) { dist[v] = nd; prevE[v] = e; if (!inq[v]) { inq[v] = 1; q.push(v); } }
        }
      }
      if (dist[t] === Infinity || dist[t] >= stopCost) break;
      let push = maxFlow - flow;
      for (let v = t; v !== s; v = this.to[prevE[v] ^ 1]) push = Math.min(push, this.cap[prevE[v]]);
      for (let v = t; v !== s; v = this.to[prevE[v] ^ 1]) { this.cap[prevE[v]] -= push; this.cap[prevE[v] ^ 1] += push; }
      flow += push; cost += push * dist[t];
    }
    return { flow, cost };
  }
  /** flow currently on arc e */
  flowOn(e) { return this.cap[e ^ 1]; }
}
