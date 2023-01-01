import fs from 'fs';
import { Grid } from '../../MapGrid.js';
import { permute } from '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim();

class BunnyGrid extends Grid {

}

function parse() {
  const g = new BunnyGrid();
  const pts = [];
  g.init(data, (x, y, c) => {
    if (c === '#') {
      return {
        c,
      }
    }
    if (c !== '.') {
      const d = parseInt(c, 10);
      pts[d] = [x, y];
    }
    return {
      c: '.',
    }
  });
  return { g, pts };
}

function TSP(dist, ret) {
  const N = dist.size;
  const ALL = 2**N - 1;
  const states = Array.init(N, () => new Map());

  const best = (pos, visited) => {
    if (visited === ALL) {
      // we don't need to go back to the start
      if (ret) {
        return pos ? dist.get(pos).get(0) : 0;
      } else {
        return 0;
      }
    }

    if (states[pos].has(visited)) {
      return states[pos].get(visited);
    }

    let min = Number.MAX_SAFE_INTEGER;
    let p = 1;
    for (let i = 0; i < N; i++) {
      if (i !== pos && ((visited & p) === 0)) {
        min = Math.min(min, dist.get(pos).get(i) + best(i, visited | p));
      }
      p *= 2;
    }
    // Storing the best dist for the set of traveled cities and untraveled ones.
    states[pos].set(visited, min);
    return min;
  }

  return best(0, 1);
}

function brute(dist) {
  const keys = [...dist.keys()];
  keys.shift(); // remove start
  let best1 = Number.MAX_SAFE_INTEGER;
  let best2 = Number.MAX_SAFE_INTEGER;
  for (const path of permute(keys)) {
    let prev = 0;
    let sum = 0;
    for (const pos of path) {
      sum += dist.get(prev).get(pos);
      prev = pos;
    }
    best1 = Math.min(best1, sum);
    sum += dist.get(prev).get(0);
    best2 = Math.min(best2, sum);
  }
  return {
    best1,
    best2,
  };
}

function solve() {
  const { g, pts } = parse();
  // create distance map between all points
  const dist = new Map();
  for (let i = 0; i<pts.length - 1; i++) {
    const row = dist.getOrSet(i, () => new Map());
    for (let j = i + 1; j<pts.length; j++) {
      const d = g.aStar(pts[i], pts[j], (c) => c && c.c === '.');
      row.set(j, d.length - 1);
      const col = dist.getOrSet(j, () => new Map());
      col.set(i, d.length - 1);
    }
  }
  console.log('solving with checking all permutations:')
  const { best1, best2 } = brute(dist);
  console.log('  puzzle 1: ', best1); // 490
  console.log('  puzzle 2: ', best2); // 744
  console.log('solving with dp:')
  console.log('  puzzle 1: ', TSP(dist, false));
  console.log('  puzzle 2: ', TSP(dist, true));
}

solve();
