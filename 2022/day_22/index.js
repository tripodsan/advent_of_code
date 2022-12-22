import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trimEnd()
  .split('\n')

const moves = data.pop().trim().split(/([RL])/);
data.pop();
const W = TEST ? 4 : 50;

// console.log(moves);
function paint(c) {
  return c ? c.c : ' ';
}

const DIRS = [
  [1,0],
  [0,1],
  [-1,0],
  [0,-1],
];
const DIRP = ['>', 'v', '<', '^'];

function parse() {
  const g = new Grid();

  const portal = (src, dst, dir, ext) => {
    let c = g.get(src);
    if (!c) {
      c = {
        c: '@',
        p:[null, null, null, null],
        d:[0, 0, 0, 0],
      }
      g.put(src, c);
    }
    c.p[dir] = dst;
    c.d[dir] = ext;
  }

  let y = 1;
  for (const row of data.map((d) => d.split(''))) {
    row.unshift(' ');
    let x = 0;
    let first = 0;
    let last = 0;
    for (const c of row) {
      const v = [x, y];
      if (c !== ' ') {
        g.put(v, { c });
        if (!first) {
          first = x;
        }
        last = x;
      }
      x += 1;
    }
    portal([first - 1, y], [last, y], 2, 2);
    portal([last + 1, y], [first, y], 0, 0);
    y += 1;
  }
  // create vertical portals
  for (let x = g.min[0]; x <= g.max[0]; x += 1) {
    let first = 0;
    let last = 0;
    for (let y = g.min[1] - 1; y <= g.max[1] + 1; y += 1) {
      const c = g.get([x, y]);
      if (c?.c === '.' || c?.c === '#') {
        if (!first) {
          first = y;
        }
        last = y;
      }
    }
    if (last) {
      portal([x, first - 1], [x, last], 3, 3);
      portal([x, last + 1], [x, first], 1, 1);
    }
  }
  return g;
}

function solve(g) {
  let pos = [data[0].indexOf('.') + 2, 1];
  // g.dump(pos, paint);
  let dir = 0;
  g.put(pos, { c: DIRP[dir]});
  for (const m of moves) {
    if (m === 'R') {
      dir = (dir + 1) % 4;
    } else if (m === 'L') {
      dir = (dir + 3) % 4;
    } else {
      for (let i = 0; i < parseInt(m, 10); i++) {
        let posP = vec2.add([0, 0], pos, DIRS[dir]);
        let c = g.get(posP);
        if (c.p) {
          posP = c.p[dir];
          const cp = g.get(posP);
          if (cp.c === '#') {
            break;
          }
          dir = c.d[dir];
          c = cp;
        }
        if (c.c === '#') {
          break;
        }
        pos = posP;
        g.put(pos, { c: DIRP[dir]});
      }
    }
    g.put(pos, { c: DIRP[dir]});
    // g.dump(pos, paint);
  }
  g.dump(pos, paint);
  // The final password is the sum of 1000 times the row, 4 times the column, and the facing.
  return pos[1] * 1000 + pos[0] * 4 + dir;
}
function puzzle1() {
  return solve(parse());
}


function attach(n, g, s0, d0, et0, ex0, s1, d1, et1, ex1, o0 = [0, 0], o1 = [0, 0]) {
  let v0 = vec2.add([0, 0], [s0%4 * W, Math.floor(s0 / 4) * W], o0);
  let v1 = vec2.add([0, 0], [s1%4 * W, Math.floor(s1 / 4) * W], o1);
  for (let i = 0; i < W; i++) {
    vec2.add(v0, v0, DIRS[d0]);
    vec2.add(v1, v1, DIRS[d1]);
    const c0 = g.get(v0);
    if (c0.p) {
      c0.p[et0] = vec2.add([0, 0], v1, DIRS[ex0]);
      c0.d[et0] = ex0;
      c0.c = n;
    } else {
      g.put(v0, { c: 'X'});
    }
    const c1 = g.get(v1);
    if (c1.p) {
      c1.p[et1] = vec2.add([0, 0], v0, DIRS[ex1]);
      c1.d[et1] = ex1;
      c1.c = n;
    } else {
      g.put(v1, { c: 'Y'});
    }
  }
}

function puzzle2() {
  const g = parse();
  if (TEST) {
    /*
    Test layout
          2
    4  5  6
         10 11
     */
    attach('a', g, 2, 1, 2, 1, 5, 0, 3, 0);
    attach('b', g, 4, 0, 3, 1, 2, 2, 3, 1, [0, 0], [W+1, 0]);
    attach('c', g, 5, 0, 1, 0, 10, 3, 2, 3, [0, W + 1], [0, W + 1]);
    attach('d', g, 6, 3, 0, 1, 11, 0, 3, 2, [W + 1, W + 1], [0, 0]);
    attach('e', g, 2, 1, 0, 2, 11, 3, 0, 2, [W + 1, 0], [W + 1, W + 1]);
    attach('f', g, 4, 0, 1, 3, 10, 2, 1, 3, [0, W + 1], [W + 1, W + 1]);
    attach('g', g, 4, 1, 2, 1, 11, 2, 1, 0, [0, 0], [W + 1, W + 1]);
  } else {
    /*
    Puzzle Layout
        1  2
        5
     8  9
    12
     */
    attach('a', g, 5, 1, 2, 1, 8, 0, 3, 0);
    attach('b', g, 1, 0, 3, 0, 12, 1, 2, 1);
    attach('c', g, 2, 0, 3, 3, 12, 0, 1, 1, [0, 0], [0, W + 1]);
    attach('d', g, 1, 1, 2, 0, 8, 3, 2, 0, [0, 0], [0, W + 1]);
    attach('e', g, 12, 1, 0, 3, 9, 0, 1, 2, [W + 1, 0], [0, W + 1]);
    attach('f', g, 5, 1, 0, 3, 2, 0, 1, 2, [W + 1, 0], [0, W + 1]);
    attach('g', g, 9, 1, 0, 2, 2, 3, 0, 2, [W + 1, 0], [W + 1, W + 1]);
  }
  // g.dump(null, paint);
  return solve(g);
}

console.log('puzzle 1 : ', puzzle1());  // 186128
console.log('puzzle 2 : ', puzzle2());  // 34426
