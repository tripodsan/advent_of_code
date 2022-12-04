import fs from 'fs';
import * as utils from '../../utils.js';


const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(',')
    .map((d) => d.split('-')
      .map((p) => parseInt(p, 10)))
    .sort((r0, r1) => (r0[0] - r1[0])));

function puzzle2() {
  let num = 0;
  for (const [[s0, e0], [s1, e1]] of data) {
    if (s1 >= s0 && s1 <= e0) {
      num += 1;
    }
  }
  return num;
}


function puzzle1() {
  let num = 0;
  for (const [[s0, e0], [s1, e1]] of data) {
    if (s1 >= s0 && e1 <= e0) {
      num += 1;
    }
  }
  return num;
}

console.log('puzzle 1 : ', puzzle1()); // 511
console.log('puzzle 2 : ', puzzle2()); // 821
