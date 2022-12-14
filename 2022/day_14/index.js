import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim().split('\n')
  .map((s) => s.split(' -> ').map((w) => w.split(',').map((d) => parseInt(d, 10))));

// console.log(data);

function parse() {
  const grid = new Grid();
  for (const line of data) {
    let p0;
    for (const p1 of line) {
      if (p0) {
        grid.line(p0, p1, '#');
      }
      p0 = p1;
    }
  }
  return grid;
}


function fall(s, grid, floor = Number.MAX_SAFE_INTEGER) {
  if (grid.get(s)) {
    return false;
  }
  while (s[1] < grid.max[1]) {
    if (s[1] + 1 === floor) {
      grid.put(s, '*');
      return true;
    }
    s[1]++;
    if (grid.get(s)) {
      s[0]--;
      if (grid.get(s)) {
        s[0]+=2;
        if (grid.get(s)) {
          grid.put([s[0]-1, s[1]-1], '*');
          return true;
        }
      }
    }
  }
  return false;
}

function puzzle1() {
  const grid = parse();
  let count = 0;
  while (fall([500, 0], grid)) {
    count += 1;
  }
  // console.log(grid.dump(null, (cell) => cell?.c ?? '.'));
  return count;
}
function puzzle2() {
  const grid = parse();
  const maxY = grid.max[1] + 2;
  grid.put([0, maxY], '#');
  let count = 0;
  while (fall([500, 0], grid, maxY)) {
    count += 1;
  }
  // grid.line([grid.min[0] - 4, maxY], [grid.max[0] + 4, maxY], '#')
  // console.log(grid.dump( null, (cell) => cell?.c ?? '.'));
  return count;
}

console.log('puzzle 1 : ', puzzle1()); // 1330
console.log('puzzle 2 : ', puzzle2()); // 26139
