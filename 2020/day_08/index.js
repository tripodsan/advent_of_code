
const fs = require('fs');

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  // .filter((s) => !!s)
  // .map((s) => s.replace(/[FL]/g, '0').replace(/[BR]/g, 1))
  // .map((s) => Number.parseInt(s, 2))
  // .sort((a,b) => a-b);

// data.forEach((d) => console.log(d, typeof(d)))

function process(validate) {
  return 42;
}
function puzzle2() {
  return process(true);
}

function puzzle1() {
  return process();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
