
const fs = require('fs');
const data = fs.readFileSync('./input_test2.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/).map((l) => parseInt(l, 10)));

console.log(data);

function puzzle2() {
  let sum = 0;
  data.forEach((row) => {
    for (let i = 0; i < row.length - 1; i++) {
      for (let j = i + 1; j < row.length; j++) {
        const v0 = row[i];
        const v1 = row[j];
        if (v0 % v1 === 0) {
          sum += v0 / v1;
        }
        if (v1 % v0 === 0) {
          sum += v1 / v0;
        }
      }
    }
  })
  return sum;

}

function puzzle1() {
  let sum = 0;
  data.forEach((row) => {
    let min = Number.MAX_SAFE_INTEGER;
    let max = Number.MIN_SAFE_INTEGER;
    row.forEach((n) => {
      min = Math.min(n, min);
      max = Math.max(n, max);
    })
    sum += max - min;
  })
  return sum;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
