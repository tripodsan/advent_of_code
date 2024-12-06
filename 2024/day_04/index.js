import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

const data =  fs.readFileSync('./input.txt', 'utf-8').trim();


function parse() {
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => ({
      c,
    }));
  return grid;
}


const DIRS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
]

function check(grid, x, y, dir, word) {
  let i = 0;
  while (i < word.length) {
    const cell = grid.get([x, y]);
    // console.log(`${x},${y},${cell?.c} = ${XMAS[i]}`)
    if (cell?.c !== word[i]) {
      return 0;
    }
    x += dir[0];
    y += dir[1];
    i += 1;
  }
  return 1;
}

function check_diag(grid, x, y, dx, dy, c0, c1) {
  return grid.get([x - dx, y - dy])?.c === c0 && (grid.get([x + dx, y + dy])?.c === c1) ? 1 : 0;
}

function find(word, dirs) {
  const grid = parse();
  // console.log(grid.dump(undefined, ({c}) => c))
  let count = 0;
  for (let y = grid.min[1]; y <= grid.max[1]; y++) {
    for (let x = grid.min[0]; x <= grid.max[0]; x++) {
      if (grid.get([x, y])?.c === word[0]) {
        for (const dir of dirs) {
          count += check(grid, x, y, dir, word);
        }
      }
    }
  }
  return count;
}

function puzzle1() {
  return find('XMAS'.split(''), DIRS)
}

function puzzle2() {
  const grid = parse();
  // console.log(grid.dump(undefined, ({c}) => c))
  let count = 0;
  for (let y = grid.min[1]; y <= grid.max[1]; y++) {
    for (let x = grid.min[0]; x <= grid.max[0]; x++) {
      if (grid.get([x, y])?.c === 'A') {

        const d0 = check_diag(grid, x, y, 1, 1, 'M', 'S')  | check_diag(grid, x, y, 1, 1, 'S', 'M');
        const d1 = check_diag(grid, x, y, -1, 1, 'M', 'S')  | check_diag(grid, x, y, -1, 1, 'S', 'M');
        count += d0 * d1
      }
    }
  }
  return count;
}

console.log('puzzle 1: ', puzzle1()); // 2401
console.log('puzzle 2: ', puzzle2());
