import fs from 'fs';
import '../../utils.js';

const TEST = false;

const N = TEST ? 4 : 100;

const data = fs.readFileSync(TEST ? './input_test.txt': './input.txt', 'utf-8')
  .trim()
  .split('\n').map((d) => d.split(''));

const W = data[0].length;
const H = data.length;

function dump(g) {
  console.log('------------------------')
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      row.push(g[y * W + x] ? '#' : '.');
    }
    console.log(row.join(''));
  }
}

function parse() {
  const grid = new Array(W*H).fill(0);
  for (let y = 0; y < H; y++) {
    const row = data[y];
    for (let x = 0; x < W; x++) {
      if (row[x] === '#') {
        grid[y * W + x] = 1;
      }
    }
  }
  return grid;
}

const DIRS = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
];

function step(g0) {
  const g1 = new Array(g0.length);
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let n = 0;
      for (const [dx, dy] of DIRS) {
        const xx = x + dx;
        const yy = y + dy;
        if (xx >= 0 && xx < W && yy >= 0 && yy < H && g0[yy * W + xx]) {
          n++;
        }
      }
      // A light which is on stays on when 2 or 3 neighbors are on, and turns off otherwise.
      // A light which is off turns on if exactly 3 neighbors are on, and stays off otherwise.
      let c = g0[y * W + x];
      if (c) {
        if (n !== 2 && n !== 3) {
          c = 0;
        }
      } else {
        if (n === 3) {
          c = 1;
        }
      }
      g1[y * W + x] = c;
    }
  }
  return g1;
}

function puzzle1() {
  let g0 = parse();
  // dump(g0);
  for (let i = 0; i < N; i++) {
    g0 = step(g0);
  }
  return g0.sum();
}

function lightCorners(g0) {
  g0[0] = 1;
  g0[W - 1] = 1;
  g0[H*W - 1] = 1;
  g0[(H -1)* W] = 1;
}

function puzzle2() {
  let g0 = parse();
  lightCorners(g0);
  for (let i = 0; i < N; i++) {
    g0 = step(g0);
    lightCorners(g0);
  }
  return g0.sum();

}

console.log('puzzle 1: ', puzzle1()); // 768
console.log('puzzle 2: ', puzzle2()); // 781
