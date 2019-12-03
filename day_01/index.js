
const fs = require('fs');

const data = fs.readFileSync('input.txt', 'utf-8')
  .split('\n')
  .filter((s) => !!s.trim())
  .map((s) => Number.parseInt(s));

function fuel(mass) {
  const f = Math.floor(mass / 3) - 2;
  if (f <= 0) {
    return 0;
  }
  return f + fuel(f);
}

console.log('Puzzle 1:', data.reduce((acc, mass) => acc + Math.floor(mass / 3) - 2,0 ));

console.log('Puzzle 2:', data.reduce((acc, mass) => acc + fuel(mass), 0));

console.log('test-fuel', fuel(100756))
