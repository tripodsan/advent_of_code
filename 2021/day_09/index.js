require('../utils.js');
const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) =>
    s.split('')
      .map((c) => c.trim())
      .map((c) => parseInt(c, 10))
  );

data.forEach((m) => {
  m.push(10);
  m.unshift(10);
})
const W = data[0].length;
data.unshift(new Array(W).fill(10));
data.push(new Array(W).fill(10));
const H = data.length;
// console.log(data);

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function puzzle1() {
  let risk = 0;
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const c = data[y][x];
      let s = 0;
      for (const d of DIRS) {
        const n = data[y + d[1]][x + d[0]];
        s += Math.sign(n - c);
      }
      if (s === 4) {
        risk += c + 1;
      }
    }
  }
  return risk;
}

function fill(x, y) {
  if (data[y][x] >= 9) {
    return 0;
  }
  data[y][x] = 9;
  return DIRS.reduce((s, [dx, dy]) => s + fill(x + dx, y + dy), 1)
}

function puzzle2() {
  const minima = [];
  for (let y = 1; y < H - 1; y++) {
    for (let x = 1; x < W - 1; x++) {
      const c = data[y][x];
      let s = 0;
      for (const d of DIRS) {
        const n = data[y + d[1]][x + d[0]];
        s += Math.sign(n - c);
      }
      if (s === 4) {
        minima.push([x, y]);
      }
    }
  }

  const sizes = [];
  for (const min of minima) {
    sizes.push(fill(min[0], min[1]));
  }
  sizes.sort((n0, n1) => n1 - n0);
  return sizes[0] * sizes[1] * sizes[2];
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
