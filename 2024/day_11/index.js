import fs from 'fs';
import chalk from 'chalk-template';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';

function parse() {
  return fs.readFileSync('./input.txt', 'utf-8').trim().split(/\s+/).map((s) => parseInt(s, 10));
}

function puzzle1() {
  let stones = parse();
  let n = 25;
  console.log(stones);
  while (n--) {
    const ns = [];
    for (const s of stones) {
      // If the stone is engraved with the number 0, it is replaced by a stone engraved with the number 1.
      const d = String(s);
      if (s === 0) {
        ns.push(1);
        // If the stone is engraved with a number that has an even number of digits, it is replaced by two stones. The left half of the digits are engraved on the new left stone, and the right half of the digits are engraved on the new right stone. (The new numbers don't keep extra leading zeroes: 1000 would become stones 10 and 0.)
      } else if (d.length % 2 === 0) {
        ns.push(parseInt(d.substring(0, d.length / 2), 10));
        ns.push(parseInt(d.substring(d.length / 2), 10));
        // If none of the other rules apply, the stone is replaced by a new stone; the old stone's number multiplied by 2024 is engraved on the new stone.
      } else {
        ns.push(s * 2024)
      }
    }
    stones = ns;
    // console.log(stones);
  }
  return stones.length;
}

function puzzle2() {
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
