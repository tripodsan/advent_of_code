import crypto from 'crypto';
import fs from 'fs';

const RE = /Disc #(\d+) has (\d+) positions; at time=0, it is at position (\d+)./;

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((s) => s.match(RE))
  .map((m) => {
    const nr = parseInt(m[1], 10);
    const n = parseInt(m[2], 10);
    const p = parseInt(m[3], 10);
    return {
      p: n - (p + nr) % n,
      n,
    };
  });

/*

Disc #1 has 5 positions; at time=0, it is at position 4.
Disc #2 has 2 positions; at time=0, it is at position 1.

(x + 1 + 4) % 5 = 0
(x + 2 + 1) % 2 = 0

 */

function merge(d0, d1) {
  let { p, n } = d0;
  const nn = n * d1.n;
  while (p < nn) {
    if (p % d1.n === d1.p) {
      return {
        p,
        n: nn,
      }
    }
    p += n;
  }
  throw Error();
}

function solve(discs) {
  discs.sort((d0, d1) => d0.n - d1.n);
  while (discs.length > 1) {
    discs.push(merge(discs.pop(), discs.pop()));
  }
  return discs[0].p;
}

function puzzle1() {
  return solve([...data]);
}

function puzzle2() {
  const discs = [...data];
  discs.push({
    p: 11 - (discs.length + 1),
    n: 11,
  });
  return solve(discs);
}

console.log('puzzle 1: ', puzzle1()); // 317371
console.log('puzzle 2: ', puzzle2()); // 2080951
