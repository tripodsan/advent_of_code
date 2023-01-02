import fs from 'fs';
import '../../utils.js';

const data = JSON.parse(fs.readFileSync('./input.json', 'utf-8'));

function sum(o, filter) {
  if (typeof o === 'number') {
    return o;
  }
  if (Array.isArray(o)) {
    return o.reduce((s, v) => s + sum(v, filter), 0);
  }
  if (typeof o === 'object') {
    let s = 0;
    for (const v of Object.values(o)) {
      if (v === filter) {
        return 0;
      }
      s += sum(v, filter);
    }
    return s;
  }
  return 0;
}

function puzzle1() {
  return sum(data);
}

function puzzle2() {
  return sum(data, 'red');
}

console.log('puzzle 1: ', puzzle1()); // 111754
console.log('puzzle 2: ', puzzle2()); // 65402
