const fs = require('fs');

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s);

console.log(data);

function run() {
  return 42;
}

function puzzle2() {
  return run();
}

function puzzle1() {
  return run();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
