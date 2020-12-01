
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=>s.trim());


function puzzle2() {
  console.log('result puzzle 2:', 42);
}

function puzzle1() {
  console.log('result puzzle 1:', 42);
}

puzzle1();
puzzle2();
