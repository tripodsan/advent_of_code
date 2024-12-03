import fs from 'fs';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((line) => line.split(/\s+/).map((s) => parseInt(s, 10)));

console.log(data);

function test(report) {
  const slope = Math.sign(report[1] - report[0])
  for (let i = 1; i < report.length; i++) {
    const d = report[i] - report[i - 1];
    const l = Math.abs(d);
    if (l < 1 || l > 3) {
      return 0;
    }
    if (Math.sign(d) !== slope) {
      return 0;
    }
  }
  return 1;
}

function puzzle1() {
  return data.reduce((acc, cur) => acc + test(cur), 0)
}

function puzzle2() {
  let num = 0;
  for (const report of data) {
    const safe = test(report);
    if (safe) {
      num += 1;
    } else {
      for (let i = 0; i < report.length; i++) {
        const damp = Array.from(report);
        damp.splice(i, 1);
        if (test(damp)) {
          num += 1;
          break;
        }
      }
    }
  }
  return num;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
