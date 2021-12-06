
const fs = require('fs');
const { Grid } = require('../utils.js');
// p1: 5145
// p2: 16518

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^0-9]+/).map((c) => parseInt(c, 10)));

function puzzle3() {
  const grid = new Grid();
  data.forEach((line) => {
    let [x0, y0, x1, y1] = line;
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    while (x0 !== x1 + dx || y0 !== y1 + dy) {
      grid.getOrSet([x0, y0], () => ({ c: 0})).c++;
      x0 += dx;
      y0 += dy;
    }
  });
  return grid.values().reduce((p, { c }) => p + (c > 1 ? 1 : 0), 0);
}

function puzzle2() {
  const grid = new Array(1000*1000).fill(0);
  data.forEach((line) => {
    let [x0, y0, x1, y1] = line;
    const dx = Math.sign(x1 - x0);
    const dy = Math.sign(y1 - y0);
    while (x0 !== x1 + dx || y0 !== y1 + dy) {
      grid[y0 * 1000 + x0]++;
      x0 += dx;
      y0 += dy;
    }
  });
  return grid.reduce((p, d) => p + (d > 1 ? 1 : 0), 0);
}

function puzzle1() {
  const grid = new Array(1000*1000).fill(0);
  data.forEach((line) => {
    let [x0, y0, x1, y1] = line;
    if (x0 === x1) {
      const d = Math.sign(y1 - y0);
      for (let y = y0; y !== y1 + d; y += d) {
        grid[y * 1000 + x0]++;
      }
    } else if (y0 === y1) {
      const d = Math.sign(x1 - x0);
      for (let x = x0; x !== x1 + d; x += d) {
        grid[y0 * 1000 + x]++;
      }
    }
  })
  return grid.reduce((p, d) => p + (d > 1 ? 1 : 0), 0);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
console.log('puzzle 3: ', puzzle3());
console.log('puzzle 4: ', puzzle4());
