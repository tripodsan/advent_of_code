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

const DIRS2 = [
  [2, 0],  // 0: >
  [0, 2],  // 1: v
  [-2, 0], // 2: <
  [0, -2], // 3: ^
];

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

function get_path(grid, start, end) {
  const e = grid.get(end);
  let c = grid.get(start);
  const path = new Set();
  let time = 0;
  while (true) {
    path.add(c);
    c.time = time;
    if (c === e) {
      break;
    }
    let next;
    for (const d of DIRS) {
      const p = vec2.add([], c.v, d);
      const n = grid.get(p);
      if (!path.has(n) &&  n.c !== '#') {
        next = n;
        break;
      }
    }
    if (!next) {
      throw Error();
    }
    c = next;
    time += 1;
  }

  // grid.dump(undefined, (c) => {
  //   return path.has(c)
  //     ? chalk.bold('O')
  //     : chalk.grey(c.c);
  // });
  return path;
}

function solve(max_dist) {
  const { grid, start ,end } = parse();
  const path = get_path(grid, start, end);
  // go along the path and try to find shortcuts
  const heuristics = new Map();
  let count = 0;
  for (const c of path.values()) {
    for (let y = -max_dist; y <= max_dist; y += 1) {
      for (let x = -max_dist; x <= max_dist; x += 1) {
        const dist = Math.abs(x) + Math.abs(y);
        if (dist <= max_dist) {
          // only consider cheats shorter than 20
          const c1 = grid.get(vec2.add([], c.v, [x,y]));
          if (c1?.time) {
            const delta = c1.time - (c.time + dist);
            if (delta > 0) {
              // console.log(`save ${delta} at ${c.v}`)
              if (delta >= 50) {
                heuristics.set(delta, (heuristics.get(delta) ?? 0) + 1);
              }
              if (delta >= 100) {
                count += 1;
              }
            }
          }
        }
      }
    }
  }
  // console.log(heuristics);
  return count;
}

function puzzle1() {
  return solve(2);
}
function puzzle2() {
  return solve(20);
}

console.log('puzzle 1:', puzzle1()); // 1372
console.log('puzzle 2:', puzzle2()); // 979014
