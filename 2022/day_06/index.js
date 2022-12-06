import fs from 'fs';
import * as utils from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('');


function find_sequence(len) {
  for (let i = len; i < data.length; i += 1) {
    const s = new Set(data.slice(i - len, i));
    if (s.size === len) {
      return i;
    }
  }
}

function puzzle2() {
  return find_sequence(14);
}


function puzzle1() {
  return find_sequence(4);
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
