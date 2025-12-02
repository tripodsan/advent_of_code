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

console.log(data);

/*
     1 -    9 *    11 =       11 -       99
    10 -   99 *   101 =     1010 -     9999
   100 -  999 *  1001 =   100100 -   999999
  1000 - 9999 * 10001 = 10001000 - 99999999
 */
const segments = []
for (let p = 1; p <8; p += 1) {
  const f = Math.pow(10, p) + 1;
  segments.push({
    f,
    lo: Math.pow(10, p - 1) * f,
    hi: (Math.pow(10, p) - 1) * f,
  })
}

function puzzle1() {
  let total = 0;
  for (const [lo, hi] of data) {
    console.log('-----%d %d----', lo, hi)
    let segNr = Math.floor(Math.floor(Math.log10(lo))/2);
    let s = segments[segNr];
    let l = lo;
    while (l <= hi) {
      // find the highest multiple of s.f that is equal or lower than hi
      let h = Math.min(hi, s.hi)
      const ml = Math.ceil(l / s.f);
      const mh = Math.floor(h / s.f);
      total += sum(ml, mh) * s.f;
      console.log(l, h, s, ml, mh, sum(ml, mh));
      for (let i = ml; i <= mh; i += 1) {
        console.log(i * s.f);
      }
      segNr += 1;
      s = segments[segNr];
      l = s.lo;
    }
  }
  return total;
}

function puzzle2() {
}
// test 1: 1227775554
console.log('puzzle 1: ', puzzle1()); // 995
console.log('puzzle 2: ', puzzle2()); // 5847
