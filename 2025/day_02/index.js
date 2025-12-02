import fs from 'fs';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(',')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((line) => {
    const [low, high] = line.split('-');
    return [Number.parseInt(low), Number.parseInt(high)];
  });

data.sort((a, b) => a[0] - b[0]);
// console.log(data);

/*
     1 -    9 *    11 =       11 -       99
    10 -   99 *   101 =     1010 -     9999
   100 -  999 *  1001 =   100100 -   999999
  1000 - 9999 * 10001 = 10001000 - 99999999
 */
const segments1 = [];
const segments2 = [];
for (let p = 1; p <8; p += 1) {
  const f = Math.pow(10, p) + 1;
  const lo = Math.pow(10, p - 1);
  const hi = (Math.pow(10, p) - 1);
  const s = {
    f,
    lo: lo * f,
    hi: hi * f,
  };
  segments1.push(s)
  segments2.push(s);
  let l = f;
  while (true) {
    l = l * Math.pow(10, p) + 1;
    if (l > Number.MAX_SAFE_INTEGER) {
      break;
    }
    segments2.push({
      f: l,
      lo: lo * l,
      hi: hi * l,
    });
  }

}

function solve(segments) {
  let sum = 0;
  const seen = new Set();
  for (const [lo, hi] of data) {
    for (const s of segments) {
      let l = Math.ceil(lo / s.f) * s.f;
      l = Math.max(l, s.lo);
      while (l <= hi && l <= s.hi) {
        if (!seen.has(l)) {
          seen.add(l);
          // console.log(l);
          sum += l
        }
        l += s.f;
      }
    }
  }
  return sum;

}

function puzzle1() {
  return solve(segments1);
}

function puzzle2() {
  return solve(segments2);
}

console.log('puzzle 1: ', puzzle1()); // 29818212493
console.log('puzzle 2: ', puzzle2()); // 37432260594
