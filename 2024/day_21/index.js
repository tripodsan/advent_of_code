import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';
import * as path from 'node:path';


const data = fs.readFileSync('./input_test.txt', 'utf-8')
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

/**
 * returns the code (dir + steps * 4) to get from p0 to p1
 * @param from
 * @param to
 */
function dir_code(ret, p0, p1) {
  const x0 = p0 % 4;
  const y0 = p0 >> 2;
  const x1 = p1 % 4;
  const y1 = p1 >> 2;
  const dx = x1 - x0;
  const dy = y1 - y0;
  const cx = dx > 0 ? (dx * 4 + 0): dx < 0 ? (-dx * 4 + 2) : 0;  // left, right
  const cy = dy > 0 ? (dy * 4 + 1): dy < 0 ? (-dy * 4 + 3) : 0; // down, up
  // for the num pad, if starting from 0 or A, we need to travel Y first
  // for the dir pad, if starting from ^ or A, we need to travel Y first
  if (cx === 0 && cy === 0) {
    // do nothing
  } else if (cx === 0) {
    ret.push(cy)
  } else if (cy === 0) {
    ret.push(cx)
  } else {
    if (!(y0 === 3 && x1 === 0)) {
      ret.push(cx);
      ret.push(cy);
    } else if (!(y1 === 3 && x0 === 0)) {
      ret.push(cy);
      ret.push(cx);
    } else {
      throw Error();
    }
  }
  return ret;
}

function get_path(codes) {
  const ret = [];
  let p = NUM_PAD.A;
  for (const c of codes) {
    ret.push(...NUM_PAD_LOOKUP[p][c])
    ret.push(0);
    p = c;
  }
  return ret;
}

/**
 * returns the direction codes for the path
 * @param path
 */
function get_dir_codes(path) {
  const ret = [];
  let last = DIR_PAD[4];
  for (const p of path) {
    const d = p % 4;
    let n = p >> 2;
    if (n === 0) {
      dir_code(ret, last, DIR_PAD[4]);
      ret.push(0);
      last = DIR_PAD[4];
    } else {
      const code = DIR_PAD[d];
      dir_code(ret, last, code);
      while (n) {
        ret.push(0);
        n -= 1;
      }
      last = code;
    }
  }
  return ret;
}

/**
 * returns the direction codes for the path
 * @param path
 */
function get_dir_codes_lookup(path) {
  const ret = [];
  let last = DIR_PAD[4];
  for (const p of path) {
    const d = p % 4;
    let n = p >> 2;
    if (n === 0) {
      ret.push(...DIR_PAD_LOOKUP[last][DIR_PAD[4]])
      ret.push(0);
      last = DIR_PAD[4];
    } else {
      const code = DIR_PAD[d];
      ret.push(...DIR_PAD_LOOKUP[last][code])
      while (n) {
        ret.push(0);
        n -= 1;
      }
      last = code;
    }
  }
  return ret;
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


      let best = [];
      let best_length = Infinity;
      for (const s of solutions) {
        const c1 = get_dir_codes(s);
        if (calc_length(c1) < best_length) {
          best_length = calc_length(c1);
          best = s;
        }
      }
      // console.log(d0, d1, toString(best));
      row[p1] = best;
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


      let best = [];
      let best_length = Infinity;
      for (const s of solutions) {
        const c1 = get_dir_codes(s);
        // console.log(DIRS[i], DIRS[j], toString(s), toString(c1));
        if (calc_length(c1) < best_length) {
          best_length = calc_length(c1);
          best = s;
        }
      }
      // console.log(DIRS[i], DIRS[j], p0, p1, toString(best));
      row[p1] = best;
    }
  }
  return lookup;
}

const NUM_PAD_LOOKUP = analyze_pad();
const DIR_PAD_LOOKUP = analyze_dir();

function puzzle1() {
  let score = 0;
  for (const keys of data) {
    // map keys to internal representation
    console.log(keys);
    const codes = keys.split('').map((k) => NUM_PAD[k]);
    const p0 = get_path(codes);
    console.log(toString(p0));
    const c0 = get_dir_codes_lookup(p0);
    console.log(toString(c0));
    const c1 = get_dir_codes_lookup(c0);
    console.log(toString(c1));
    console.log(check(toString(c1)));
    const n = parseInt(keys.substring(0, keys.length - 1), 10);
    const l = calc_length(c1);
    console.log(l, n);
    score += l * n;
    // const c2 = get_dir_codes(c1);
    // dump(c2);
    // console.log(c1.length);
  }
  return score;
}

function puzzle2() {
}

console.log('puzzle 1:', puzzle1()); // 289060 285840
console.log('puzzle 2:', puzzle2());

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

