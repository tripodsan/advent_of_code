import { Grid } from '../../utils.js';
import fs from 'fs';

function init() {
  const grid = new Grid();
  const folds = [];
  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .forEach((s) => {
      const segs = s.split(/[,= ]/).map((c) => c.trim());
      // console.log(segs);
      if (segs[0] === 'fold') {
        folds.push({
          c: parseInt(segs.pop(), 10),
          a: segs.pop() === 'x' ? 0 : 1,
        })
      } else {
        const x = parseInt(segs.shift(), 10);
        const y = parseInt(segs.shift(), 10);
        grid.put([x, y], { c: '#'});
      }
    });
  return [grid, folds];
}

function fold(grid, fold) {
  const { c, a } = fold;
  for (const { v } of grid.values()) {
    if (v[a] > c) {
      grid.del(v);
      v[a] = 2 * c - v[a];
      grid.put(v, { c: '#' });
    }
  }
}


function puzzle1() {
  const [grid, folds] = init();
  // grid.dump([-1, -1]);
  // console.log(folds);
  fold(grid, folds[0]);
  // grid.dump([-1, -1]);
  return grid.size();
}

function puzzle2() {
  const [grid, folds] = init();
  for (const f of folds) {
    fold(grid, f);
  }
  grid.trim();
  grid.dump([-1, -1]);

  return grid.size();
}


console.log('puzzle 1:', puzzle1()); // 3576
console.log('puzzle 2:', puzzle2()); // 84271
