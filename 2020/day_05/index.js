
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.replace(/[FL]/g, '0').replace(/[BR]/g, 1))
  .map((s) => Number.parseInt(s, 2))
  .sort((a,b) => a-b);

// data.forEach((d) => console.log(d, typeof(d)))

function puzzle2() {
  return data.filter((id, idx, a) => (id+1) !== a[idx+1])[0];
}

function puzzle1() {
  return data.reduce((p, c) => Math.max(p, c), 0);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
