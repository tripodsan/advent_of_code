import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n')
  .map((s) => s.split(/[^-\d]+/).map((d) => parseInt(d, 10)));
data.forEach((scans) => scans.shift());

// console.log(data);

function merge(segs, x0, x1) {
  for (let i = 0; i < segs.length; i++) {
    const s = segs[i];
    if (x1 >= s[0] - 1 && x0 <= s[1] + 1) {
      segs.splice(i--, 1);
      x0 = Math.min(x0, s[0]);
      x1 = Math.max(x1, s[1]);
    }
  }
  segs.push([x0, x1]);
}

function segments(y) {
  const segs = [];
  for (const [sx, sy, bx, by] of data) {
    // manhatten radius of sensor range
    const r = Math.abs(bx - sx) + Math.abs(by - sy);
    const dy = r - Math.abs(sy - y);
    // if line segment is within scan. merge it
    if  (dy > 0) {
      merge(segs, sx - dy, sx + dy);
    }
  }
  return segs;
}

function beacons(y) {
  const bs = [];
  for (const [sx, sy, bx, by] of data) {
    if (by === y && !bs.includes(bx)) {
      bs.push(bx);
    }
  }
  return bs;
}

function puzzle1() {
  const y = TEST ? 10 : 2000000;
  const segs = segments(y);
  return segs.map((s) => s[1] - s[0] + 1).sum() - beacons(y).length // test and data have one beacon at Y :-);
}
function puzzle2() {
  for (let y = 0; y <= TEST ? 20 : 4000000; y++) {
    const s = segments(y);
    if (s.length === 2) {
      const x = s[0][1] + 1;
      return x * 4000000 + y;
    }
  }
}

console.log('puzzle 1 : ', puzzle1()); // 4737444
console.log('puzzle 2 : ', puzzle2()); // 11482462818989
