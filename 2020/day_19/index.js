
const fs = require('fs');
// const { kgv } = require('../utils.js');

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s)=> s.split(/(\s+|[()])/g).map((ss) => ss.trim()).filter((ss) => !!ss));

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
