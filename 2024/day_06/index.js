import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

function parse() {
  let start;
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => {
      if (c === '^') {
        start = [x, y]
      } else if (c === '#') {
        return '#'
      }
    });
  grid.start = start;
  return grid;
}


const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function getPath(grid) {
  let pos = grid.start;
  let dir = 0;
  const path = [];
  while (grid.inside(pos)) {
    let cell = grid.get(pos);
    if (!cell) {
      path.push(pos);
      cell = {
        c: 'x',
        dirs: [false, false, false, false],
      }
      grid.put(pos, cell);
    }
    if (cell.dirs[dir]) {
      return null;
    }
    cell.dirs[dir] = true;
    let next = vec2.add([], pos, DIRS[dir]);
    while (grid.get(next)?.c === '#') {
      dir = (dir + 1) % 4;
      next = vec2.add([], pos, DIRS[dir]);
    }
    pos = next
  }
  return path;
}

function puzzle1() {
  return getPath(parse()).length;
}

function puzzle2() {
  let count = 0;
  for (const obstacle of parse().scan()) {
    const grid = parse();
    if (vec2.equals(obstacle, grid.start)) {
      continue;
    }
    grid.put(obstacle, { c: '#' });
    if (getPath(grid) === null) {
      console.log(obstacle);
      grid.put(obstacle, { c: 'O' });
      // grid.dump(null, (cell) => cell?.c || '.');
      count += 1
    }
  }
  return count;
}

console.log('puzzle 1: ', puzzle1()); // 5208
console.log('puzzle 2: ', puzzle2());
