import fs from 'fs';
import { Grid } from '../../Grid.js';
import {vec2} from "../../vec2.js";

function parse() {
  const grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'),
    (x, y, c) => c === '@' ? {
      c,
    } : null );
  return grid;
}

const DIRS  = [
  [1 , 0],
  [1 , 1],
  [0 , 1],
  [-1 , 1],
  [-1 , 0],
  [-1 , -1],
  [0 , -1],
  [1 , -1],
]

function numNeighbours(grid, v) {
  let s = 0;
  for (const d of DIRS) {
    const pos = [0, 0];
    vec2.add(pos, v, d)
    if (grid.get(pos)) {
      s += 1;
    }
  }
  return s;
}

function removePaper(grid) {
  const dst = new Grid(2);
  for (const c of grid.values()) {
    if (numNeighbours(grid, c.v) >= 4) {
      dst.put(c.v, '@')
    }
  }
  return dst;
}


function puzzle1() {
  const grid = parse();
  const dst = removePaper(grid);
  return grid.size() - dst.size();
}

function puzzle2() {
  let src = parse();
  let count = 0;
  let removed = 0;
  do {
    const dst = removePaper(src);
    removed = src.size() - dst.size();
    src = dst;
    count += removed;
  } while (removed > 0);
  return count;
}

console.log('puzzle 1: ', puzzle1()); // 1384
console.log('puzzle 2: ', puzzle2()); // 37432260594
