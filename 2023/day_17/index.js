import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';

const initial_grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'), (x, y, c) => {
  return {
    e: Number.parseInt(c, 10),
  };
});

const DIRS = [
  [1, 0],  // 0: >
  [0, 1],  // 1: v
  [-1, 0], // 2: <
  [0, -1], // 3: ^
];

const DIRC = ['>', 'v', '<', '^'];

function get_heatloss(grid, d0, d1) {
  function dump(e) {
    const path = new Map();
    let p = e;
    while (p) {
      path.set(p.c, p);
      p = p.p;
    }
    initial_grid.dump(null, (c) => {
      const color = HSVtoRGB(c.e / 10.0, 1,1);
      return path.has(c)
        ? chalk.bold(DIRC[path.get(c).d])
        : chalk.rgb(color.r, color.g, color.b)(c.e);
    });
  }

  const key = (e) => `${e.c.v[0]}:${e.c.v[1]}:${e.d}:${e.s}`;

  const visited = new Set();
  const q = new Heap((e0, e1) => e0.e - e1.e);
  const end_cell = grid.get(grid.max);

  // enqueue 2 starts
  const beg0 = {
    c: grid.get([0,0]),
    e: 0,
    d: 0,
    s: -1,
    p: null,
  };
  visited.add(key(beg0))
  q.add(beg0);
  const beg1 = {
    c: grid.get([0,0]),
    e: 0,
    d: 1,
    s: -1,
    p: null,
  };
  visited.add(key(beg1))
  q.add(beg1);

  function move(ns, e, dd) {
    const d = (e.d + dd) % 4;
    const c = grid.get(vec2.add([0, 0], e.c.v, DIRS[d]));
    if (c) {
      ns.push({
        c,
        e: e.e + c.e,
        d,
        s: e.d === d ? e.s + 1 : 0,
        p: e,
      })
    }
  }

  function neighbours(e) {
    const ns = [];
    // get left and right neighbours
    if (e.s >= d0 - 1) {
      move(ns, e, 1);
      move(ns, e, 3);
    }
    if (e.s < d1 - 1) {
      move(ns, e, 0);
    }
    return ns;
  }

  while (q.size()) {
    const entry = q.pop();
    if (entry.c === end_cell && entry.s >= d0 - 1) {
      dump(entry);
      return entry.e;
    }
    for (const n of neighbours(entry)) {
      const k =  key(n);
      if (!visited.has(k)) {
        visited.add(k);
        q.add(n);
      }
    }
  }
  return -1;
}

function puzzle1() {
  return get_heatloss(initial_grid, 1, 3);
}

function puzzle2() {
  return get_heatloss(initial_grid, 4, 10);
}

console.log('puzzle 1:', puzzle1()); // 684
console.log('puzzle 2:', puzzle2()); // 822
