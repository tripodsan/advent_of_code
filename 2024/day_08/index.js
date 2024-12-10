import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { pairs } from '../../utils.js';

function parse() {
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => c);
  const antennas  = new Map();
  for (const v of grid.scan()) {
    const cell = grid.get(v);
    if (cell.c !== '.') {
      const a = antennas.get(cell.c) || [];
      a.push(cell);
      antennas.set(cell.c, a);
    }
  }
  grid.antennas = antennas;
  return grid;
}

function resonate(grid, all = false) {
  let count = 0;
  for (const [c,a] of grid.antennas.entries()) {
    for (const [a0, a1] of pairs(a, true)) {
      const d = vec2.sub([], a1.v, a0.v);
      let n = vec2.clone(all ? a0.v : a1.v);
      do {
        vec2.add(n, n, d);
        if (grid.inside(n)) {
          const node = grid.get(n);
          if (!node.n) {
            node.n = true;
            count += 1;
          }
        } else {
          break;
        }
      } while (all);
    }
  }
  grid.dump(undefined, (c) => c.n ? '#' : c.c);
  return count;
}

function puzzle1() {
  return resonate(parse());
}

function puzzle2() {
  return resonate(parse(), true);
}

console.log('puzzle 1: ', puzzle1()); // 244
console.log('puzzle 2: ', puzzle2());
