import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((s) => s.split(' '));


const ins = [];
for (const [cmd, n] of data) {
  if (cmd === 'noop') {
    ins.push(0);
  } else {
    ins.push(0);
    ins.push(parseInt(n, 10));
  }
}

// console.log(ins);

function puzzle2() {
  const scr = Array.init(6, () => Array.init(40, '.'));
  let s = 1;
  for (let n = 0; n < 240; n += 1) {
    const x = n % 40;
    scr[Math.floor(n / 40)][x] = Math.abs(s - x) < 2 ? '█' : ' ';
    s += ins[n];
  }
  return '\n' + scr.map((line) => line.join('')).join('\n');
}

function puzzle1() {
  let x = 1;
  let s = 0;
  for (let n = 1; n <= 220; n += 1) {
    if ((n - 20) % 40 === 0) {
      s += x * n;
    }
    x += ins[n-1];
  }
  return s;
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
