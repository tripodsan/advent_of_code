import fs from 'fs';

const data = [];
let start = 0;
fs.readFileSync('./input.txt', 'utf-8').split('\n').forEach(line => {
  if (line.indexOf('S') >= 0) {
    start = line.indexOf('S');
  } else if (line.indexOf('^') >= 0) {
    data.push(line.split('').map((c) => c === '^' ? 1 : 0));
  }
});

function solve() {
  let beams = [start];
  let sum = Array.from({ length: data[0].length }, () => 0);
  sum[start] = 1;
  let count = 0;
  for (const line of data) {
    const next = new Set();
    const nextSum = Array.from({ length: data[0].length }, () => 0);
    for (const b of beams) {
      const bv = sum[b]
      if (line[b]) {
        next.add(b - 1);
        next.add(b + 1);
        nextSum[b-1] += bv
        nextSum[b+1] += bv
        count += 1;
      } else {
        next.add(b);
        nextSum[b] += bv
      }
    }
    beams = [...next.values()];
    sum = nextSum;
  }
  console.log('puzzle 1: ', count); // 1660
  console.log('puzzle 2: ', sum.reduce((acc, v) => acc + v, 0)); // 305999729392659
}


solve();
