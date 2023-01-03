import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt': './input.txt', 'utf-8')
  .trim()
  .split('\n').map((d) => parseInt(d, 10));


function fill(amount, containers, used = [], result) {
  let num = 0;
  const cs = [...containers];
  const [c] = cs.splice(0, 1);
  const d = amount - c;
  if (d === 0) {
    if (result) {
      if (used.length < result.min) {
        result.min = used.length;
        result.num = 0;
      }
      if (used.length === result.min) {
        result.num++;
      }
    }
    num++;
  }
  if (cs.length) {
    num += fill(amount, cs, used, result);
    if (d > 0) {
      num += fill(d, cs, [...used, c], result);
    }
  }
  return num;
}

function puzzle1() {
  return fill(TEST ? 25 : 150, data);
}

function puzzle2() {
  const result = { min: Number.MAX_SAFE_INTEGER, num: 0 }
  fill(TEST ? 25 : 150, data, [], result);
  return result.num;
}

console.log('puzzle 1: ', puzzle1()); // 1304
console.log('puzzle 2: ', puzzle2()); // 18
