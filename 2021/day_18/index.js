// import { Grid } from '../../utils.js';
import { inspect } from 'unist-util-inspect';
import fs from 'fs';

function init() {
  // [[[0,[5,8]],[[1,7],[9,6]]],[[4,[1,2]],[[1,4],2]]]

  const parse = (list) => {
    const c = list.shift();
    if (c === '[') {
      const p0 = parse(list);
      if (list.shift() !== ',') {
        throw Error(', expected. was', c);
      }
      const p1 = parse(list);
      if (list.shift() !== ']') {
        throw Error('] expected. was', c);
      }
      return [p0, p1];
    } else {
      return parseInt(c);
    }
  };

  return fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .map((s) => s.split('').map((c) => {
      if (c === ',') {
        return undefined;
      }
      const n = Number.parseInt(c, 10);
      return Number.isNaN(n) ? c : n;
    }).filter((n) => n !== undefined));
}

function explode(list) {
  let d = 0;
  // find first deep pair
  let idx = -1;
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if (c === '[') {
      d++;
    } else if (c === ']') {
      d--;
    } else if (d > 4 && (typeof list[i+1] === 'number')) {
      idx = i;
      break;
    }
  }
  if (idx >= 0) {
    const n0 = list[idx];
    const n1 = list[idx + 1];
    for (let i = idx - 1; i > 0; i--) {
      if (typeof list[i] === 'number') {
        list[i] += n0;
        break;
      }
    }
    for (let i = idx + 2; i < list.length; i++) {
      if (typeof list[i] === 'number') {
        list[i] += n1;
        break;
      }
    }
    list.splice(idx - 1, 4, 0);
    return true;
  }
  return false;
}

function split(list) {
  for (let i = 0; i < list.length; i++) {
    const c = list[i];
    if ((typeof c === 'number') && c > 9) {
      const n0 = Math.floor(c / 2);
      const n1 = Math.ceil(c / 2);
      list.splice(i, 1, '[', n0, n1, ']');
      return true;
    }
  }
  return false;
}

function add(n0, n1) {
  const sum = ['[', ...n0, ...n1, ']'];
  while (true) {
    // console.log('-----------------------------');
    // dump(sum);
    if (explode(sum)) {
      continue;
    }
    if (split(sum)) {
      continue;
    }
    break;
  }
  return sum;
}

function dump(list) {
  console.log(list.join(''));
}

function mag(list) {
  const c = list.shift();
  if (typeof c === 'number') {
    return c;
  }
  if (c !== '[') {
    throw Error('[ expected was: ' + c);
  }
  const p0 = mag(list);
  const p1 = mag(list);
  if (list.shift() !== ']') {
    throw Error('] expected was: ' + c);
  }
  return p0 * 3 + p1 * 2;
}

function puzzle1() {
  const numbers = init();
  let sum = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    sum = add(sum, numbers[i]);
  }
  dump(sum);
  return(mag(sum));
}

function puzzle2() {
  const numbers = init();
  let max = 0;
  for (let i = 0; i < numbers.length; i++) {
    for (let j = 0; j < numbers.length; j++) {
      max = Math.max(max, mag(add(numbers[i], numbers[j])));
    }
  }
  return max;
}


console.log('puzzle 1:', puzzle1()); // 589
console.log('puzzle 2:', puzzle2()); // 2885
