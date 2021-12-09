const { Grid } = require('../../utils.js');

const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(/[ ,]+/)
  .filter((s) => !!s);

// console.log(data);

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function puzzle2() {
  const grid = new Grid();
  let x = 0;
  let y = 0;
  let dir = 0;
  for (const d of data) {
    const dist = parseInt(d.substring(1), 10);
    if (d.charAt(0) === 'R') {
      dir = (dir + 1) % 4;
    } else {
      dir = (dir + 3) % 4;
    }
    for (let i = 0; i < dist; i++) {
      x += DIRS[dir][0];
      y += DIRS[dir][1];
      if (grid.get([x, y])) {
        return Math.abs(x) + Math.abs(y);
      }
      grid.put([x, y], {})
    }
  }
  return -1;

}

function puzzle1() {
  let x = 0;
  let y = 0;
  let dir = 0;
  data.forEach((d) => {
    const dist = parseInt(d.substring(1), 10);
    if (d.charAt(0) === 'R') {
      dir = (dir + 1) % 4;
    } else {
      dir = (dir + 3) % 4;
    }
    x += DIRS[dir][0] * dist;
    y += DIRS[dir][1] * dist;
  });
  return Math.abs(x) + Math.abs(y);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
