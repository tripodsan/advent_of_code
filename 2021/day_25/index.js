import fs from 'fs';
import { Grid } from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(''));

const W = data[0].length;
const H = data.length;

function dump(grid) {
  console.log('-------------------------------')
  grid.forEach((row) => console.log(row.join('')));
}

function move(dir, dx, dy, grid) {
  const newGrid = Array.init(H, () => Array.init(W, '.'));
  let moved = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      let nx = x;
      let ny = y;
      const c = grid[y][x];
      if (c === dir) {
        nx = (nx + dx) % W;
        ny = (ny + dy) % H;
        if (grid[ny][nx] === '.') {
          moved++;
        } else {
          nx = x;
          ny = y;
        }
      }
      if (c !== '.') {
        newGrid[ny][nx] = c;
      }
    }
  }
  grid.splice(0, H, ...newGrid);
  // dump(grid);
  return moved;
}

function puzzle1() {
  let grid = data;
  // dump(grid);
  let i = 1;
  while (true) {
    let moved = 0;
    moved += move('>', 1, 0, grid);
    moved += move('v', 0, 1, grid);
    if (!moved) {
      return i;
    }
    i++;
  }
}

console.log('puzzle 1: ', puzzle1());  // 601
