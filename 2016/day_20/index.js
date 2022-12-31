import crypto from 'crypto';
import fs from 'fs';

const MAX = 4294967295;
const MIN = 0;

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((s) => s.split('-').map((d) => parseInt(d, 10)))
  .sort((d0, d1) => d0[0] - d1[0]);

// console.log(data)

function merge(ranges, r1) {
  // console.log(ranges, r1);
  for (let i = 0; i < ranges.length; i++) {
    const r0 = ranges[i];
    if (r1[0] >= r0[0] && r1[0] <= r0[1] + 1) {
      // r1 extends r0
      r0[1] = Math.max(r0[1], r1[1]);
      return;
    }
  }
  ranges.push(r1);
  ranges.sort((d0, d1) => d0[0] - d1[0]);
}

function puzzle1() {
  const deny = [...data];
  const ranges = [deny.shift()];
  while (deny.length) {
    merge(ranges, deny.shift());
  }
  return ranges[0][1]+1;
}

function puzzle2() {
  const deny = [...data];
  const ranges = [deny.shift()];
  while (deny.length) {
    merge(ranges, deny.shift());
  }
  let sum = 0;
  let last = -1;
  for (const [r0, r1] of ranges) {
    sum += r0 - last - 1;
    last = r1;
  }
  sum += MAX -last;
  return sum;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
