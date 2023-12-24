export class Graph {
  nodes = new Map();
  edges = [];

  addEdge(n0, n1, weight, dir, data = {}) {
    const e = {
      idx: this.edges.length,
      n0,
      n1,
      dir,
      weight,
      ...data,
    };
    const ep = {
      ...e,
      n0: e.n1,
      n1: e.n0,
    }
    if (dir >= 0) {
      n0.out.push(e);
      n1.in.push(e);
    }
    if (dir <= 0) {
      n0.in.push(ep);
      n1.out.push(ep);
    }
    this.edges.push(e);
    // console.log(`adding edge ${e.idx}: ${n0.id.v} -> ${n1.id.v}: ${weight}`);
    return e;
  }

  addNode(id, data = {}) {
    const n = {
      id,
      out: [],
      in: [],
    };
    this.nodes.set(id, n);
    return n;
  }

  longestPath(start, end) {
    const paths = [];

    // brute force all possible paths
    function visit(n0, edges = [], nodes = [], cost = 0) {
      for (const edge of n0.out) {
        const { n1, weight } = edge;
        if (!nodes.includes(n1)) {
          const next = [...edges, edge];
          const total = cost + weight - 1;
          if (n1 === end) {
            paths.push({
              edges: next,
              cost: total,
            });
          } else {
            visit(n1,next, [...nodes, n1], total);
          }
        }
      }
    }
    visit(start);

    let longest = null;
    let max_cost = 0;
    for (const { edges, cost} of paths) {
      // console.log(edges.map(({idx}) => idx).join(), cost);
      if (cost > max_cost) {
        max_cost = cost;
        longest = edges;
      }
    }
    return longest;
  }
}
