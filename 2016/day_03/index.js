import { Grid } from '../../utils.js';
import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line.trim().split(/\s+/).map((d) => (parseInt(d, 10))));

// console.log(data);

function possible(a, b, c) {
  return a + b > c && a + c > b && b + c > a ? 1 : 0;
}

function puzzle2() {
  let s = 0;
  for (let i = 0; i < data.length; i += 3) {
    const r0 = data[i];
    const r1 = data[i + 1];
    const r2 = data[i + 2];
    s += possible(r0[0], r1[0], r2[0]);
    s += possible(r0[1], r1[1], r2[1]);
    s += possible(r0[2], r1[2], r2[2]);
  }
  return s;
}

function puzzle1() {
  let s = 0;
  for (const [a, b,  c] of data) {
    s += possible(a, b, c);
  }
  return s;
}

console.log('puzzle 1: ', puzzle1());  // 982
console.log('puzzle 2: ', puzzle2());
