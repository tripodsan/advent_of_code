
const fs = require('fs');
const { kgv } = require('../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('')
  .map((s) => Number.parseInt(s))

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
