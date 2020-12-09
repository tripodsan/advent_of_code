const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => Number.parseInt(s));

function findSum(dat, sum, start, end) {
  for (let i = start; i < end; i++) {
    for (let j = i + 1; j < end; j++) {
      if (dat[i] + dat[j] === sum) {
        return true;
      }
    }
  }
  return false;
}

function process(mod) {
  let i = mod;
  while (i < data.length) {
    const n = data[i];
    if (!findSum(data, n, i - mod, i)) {
      return n;
    }
    i++;
  }
}

function puzzle2() {
  const sum = puzzle1();
  for (let i = 0; i < data.length; i++) {
    let total = data[i];
    let min = data[i];
    let max = data[i];
    for (let j = i + 1; j < data.length; j++) {
      total += data[j];
      min = Math.min(min, data[j]);
      max = Math.max(max, data[j]);
      if (total === sum) {
        return min + max;
      }
      if (total > sum) {
        break;
      }
    }
  }
}

function puzzle1() {
    return process(25);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
