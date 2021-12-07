const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(',')
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));


let min = Number.MAX_SAFE_INTEGER;
let max = Number.MIN_SAFE_INTEGER;
let sum = 0;
for (const pos of data) {
  min = Math.min(pos, min);
  max = Math.max(pos, max);
  sum += pos;
}
console.log(sum / data.length, min, max)

function puzzle1() {
  let best = Number.MAX_SAFE_INTEGER;
  for (let i = min; i <= max; i++) {
    let d0 = 0;
    let d1 = 0;
    for (const pos of data) {
      const d = pos - i;
      if (d < 0) {
        d0 += d;
      } else {
        d1 += d;
      }
    }
    const fuel = Math.abs(d0) + d1;
    best = Math.min(best, fuel);
    // console.log(i, d0, d1, fuel);
  }
  return best;
}

function puzzle2() {
  let best = Number.MAX_SAFE_INTEGER;
  for (let i = min; i <= max; i++) {
    let fuel = 0;
    for (const pos of data) {
      const d = Math.abs(pos - i);
      fuel += (d**2 + d)/ 2;
    }
    best = Math.min(best, fuel);
    // console.log(i, fuel);
  }
  return best;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
