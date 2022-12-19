import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';
import { Heap } from 'heap-js';

const RE = /pos=<(-?\d+),(-?\d+),(-?\d+)>, r=(\d+)/


const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((c) => {
    const [_, x, y, z, r] = c.match(RE).map((d) => parseInt(d, 10));
    return {
      x, y, z, r,
    }
  }).sort((r0, r1) => r1.r - r0.r);


function puzzle1() {
  const [ r0 ] = data;
  let s = 0;
  for (const r1 of data) {
    const dist = Math.abs(r0.x - r1.x) + Math.abs(r0.y - r1.y) + Math.abs(r0.z - r1.z);
    if (dist <= r0.r) {
      s++;
    }
  }
  return s;
}

function puzzle2() {
  const ranges = [];
  for (const { x,y,z,r } of data) {
    const dist = Math.abs(x) + Math.abs(y) + Math.abs(z);
    ranges.push({ d: Math.max(0, dist - r), c: 1 });
    ranges.push({ d: dist + r + 1, c: -1 });
  }
  ranges.sort((e0, e1) => e0.d - e1.d);

  let count = 0
  let max = 0
  let bestDist = 0
  for (const { d, c } of ranges) {
    count += c;
    if (count > max) {
      bestDist = d;
      max = count;
    }
  }
  return bestDist;
}

console.log('puzzle 1:', puzzle1());  // 419
console.log('puzzle 2:', puzzle2());  // 60474080
