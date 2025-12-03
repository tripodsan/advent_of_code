import fs from 'fs';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((line) => {
    const bank = line.split('').map((i, idx) => ({
      d: Number.parseInt(i),
      idx,
    }));
    bank.sort((a, b) => {
      if (a.d === b.d) {
        return a.idx - b.idx;
      }
      return b.d - a.d
    });
    return bank;
  });

// console.log(data);

function solve(n) {
  let sum = 0;
  for (const bank of data) {
    let power = 0;
    let lastIdx = -1;
    // for each battery
    for (let b = 0; b < n; b += 1) {
      // find the largest battery so that the following one still fit
      for (const bat of bank) {
        if (bat.idx > lastIdx && bat.idx < bank.length - (n - b - 1)) {
          power += bat.d * Math.pow(10, n - b - 1)
          lastIdx = bat.idx;
          break;
        }
      }
    }
    // console.log(power);
    sum += power;
  }
  return sum;
}

function puzzle1() {
  return solve(2);
}

function puzzle2() {
  return solve(12);
}

console.log('puzzle 1: ', puzzle1()); // 170520923035051
console.log('puzzle 2: ', puzzle2()); // 37432260594
