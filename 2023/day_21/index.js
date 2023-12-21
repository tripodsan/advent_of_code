import fs from 'fs';
import { Grid } from '../../Grid.js';
import chalk from 'chalk';

/*

the diamond shape within the input data ensures that the points on the diamond are always on the
shortest path from the start. the input size is 131x131 and the middle row/col are also
empty. this means, that we can cover a span of (MAX_ITER - 65) / 131 patterns in each direction.

      <>
    <><><>
  <><><><><>
<><><><><><><>
  <><><><><>
    <><><>
      <>

total repeating patterns "radius":
  r = (26501365 - 65)/131 + 1 = 202300 + 1

  323010323
  232101232
  323010323
  010323010
  101232101
  010323010


      1
     111
    10001
   1100011
  111000111
 10001110001
1100011100011
 10001110001
  111000111
   1100011
    10001
     111
      1

 */
function parse() {
  let start;
  const grid = new Grid(2).init(
    fs.readFileSync('./input_test2.txt', 'utf-8'),
    (x, y, c) => {
      if (c === 'S') {
        start = [x, y];
        c = '.';
      }
      return {
        c: c === '#' ? '#' : '.',
      }
    });

  grid.start = start;
  // grid.dump(start);
  return grid;
}


function get_path(grid, start, depth, infinite) {
  let path = new Grid(2);
  path.put(start);
  let size = 0;
  while (depth--) {
  // while (depth-- && size !== path.size()) {
    size = path.size();
    const new_path = new Grid(2);
    for (const c of path.values()) {
      for (const v of grid.neighboursV(c.v)) {
        const gv = infinite ? grid.mod(v) : v;
        if (grid.get(gv)?.c === '.') {
          new_path.getOrSet(v, () => ({ d: depth }));
        }
      }
    }
    path = new_path;
  }
  return path;
}

function fill(grid, start, depth) {
  const path = new Grid(2);
  path.put(start, { d: 0 });
  let size = 0;
  while (size !== path.size()) {
    size = path.size();
    for (const c of path.values()) {
      if (c.d < depth) {
        for (const v of grid.neighboursV(c.v)) {
          if (grid.get(grid.mod(v))?.c === '.') {
            path.getOrSet(v, () => ({ d: c.d + 1 }));
          }
        }
      }
    }
  }
  return path;
}

function dump(grid, path, name) {
  const lines = [];
  path.dump(null, (c, v) => {
    const s = c ? 'O' : grid.get(grid.mod(v)).c;
    const qx = Math.floor(v[0] / grid.length[0]) % 2;
    const qy = Math.floor(v[1] / grid.length[1]) % 2;
    if ((qx + qy)%2 === 0 && !name) {
      return chalk.yellow(s);
    } else {
      return s;
    }
  }, (line) => lines.push(line));
  const buf = lines.join('\n');
  if (name) {
    fs.writeFileSync(`${name}.txt`, buf);
    console.log(`wrote ${name}.txt, ${buf.length} bytes`);
  } else {
    console.log(buf);
  }
}
function dump1(grid, path, m) {
  path.dump(grid.start, (c, v) => {
    let s = c ? 'O' : grid.get(grid.mod(v)).c;
    if (c) {
      const p = Math.floor(c.d / m) % 2
      if (p) {
        s = chalk.yellow(s);
      }
    }
    return s;
  });
}

function puzzle1() {
  const grid = parse();
  const w = grid.length[0];
  const w2 = (w -1)/2;
  const path = get_path(grid, grid.start, w2 - 1);
  return path.size();
}

function puzzle2() {
  const grid = parse();
  const w = grid.length[0];
  const w2 = (w -1)/2;

  const d = 202300;
  // const path = get_path(grid, grid.start, d*w + w2, true);
  // dump(grid, path);

  const p0 = get_path(grid, grid.start, 2*w).size();
  const p1 = get_path(grid, grid.start, 2*w + 1).size();
  const p_w = get_path(grid, [w - 1, w2], w - 1).size();
  const p_e = get_path(grid, [0, w2], w - 1).size();
  const p_s = get_path(grid, [w2, 0], w - 1).size();
  const p_n = get_path(grid, [w2, w - 1], w - 1).size();
  const p_ne1 = get_path(grid, [0, w - 1], w2 -1).size();
  const p_nw1 = get_path(grid, [w - 1, w - 1], w2 -1).size();
  const p_se1 = get_path(grid, [0, 0], w2 -1).size();
  const p_sw1 = get_path(grid, [w - 1, 0], w2 -1).size();
  const p_ne0 = get_path(grid, [0, w - 1], w + w2 - 1).size();
  const p_nw0 = get_path(grid, [w - 1, w - 1], w + w2 -1).size();
  const p_se0 = get_path(grid, [0, 0], w + w2 -1).size();
  const p_sw0 = get_path(grid, [w - 1, 0], w + w2 -1).size();

  const d1 = d - 1;
  return d**2 * p0 + d1**2 * p1 + d * (p_ne1 + p_nw1 + p_se1 + p_sw1) + d1 * (p_ne0 + p_nw0 + p_se0 + p_sw0) + p_w + p_e + p_s + p_n;
}


console.log('puzzle 1:', puzzle1()); // 3617
console.log('puzzle 2:', puzzle2()); // 596857397104703
