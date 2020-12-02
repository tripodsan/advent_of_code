
const fs = require('fs');

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => {
    const m = s.match(/(\d+)-(\d+)\s+(\w+):\s+(\w+)/);
    return {
      min: Number(m[1]),
      max: Number(m[2]),
      char: m[3],
      pwd: m[4],
    };
  });

// console.log(data);

function puzzle2() {
  return 42;
}

function puzzle1() {
  return 42;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
