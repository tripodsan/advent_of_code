
const fs = require('fs');

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/g))
  .map((s) => Number.parseInt(s[1]));

// console.log(data);

function process(program) {
  return 42;
}

function puzzle2() {
  return process();
}

function puzzle1() {
  return process();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
