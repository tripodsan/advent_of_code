
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .map((s)=> Number(s))
  .filter((n) => n > 0);

function puzzle2() {
  return 42;
}

function puzzle1() {
  return 42;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
