import { Grid } from '../../utils.js';
import fs from 'fs';

function init() {
  const data = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s);

  const lut = data.shift().split('').map((c) => c === '#' ? 1 : 0);
  const grid = new Grid();

  data.forEach((line, y) => {
    line.split('').forEach((c, x) => {
      grid.put([x,y], { c: c === '#' ? 1 : 0 })
    });
  });

  return {
    grid,
    lut,
    empty: { c: 0 },
  }
}

function conv(grid, x, y, def) {
  let s = 0;
  for (let dy = -1; dy < 2; dy++) {
    for (let dx = -1; dx < 2; dx++) {
      const { c } = grid.get([x + dx, y + dy]) ?? def;
      s = (s << 1) + c;
    }
  }
  return s;
}


function enhance(info) {
  const { grid, lut, empty } = info;
  const newGrid = new Grid();
  const [minX, minY] = grid.min;
  const [maxX, maxY] = grid.max;
  for (let y = minY - 1; y <= maxY + 1; y++) {
    for (let x = minX - 1; x <= maxX + 1; x++) {
      const s = conv(grid, x, y, empty);
      newGrid.put([x, y], { c: lut[s] })
    }
  }
  empty.c = lut[empty.c * 511];
  info.grid = newGrid;
}

function dump(info) {
  console.log(info.grid.min, info.grid.max, 'void: ', info.empty.c);
  info.grid.dump(undefined, ({ c }) => c ? '#' : '.');
}

function solve(iter) {
  const info = init();
  // dump(info);
  while (iter--) {
    enhance(info);
    // dump(info);
  }
  return info.grid.values().reduce((p, { c }) => p + c, 0);
}

console.log('puzzle 1:', solve(2));
console.log('puzzle 2:', solve(50));
