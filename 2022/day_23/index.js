import fs from 'fs';
import { Grid } from '../../MapGrid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8');

const DIRS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
];

const DIR_IDX = [
  0, 2, 1, // north
  6, 4, 5, // south
  0, 6, 7, // west
  2, 4, 3, // east
]


function choose(g, v, dir_shift) {
  const all = [];
  let numEmpty = 0;
  for (const d of DIRS) {
    const vp = vec2.add([0, 0], v, d);
    const c = g.get(vp);
    if (!c) {
      numEmpty++;
    }
    all.push({
      v: vp,
      c,
    });
  }
  if (numEmpty === 8) {
    return null;
  }
  for (let d = 0; d < 4; d++) {
    let c = null;
    let nv = null;
    for (let i = 0; i < 3 && !c; i++) {
      const idx = DIR_IDX[((d + dir_shift)%4) * 3 + i];
      const e = all[idx];
      c = e.c;
      nv = e.v;
    }
    if (!c) {
      return nv;
    }
  }
  return null;
}

function simulate(maxIter = Number.MAX_SAFE_INTEGER) {
  let g0 = new Grid();
  g0.init(data, (x, y, c) => c === '#' ? {} : null);
  const numElves = g0.size();

  let iter = 0;
  while (iter < maxIter) {
    const g1 = new Grid();
    let chosen = false;
    for (const { v } of g0.values()) {
      const nv = choose(g0, v, iter);
      if (nv) {
        chosen = true;
        const c = g1.get(nv);
        if (c) {
          c.invalid = true;
          g1.put(v);
        } else {
          g1.put(nv, {
            o: v,
          });
        }
      } else {
        g1.put(v);
      }
    }
    if (!chosen) {
      break;
    }
    for (const c of g1.values()) {
      if (c.invalid) {
        g1.put(c.o);
        g1.del(c.v);
      }
    }
    iter += 1;
    g0 = g1;
    // console.log('--------------------------------', iter);
    // g0.dump();
  }
  return {
    num: g0.area() - numElves,
    iter,
  };
}

function simulate2(maxIter = Number.MAX_SAFE_INTEGER) {
  let g0 = new Grid();
  g0.init(data, (x, y, c) => c === '#' ? {} : null);
  const numElves = g0.size();

  let iter = 0;
  while (iter < maxIter) {
    let chosen = false;
    const proposals = new Map();
    for (const { v } of g0.values()) {
      const nv = choose(g0, v, iter);
      if (nv) {
        chosen = true;
        const key = g0.key(nv);
        let moves = proposals.get(key);
        if (!moves) {
          moves = [];
          proposals.set(key ,moves);
        }
        moves.push([v, nv]);
      }
    }
    if (!chosen) {
      break;
    }
    for (const moves of proposals.values()) {
      if (moves.length === 1) {
        g0.del(moves[0][0]);
        g0.put(moves[0][1]);
      }
    }
    iter += 1;
    // console.log('--------------------------------', iter);
    // g0.dump();
  }
  console.log(g0.span(0), g0.span(1), numElves);
  return {
    num: g0.area() - numElves,
    iter,
  };
}

// console.log('puzzle 1 : ', simulate(10).num);
// console.log('puzzle 2 : ', simulate().iter + 1);

let num = -1;
let sum = 0;
while (num < 10) {
  const t0 = Date.now();
  const res = simulate2().iter + 1;
  const t1 = Date.now();
  console.log(`[${num}]: puzzle 2: ${res} (${t1-t0}ms)`);
  if (num >= 0) {
    sum += t1- t0;
  }
  num++;
}
console.log(`avg: ${sum/num}`);
