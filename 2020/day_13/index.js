
const fs = require('fs');
const { kgv } = require('../utils.js');

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n');

const ts = BigInt(Number.parseInt(data[0]));
const schedule = data[1]
  .split(',')
  .map((s)=> s.trim())
  .map((s, idx) => s === 'x' ? [] : [BigInt(Number.parseInt(s)), BigInt(idx)])
  .filter((s) => s.length)

schedule.sort((s0, s1) => s0[0] - s1[0]);
// console.log(ts, schedule);

function puzzle2() {
  let t = 1n;
  let s = 0n;
  for (const [k,d] of schedule) {
    let tt = s + d;
    while (tt % k) {
      tt += t;
    }
    s = tt - d;
    t = kgv(t, k);
    console.log(s, t, d);
  }
  return s;
}

function puzzle1() {
  let t = ts;
  while (true) {
    for (let [s] of schedule) {
      if (t % s === 0n) {
        return (t - ts) * s;
      }
    }
    t++;
  }
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
