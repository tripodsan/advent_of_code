const fs = require('fs');
// p1: 374927
// p2: 1687617803407

let data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(',')
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));

function simulate(days) {
  const pops = new Array(9).fill(0);
  data.forEach((n) => pops[n+2]++);
  while (days--) {
    pops.push(pops.shift() + pops[1]);
  }
  return pops.reduce((s, e) => s + e, 0)
}

console.log('puzzle 1: ', simulate(80));
console.log('puzzle 2: ', simulate(256));
