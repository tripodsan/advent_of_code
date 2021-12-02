
const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));


function puzzle2() {
  let f = 0;
  const cache = {
    '0': true,
  };
  while (true) {
    for (const d of data) {
      f += d;
      const key = `${f}`;
      if (cache[key]) {
        return key;
      }
      cache[key] = true;
    }
  }
}

function puzzle1() {
  return data.reduce((p, c) => p + c, 0);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
