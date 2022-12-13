import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim().split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map(JSON.parse);

// console.log(data);

function compare(a0, a1) {
  if (Array.isArray(a0)) {
    a1 = Array.isArray(a1) ? a1 : [a1];
  } else if (Array.isArray(a1)) {
    a0 = Array.isArray(a0) ? a0 : [a0];
  } else {
    return a0 - a1;
  }
  let i=0;
  let j=0;
  while (i < a0.length && j < a1.length) {
    const c = compare(a0[i++], a1[j++]);
    if (c !== 0) {
      return c;
    }
  }
  return a0.length - a1.length;
}

function puzzle1() {
  let sum = 0;
  for (let i = 0; i < data.length; i += 2) {
    const c = compare(data[i], data[i+1]);
    if (c < 0) {
      sum += Math.floor(i / 2) + 1;
    }
  }
  return sum;
}
function puzzle2() {
  const d0 = [[2]];
  const d1 = [[6]];
  data.push(d0, d1);
  data.sort(compare);
  return (data.indexOf(d0) + 1) * (data.indexOf(d1) + 1);
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
