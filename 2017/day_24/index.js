const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split('/')
    .map((d) => parseInt(d))
  )
  .map((c) => c.sort((c0, c1) => c0 - c1))
  .sort((c0, c1) => {
    let d = c0[0] - c1[0];
    if (d === 0) {
      d = c0[1] - c1[1];
    }
    return d;
  });

function traverse(nodes, node, path, cost, score) {
  score.maxCost = Math.max(score.maxCost, cost);
  if (path.length >= score.maxLen) {
    score.maxLen = path.length;
    score.maxLenCost = cost;
    console.log(path.join('-'), cost);
  } else if (path.length === score.maxLen) {
    score.maxLenCost = Math.max(score.maxLenCost, cost);
  }
  for (const e of node.e) {
    if (!e.v) {
      e.v = true;
      const c = e.c0 === node.n ? e.c1 : e.c0;
      const child = nodes[c];
      const cp = [...path, c];
      const cc = cost + node.n + c;
      // console.log(cp.join('-'), cc);
      traverse(nodes, child, cp, cc, score);
      e.v = false;
    }
  }
}

function puzzle1() {
  const nodes = [];

  const edges = {};
  data.forEach(([c0, c1]) => {
    console.log(c0, c1);
    let n0 = nodes[c0];
    if (!n0) {
      n0 = {
        n: c0,
        e: [],
      }
      nodes[c0] = n0;
    }
    let n1 = nodes[c1];
    if (!n1) {
      n1 = {
        n: c1,
        e: [],
      }
      nodes[c1] = n1;
    }
    const key = `${c0}-${c1}`;
    let edge = edges[key];
    if (!edge) {
      edge = {
        k: key,
        v: false,
        c0,
        c1,
      }
      edges[key] = edge;
    }
    n0.e.push(edge);
    n1.e.push(edge);
  });

  // console.log(nodes);
  const score = {
    maxCost: 0,
    maxLen: 0,
    maxLenCost: 0.
  }
  traverse(nodes, nodes[0], [0], 0, score);
  return score;
}

console.log('puzzle 1:', puzzle1()); // 1906
// console.log('puzzle 2:', puzzle1());
