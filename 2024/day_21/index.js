import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';
import * as path from 'node:path';


const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c);

console.log(data);


/*

     0   1   2    3
   +---+---+---+
0  | 7 | 8 | 9 |
   +---+---+---+
1  | 4 | 5 | 6 |
   +---+---+---+
2  | 1 | 2 | 3 |
   +---+---+---+
3      | 0 | A |
       +---+---+

I = y * 4 + x

C = DIR + STEPS * 4

---------------------------

     0   1   2    3
       +---+---+
0      | ^ | A |
   +---+---+---+
1  | < | v | > |
   +---+---+---+

*/

const NUM_PAD = {
  '0': 1 + 3 * 4,
  'A': 2 + 3 * 4,
  '1': 0 + 2 * 4,
  '2': 1 + 2 * 4,
  '3': 2 + 2 * 4,
  '4': 0 + 1 * 4,
  '5': 1 + 1 * 4,
  '6': 2 + 1 * 4,
  '7': 0 + 0 * 4,
  '8': 1 + 0 * 4,
  '9': 2 + 0 * 4,
}

const DIR_PAD = [
  2 + 1 * 4, // right
  1 + 1 * 4, // down
  0 + 1 * 4, // left
  1 + 0 * 4, // up
  2 + 0 * 4, // A
]

const DIRS = [
  '>',
  'v',
  '<',
  '^',
  'A',
]

const DIRS_R = {
  '>': 1,
  'v': 4,
  '<': -1,
  '^': -4,
}
const DIR_PAD_R = {
  1: '^',
  2: 'A',
  4: '<',
  5: 'v',
  6: '>',
}

const NUM_PAD_R = {};
for (const [k,v] of Object.entries(NUM_PAD)) {
  NUM_PAD_R[v] = k;
}

function expand(a0, a1) {
  if (a1.length === 0) {
    // nothing to do
  } else if (a1.length === 1) {
    // number of paths remain
    for (const a of a0) {
      path.push(...a1[0])
    }
  } else {
    // duplicate paths
    const new_paths = [];
    for (const path of paths) {
      new_paths.push([...path, ...a1[1]])
      path.push(...a1[0])
    }
    a0 = a0.concat(new_paths);
  }
  return a0;
}

function get_paths(lookup, start, codes) {
  let paths = [[]];
  let p = start;
  for (const c of codes) {
    const m = NUM_PAD_LOOKUP[p][c]; // possible moves
    if (m.length === 0) {
      // nothing to do
    } else if (m.length === 1) {
      // number of paths remain
      for (const path of paths) {
        path.push(...m[0])
      }
    } else {
      // duplicate paths
      const new_paths = [];
      for (const path of paths) {
        new_paths.push([...path, ...m[1]])
        path.push(...m[0])
      }
      paths = paths.concat(new_paths);
    }
    for (const path of paths) {
      path.push(0); // press A
    }
    p = c;
  }
  return paths;
}
/**
 * returns the direction codes for the path
 * @param codes
 */
function get_dir_paths(codes) {
  let paths = [[]];
  let last = DIR_PAD[4];
  for (const p of codes) {
    const d = p % 4;
    let n = p >> 2;
    let code = DIR_PAD[4];
    if (n === 0) {
      // move to A
      n = 1;
    } else {
      code = DIR_PAD[d];
    }
    const ms = DIR_PAD_LOOKUP[last][code];
    if (ms.length === 0) {
      // do nothing
    } else if (ms.length === 1) {
      for (const path of paths) {
        path.push(...ms[0]);
      }
    } else {
      // duplicate paths
      const new_paths = [];
      for (const path of paths) {
        new_paths.push([...path, ...ms[1]])
        path.push(...ms[0])
      }
      paths = paths.concat(new_paths);
    }
    // press A
    const a = new Array(n);
    a.fill(0);
    for (const path of paths) {
      path.push(...a)
    }
    last = code;
  }
  return paths;
}

function toString(path) {
  let s = '';
  for (const p of path) {
    const d = p % 4;
    const n = p >> 2;
    if (n === 0) {
      s += 'A'
    } else {
      s += DIRS[d].repeat(n);
    }
  }
  return s;
}

function calc_length(path) {
  let s = 0;
  for (const p of path) {
    const n = p >> 2;
    if (n === 0) {
      s += 1;
    } else {
      s += n;
    }
  }
  return s;
}

function analyze_pad() {
  const lookup = [];
  const D = '0123456789A'.split('');
  for (let i = 0; i < 11; i += 1) {
    const d0 = D[i];
    const p0 =  NUM_PAD[d0];
    const x0 = p0 % 4;
    const y0 = p0 >> 2;

    const row = [];
    lookup[p0] = row;
    for (let j = 0; j < 11; j += 1) {
      const d1 = D[j];
      const p1 =  NUM_PAD[d1];
      if (i === j) {
        row[p1] = [];
        continue;
      }
      const x1 = p1 % 4;
      const y1 = p1 >> 2;
      const dx = x1 - x0;
      const dy = y1 - y0;
      const cx = dx > 0 ? (dx * 4 + 0): dx < 0 ? (-dx * 4 + 2) : 0;  // left, right
      const cy = dy > 0 ? (dy * 4 + 1): dy < 0 ? (-dy * 4 + 3) : 0; // down, up

      // either vertical then horizontal or vice versa.
      const solutions = [];
      if (cx === 0) {
        solutions.push([cy])
      } else if (cy === 0) {
        solutions.push([cx])
      } else {
        if (!(y0 === 3 && x1 === 0)) {
          solutions.push([cx, cy]);
        }
        //
        if (!(y1 === 3 && x0 === 0)) {
          solutions.push([cy, cx]);
        }
      }
      row[p1] = solutions;
    }
  }
  return lookup;
}

function analyze_dir() {
  const lookup = [];
  for (let i = 0; i < 5; i += 1) {
    const p0 =  DIR_PAD[i];
    const x0 = p0 % 4;
    const y0 = p0 >> 2;

    const row = [];
    lookup[p0] = row;
    for (let j = 0; j < 5; j += 1) {
      const p1 =  DIR_PAD[j];
      if (i === j) {
        row[p1] = [];
        continue;
      }
      const x1 = p1 % 4;
      const y1 = p1 >> 2;
      const dx = x1 - x0;
      const dy = y1 - y0;
      const cx = dx > 0 ? (dx * 4 + 0): dx < 0 ? (-dx * 4 + 2) : 0;  // left, right
      const cy = dy > 0 ? (dy * 4 + 1): dy < 0 ? (-dy * 4 + 3) : 0; // down, up

      // either vertical then horizontal or vice versa.
      const solutions = [];
      if (cx === 0) {
        solutions.push([cy])
      } else if (cy === 0) {
        solutions.push([cx])
      } else {
        if (!(y0 === 0 && x1 === 0)) {
          solutions.push([cx, cy]);
        }
        if (!(y1 === 0 && x0 === 0)) {
          solutions.push([cy, cx]);
        }
      }
      row[p1] = solutions;
    }
  }
  return lookup;
}

const NUM_PAD_LOOKUP = analyze_pad();
const DIR_PAD_LOOKUP = analyze_dir();


const mem = new Map();

function get_best(paths, depth) {
  let best = Infinity;
  let best_path;

  for (const path of paths) {
    const key = toString(path) + depth;
    console.log(key);
    let n;
    if (mem.has(key)) {
      n = mem.get(key);
    } else {
      n = depth === 0
        ? path
        : get_best(get_dir_paths(path), depth - 1);
      mem.set(key, n);
    }
    const len = calc_length(n);
    // console.log('  '.repeat(depth), toString(n), len);
    if (len < best) {
      best = len;
      best_path = n;
    }
  }
  if (!best_path) {
    throw Error();
  }
  return best_path;
}

function puzzle1(max) {
  let score = 0;
  for (const keys of data) {
    // map keys to internal representation
    console.log(keys);
    const n = parseInt(keys.substring(0, keys.length - 1), 10);
    const codes = keys.split('').map((k) => NUM_PAD[k]);
    const paths = get_paths(NUM_PAD_LOOKUP, NUM_PAD.A, codes);
    const best = get_best(paths, max);
    const len = calc_length(best);
    console.log(toString(best), len);
    score += len * n;
  }
  return score;
}

function puzzle2() {
}

console.log('puzzle 1:', puzzle1(2)); // 278748
console.log('puzzle 2:', puzzle1(3));

function reverse(path) {
  let s = '';
  let p = DIR_PAD[4];
  for (const d of path) {
    if (d === 'A') {
      s += DIR_PAD_R[p];
    } else {
      p += DIRS_R[d];
    }
  }
  return s;
}
function reverse_pad(path) {
  let s = '';
  let p = NUM_PAD.A;
  for (const d of path) {
    if (d === 'A') {
      s += NUM_PAD_R[p];
    } else {
      p += DIRS_R[d];
    }
  }
  return s;
}

function check(path) {
  console.log('check', path)
  const t0 = reverse(path);
  // console.log(t0);
  const t1 = reverse(t0);
  // console.log(t1);
  const t2 = reverse_pad(t1);
  // console.log(t2);
  return t2;
}

