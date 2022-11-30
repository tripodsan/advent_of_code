import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((line) => line.split(''));

const W = data[0].length;
const H = data.length;

const DIRS = [
  [ 0, -1],
  [ 1, -1],
  [ 1,  0],
  [ 1,  1],
  [ 0,  1],
  [-1,  1],
  [-1,  0],
  [-1, -1],
];

function dump(grid) {
  console.log('----------------------------------------------');
  grid.forEach(line => console.log(line.join('')));
}

function hash(grid) {
  let s = '';
  grid.forEach(line => s += line.join(''));
  return s;
}

function count(grid, x, y) {
  let t = 0;
  let l = 0;
  DIRS.forEach(([dx, dy]) => {
    const xx = x + dx;
    const yy = y + dy;
    if (xx >= 0 && xx < W && yy >=0 && yy < H) {
      const c = grid[yy][xx];
      if (c === '|') {
        t++;
      } else if (c === '#') {
        l++;
      }
    }
  });
  return [t, l];
}

function tick(grid) {
  const newGrid = [];
  for (let y = 0; y < H; y++) {
    const row = [];
    newGrid.push(row);
    for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      const [t, l] = count(grid, x, y);
      if (c === '.') {
        // An open acre will become filled with trees if three or more adjacent acres contained trees.
        // Otherwise, nothing happens.
        row.push(t >= 3 ? '|' : '.');
      } else if (c === '|') {
        // An acre filled with trees will become a lumberyard if three or more adjacent acres were lumberyards.
        // Otherwise, nothing happens.
        row.push(l >= 3 ? '#' : '|');
      } else {
        // An acre containing a lumberyard will remain a lumberyard
        // if it was adjacent to at least one other lumberyard
        // and at least one acre containing trees. Otherwise, it becomes open.
        row.push(l >= 1 && t >= 1 ? '#' : '.');
      }
    }
  }
  return newGrid;
}

function sums(grid) {
  let t = 0;
  let l = 0;
  grid.forEach((row) => row.forEach((c) => {
    if (c === '#') {
      l++;
    } else if (c === '|') {
      t++;
    }
  }));
  return [t, l];
}

function puzzle1(num) {
  let grid = data;
  let i = 0;
  while (i++ < num) {
    grid = tick(grid);
  }
  const [t, l] = sums(grid);
  return t * l;
}

function puzzle2(warmup, num) {
  let grid = data;
  let i = 0;
  while (i < warmup) {
    grid = tick(grid);
    i++;
  }
  // try to find sequence
  const list = [];
  while (i < num) {
    grid = tick(grid);
    const [t, l] = sums(grid);
    // const h = hash(grid);
    const p = t * l;
    if (list[0] === p) {
      break;
    }
    list.push(p);
    i++;
  }
  const mod = list.length;
  const numIdx = (num - warmup - 1) % mod;
  return list[numIdx];
}

console.log('puzzle 1:', puzzle1(10));
console.log('puzzle 2:', puzzle2(1000, 1000000000));
