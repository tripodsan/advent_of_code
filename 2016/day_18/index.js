import { Grid } from '../../MapGrid.js';

const data = '.^^^.^.^^^.^.......^^.^^^^.^^^^..^^^^^.^.^^^..^^.^.^^..^.^..^^...^.^^.^^^...^^.^.^^^..^^^^.....^....';

function solve(data, h) {
  let num = 0;
  let line = data.split('').map((c) => {
    if (c === '^') {
      return true;
    }
    num++;
    return false;
  });
  const W = line.length;
  for (let y = 1; y < h; y++) {
    const next = [];
    let l = false;
    let c = line[0];
    let r = false;
    for (let x = 0; x < W; x++) {
      r = !!line[x + 1];
      /*
      a new tile is a trap only:
      - Its left and center tiles are traps, but its right tile is not.
      - Its center and right tiles are traps, but its left tile is not.
      - Only its left tile is a trap.
      - Only its right tile is a trap.
       */
      if (l && c && !r || c && r && !l || l && !r && !c || r && !c && !l) {
        next.push(true);
      } else {
        next.push(false);
        num++;
      }
      l = c;
      c = r;
    }
    line = next;
  }
  return num;
}

function puzzle1() {
  // return solve('.^^.^.^^^^', 10);
  return solve(data, 40);
}


function puzzle2() {
  return solve(data, 400000);
}

console.log('puzzle 1: ', puzzle1()); // 2013
console.log('puzzle 2: ', puzzle2()); // 20006289
