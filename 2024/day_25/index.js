import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';

const OPS = {
  'AND': (i0, i1) => i0 & i1,
  'OR': (i0, i1) => i0 | i1,
  'XOR': (i0, i1) => i0 ^ i1,
}

function parse() {
  const schematics = fs.readFileSync('./input.txt', 'utf-8').split('\n\n');
  const keys = [];
  const locks = [];
  for (const schematic of schematics) {
    const lines = schematic.trim().split('\n');
    let input = [0, 0, 0, 0, 0];
    if (lines[0] === '#####') {
      locks.push(input);
    } else {
      keys.push(input);
    }
    lines.shift();
    lines.pop()
    for (const line of lines) {
      for (let i = 0; i < 5; i++) {
        if (line[i] === '#') {
          input[i] += 1;
        }
      }
    }
  }
  // console.log('locks', locks);
  // console.log('keys', keys);
  return { locks, keys };
}
function puzzle1() {
  const { locks, keys } = parse();
  let num = 0;
  for (const lock of locks) {
    for (const key of keys) {
      num += 1;
      for (let i = 0; i < 5; i++) {
        if (lock[i] + key[i] > 5) {
          num -= 1;
          break;
        }
      }
    }
  }
  return num;
}

console.log('puzzle 1:', puzzle1());

