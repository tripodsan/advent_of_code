import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { counter, HSVtoRGB, rangedCounter } from '../../utils.js';

const secrets = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((l) => l.trim())
  .filter((l) => !!l)
  .map((l) => parseInt(l, 10));


function next(n) {
  /*
  Calculate the result of multiplying the secret number by 64. Then, mix this result into the secret number. Finally, prune the secret number.
  Calculate the result of dividing the secret number by 32. Round the result down to the nearest integer. Then, mix this result into the secret number. Finally, prune the secret number.
  Calculate the result of multiplying the secret number by 2048. Then, mix this result into the secret number. Finally, prune the secret number.
   */
  n = (n << 6 ^ n) & Number.MAX_SAFE_INTEGER % 16777216;
  n = (n >> 5 ^ n) & Number.MAX_SAFE_INTEGER % 16777216;
  return (n << 11 ^ n) & Number.MAX_SAFE_INTEGER % 16777216;
}

function puzzle1() {
  let sum = 0;
  for (const secret of secrets) {
    let n = secret;
    for (let i = 0; i < 2000; i++) {
      n = next(n);
    }
    sum += n;
  }
  return sum;
}

function decode(code) {
  const ret = [];
  for (let i = 0; i < 4; i++) {
    ret.unshift((code & 0xff) - 10);
    code = code >> 8;
  }
  return ret;
}

function encode(deltas) {
  let acc = 0;
  for (const d of deltas) {
    acc = ((acc << 8) & 0x00ffffffff) + (d + 10);
  }
  return acc;
}

function puzzle2() {
  // calculate the price lists
  const sellers = [];
  const codes = new Set(); // all possible codes
  for (const secret of secrets) {
    const prices = new Map();
    let acc = 0;
    let n = secret;
    for (let i = 0; i < 2000; i++) {
      const p = next(n);
      const price = p%10;
      const d = price - n%10;

      // calculate the delta-code for the current price
      acc = ((acc << 8) & 0x00ffffffff) + (d + 10);
      if (i > 2) {
        if (!prices.has(acc)) {
          prices.set(acc, price);
        }
        codes.add(acc);
      }
      n = p;
    }
    sellers.push(prices);
  }

  // for all possible deltas, find the best one
  let best_sum = 0;
  for (const code of codes.values()) {
    let sum = 0;
    for (const prices of sellers) {
      const p = prices.get(code) ?? 0;
      sum += p;
    }
    if (sum > best_sum) {
      best_sum = sum;
    }
  }
  return best_sum;
}

console.log('puzzle 1:', puzzle1());  // 18261820068
console.log('puzzle 2:', puzzle2());

