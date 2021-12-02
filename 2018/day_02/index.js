
const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => {
    const [d, n] = s.split(' ');
    return [d, parseInt(n, 10)];
  });


function puzzle2() {
  let pos = 0;
  let dep = 0;
  let aim = 0;
  for (const [d, n] of data) {
    if (d === 'forward') {
      pos += n;
      dep += aim * n;
    }
    if (d === 'down') {
      aim += n;
    }
    if (d === 'up') {
      aim -= n;
    }
  }
  console.log('pos', pos, 'dep', dep);
  return pos * dep;
}

function puzzle1() {
  let pos = 0;
  let dep = 0;
  for (const [d, n] of data) {
    if (d === 'forward') {
      pos += n;
    }
    if (d === 'down') {
      dep += n;
    }
    if (d === 'up') {
      dep -= n;
    }
  }
  console.log('pos', pos, 'dep', dep);
  return pos * dep;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
