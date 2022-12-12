import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim();

// console.log(data);

const grid = new Grid();
let beg;
let end;

grid.init(data, (x, y, c) => {
  const v = [x, y];
  if (c === 'S') {
    beg = v;
    c = 'a';
  } else if (c === 'E') {
    end = v;
    c = 'z';
  }
  return {
    v,
    h: c.charCodeAt(0) - 96,
  };
});

// console.log(grid.dump(beg.v, ({h}) => String.fromCharCode(h + 96)));

function distance(current, next) {
  if (next.h - current.h > 1) {
    return 0;
  }
  return 1;
}

function puzzle1() {
  return grid.aStar(beg, end, distance).length - 1;
}
function puzzle2() {
  let best = Number.MAX_SAFE_INTEGER;
  for (const cell of grid.values()) {
    if (cell.h === 1) {
      const path = grid.aStar(cell.v, end, distance);
      if (path.length) {
        best = Math.min(best, path.length - 1);
      }
    }
  }
  return best;
}

console.log('puzzle 1 : ', puzzle1()); // 330
console.log('puzzle 2 : ', puzzle2()); // 321
