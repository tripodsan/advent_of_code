import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line
    .split('x')
    .map((d) => parseInt(d, 10))
    .sort((a0, a1) => a0 - a1));

// console.log(data);

function puzzle2() {
  let sum = 0;
  for (const [l, w, h] of data) {
    sum += 2*l + 2*w + l*w*h;
  }
  return sum;
}

function puzzle1() {
  let sum = 0;
  for (const [l, w, h] of data) {
    sum += 3*l*w + 2*w*h + 2*h*l
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
