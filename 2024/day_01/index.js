import fs from 'fs';
import chalk from 'chalk-template';

const data = [[], []];

for (const line of fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)) {
  const [a, b] = line.split(/\s+/).map((s) => parseInt(s, 10));
  data[0].push(a)
  data[1].push(b)
}
// console.log(data);

function puzzle1() {
  let sum = 0;
  data[0].sort((a, b) => a - b);
  data[1].sort((a, b) => a - b);
  for (let i = 0; i < data[0].length; i++) {
    sum += Math.abs(data[0][i] - data[1][i]);
  }
  return sum;
}
function puzzle2() {
  let sum = 0;
  for (const n of data[0]) {
    const count = data[1].reduce((p ,v) => (v === n ? p + 1 : p), 0);
    sum += count * n;
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
