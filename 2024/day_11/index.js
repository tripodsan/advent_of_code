import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

function parse() {
  return fs.readFileSync('./input.txt', 'utf-8').trim().split(/\s+/).map((s) => parseInt(s, 10));
}

function solve(iter) {
  let counts = new Map();
  for (const s of parse()) {
    counts.set(s, 1);
  }
  while (iter--) {
    const ns = new Map();
    const add = (k,v) => {
      const p = ns.get(k) ?? 0;
      ns.set(k, p + v);
    };
    for (const [num, count] of counts.entries()) {
      const d = Math.floor(Math.log10(num)) + 1;
      if (num === 0) {
        // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
        add(1, count);
      } else if (d % 2 === 0) {
        // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
        const mag = 10 ** (d / 2);
        add(Math.floor(num / mag), count);
        add(num % mag, count);
      } else {
        // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
        add(num * 2024, count);
      }
    }
    counts = ns;
  }
  let sum = 0;
  for (const v of counts.values()) {
    sum += v;
  }
  return sum;
}

function puzzle1() {
  return solve(25);
}

function puzzle2() {
  return solve(75);
}

console.log('puzzle 1: ', puzzle1()); // 197157
console.log('puzzle 2: ', puzzle2()); // 234430066982597
