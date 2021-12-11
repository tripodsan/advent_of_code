require('../../utils.js');

const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((c, idx) => c.split(',').map((d) => parseInt(d, 10)));


// console.log(data);

const min = [Number.MAX_SAFE_INTEGER, Number.MAX_SAFE_INTEGER];
const max = [Number.MIN_SAFE_INTEGER, Number.MIN_SAFE_INTEGER];
data.forEach(([x, y]) => {
  min[0] = Math.min(min[0], x);
  min[1] = Math.min(min[1], y);
  max[0] = Math.max(max[0], x);
  max[1] = Math.max(max[1], y);
});

const W = max[0] - min[0] + 1;
const H = max[1] - min[1] + 1
const [OX, OY] = min;

function dump(grid) {
  const d = '.abcdefghijklmopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      if (c.d === 0) {
        row.push('*');
      } else {
        row.push(d[c.p + 1]);
      }
    }
    console.log(row.join(''))
  }
}

function count(grid, id) {
  let area = 0;
  for (let y = 0; y < H; y++) {
    const row = grid[y];
    for (let x = 0; x < W; x++) {
      const c = row[x];
      if (c.p === id) {
        if (x === 0 || x === W -1 || y === 0 || y === H - 1) {
          return -1;
        }
        area++;
      }
    }
  }
  return area;
}

function puzzle1() {
  const grid = Array.init(H, () => Array.init(W, () => ({ p: -1, d: Number.MAX_SAFE_INTEGER })))
  data.forEach(([px, py], idx) => {
    px -= OX;
    py -= OY;
    for (let y = 0; y < H; y++) {
      const dy = Math.abs(py - y);
      const row = grid[y];
      for (let x = 0; x < W; x++) {
        const d = Math.abs(px - x) + dy;
        const c = row[x];
        if (d < c.d) {
          c.d = d;
          c.p = idx;
        } else if (d === c.d) {
          c.p = -1;
        }
      }
    }
  });
  // dump(grid);
  let maxArea = 0;
  data.forEach(([px, py], idx) => {
    const area = count(grid, idx);
    // console.log(idx, area);
    maxArea = Math.max(maxArea, area);
  })
  return maxArea;
}

function puzzle2() {
  const grid = Array.init(H, () => Array.init(W, 0));
  data.forEach(([px, py], idx) => {
    px -= OX;
    py -= OY;
    for (let y = 0; y < H; y++) {
      const dy = Math.abs(py - y);
      const row = grid[y];
      for (let x = 0; x < W; x++) {
        const d = Math.abs(px - x) + dy;
        row[x]+= d;
      }
    }
  });

  let safe = 0;
  for (let y = 0; y < H; y++) {
    const row = grid[y];
    for (let x = 0; x < W; x++) {
      if (row[x] < 10000) {
        safe++;
      }
    }
  }
  return safe;
}

console.log('puzzle 1:', puzzle1()); // 5626
console.log('puzzle 2:', puzzle2()); // 46554


