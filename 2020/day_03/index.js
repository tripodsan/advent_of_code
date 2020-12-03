
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s);

function slide(dx, dy) {
  let x = 0;
  let trees = 0;
  for (let y = 0; y < data.length; y += dy) {
    if (data[y][x] === '#') {
      trees++;
    }
    x  = (x+dx) % data[0].length;
  }
  return trees;
}

function puzzle2() {
  return [[1,1], [3,1], [5,1], [7,1], [1,2]].reduce((p, d) => {
    return p * slide(d[0], d[1]);
  }, 1);
}

function puzzle1() {
  return slide(3, 1);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
