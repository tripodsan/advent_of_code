import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';

const DIRS = [
  [1, 0],  // 0: >
  [0, 1],  // 1: v
  [-1, 0], // 2: <
  [0, -1], // 3: ^
];

const DIRC = ['>', 'v', '<', '^'];

function parse() {
  let start;
  let end;
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'), (x, y, c) => {
    if (c === 'S') {
      start = [x, y];
    }
    if (c === 'E') {
      end = [x, y];
    }
    return c;
  });
  return {
    start,
    end,
    grid,
  }
}

function dump(grid, e) {
  const path = new Map();
  let p = e;
  while (p) {
    path.set(p.c, p);
    p = p.p;
  }
  grid.dump(null, (c) => {
    return path.has(c)
      ? chalk.bold(DIRC[path.get(c).d])
      : chalk.grey(c.c);
  });
}

function get_all_paths(grid, start, end, max = Infinity) {
  const key = (e) => `${e.c.v[0]}:${e.c.v[1]}:${e.d}`;

  const visited = new Map();
  const q = new Heap((e0, e1) => e0.s - e1.s);
  const end_cell = grid.get(end);

  // enqueue start
  const beg0 = {
    c: grid.get(start),
    d: 0,
    s: 0,
    p: null,
  };
  visited.set(key(beg0), {
    s: 0,
    p: beg0,
  })
  q.add(beg0);
  const paths = [];
  while (q.size()) {
    const entry = q.pop();
    if (entry.c === end_cell) {
      paths.push(entry);
      if (max === Infinity) {
        break;
      }
      continue;
    }
    for (let i = 0; i < 4; i++) {
      if (i === 2) {
        continue;
      }
      const d = (entry.d + i) % 4;
      const c = grid.get(vec2.add([0, 0], entry.c.v, DIRS[d]));
      if (c.c !== '#') {
        const score = entry.d === d ? entry.s + 1 : entry.s + 1001;
        if (score <= max) {
          const n = {
            c,
            d,
            s: score,
            p: entry,
          };
          const k =  key(n);
          let vs = visited.get(k);
          if (!vs) {
            vs = score;
            visited.set(k, score);
          }
          if (vs === score) {
            q.add(n);
          }
        }
      }
    }
  }
  return paths;
}

function puzzle1() {
  const { grid, start ,end } = parse();
  const [path] = get_all_paths(grid, start, end);
  // dump(grid, path);
  return path.s;
}

function puzzle2() {
  const { grid, start ,end } = parse();
  const [path] = get_all_paths(grid, start, end);
  const paths = get_all_paths(grid, start, end, path.s);
  let count = 0;
  for (const path of paths) {
    let p = path;
    while (p) {
      if (p.c.c !== 'O') {
        p.c.c = 'O';
        count += 1;
      }
      p = p.p;
    }
    // dump(grid, path);
  }
  // grid.dump();
  return count;
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());
