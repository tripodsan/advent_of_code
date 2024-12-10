import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { pairs } from '../../utils.js';

function parse() {
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => ({
      c: parseInt(c, 10),
      n: -1,
    }));
  return grid;
}

function solve(all = false) {
  const grid = parse();
  // grid.dump(null, (cell) => Number.isNaN(cell.c) ? '.' : cell.c);

  const traverse_all = (p) => {
    p.n = 0;
    const next = p.c + 1;
    for (const n of grid.neighbours(p.v, (cell) => cell?.c === next)) {
      if (n.c === 9) {
        // if we found the end, give it value 1
        n.n = 1;
      }
      if (n.n < 0) {
        // never visited, traverse (which sets the n.n)
        traverse_all(n);
      }
      p.n += n.n;
    }
    return p.n;
  };

  const traverse = (p, iter) => {
    const next = p.c + 1;
    let score = 0;
    for (const n of grid.neighbours(p.v, (cell) => cell?.c === next)) {
      if (n.n === iter) {
        continue;
      }
      n.n = iter;
      if (n.c === 9) {
        score += 1;
      } else {
        score += traverse(n, iter);
      }
    }
    return score;
  };

  let count = 0;
  let iter = 0;
  for (const v0 of grid.scan()) {
    const p = grid.get(v0);
    if (p.c !== 0) {
      continue;
    }
    if (all) {
      count += traverse_all(p, iter);
    } else {
      count += traverse(p, iter);
    }
    iter += 1;
  }
  return count;
}

function puzzle1() {
  return solve();
}

function puzzle2() {
  return solve(true);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
