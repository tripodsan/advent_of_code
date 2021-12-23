import * as utils from '../../utils.js';
import fs from 'fs';


function init() {
  const data = fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((s) => s.trim())
    .filter((s) => !!s)
    .map((s) => s.split('')
      .filter((c) => c === '#' || c === '.')
      .map((c) => c === '#' ? 1 : 0)
    );

  const grid = data.shift();
  const rules = new Array(32).fill(0);
  data.forEach((line) => {
    const next = line.pop();
    const num = Number.parseInt(line.join(''), 2);
    rules[num] = next;
  });
  return {
    grid,
    rules,
  }
}

function puzzle1(num) {
  let { grid, rules } = init();
  let offset = 0;
  let iter = 0
  let prev = 0;
  while (true) {
    const newGrid = new Array(grid.length + 8).fill(0);
    offset -= 5;
    let v = 0;
    for (let i = 0; i < newGrid.length; i++) {
      v = ((v << 1) & 31) + (grid[i - 3] ?? 0)
      newGrid[i] = rules[v];
    }
    const i0 = newGrid.indexOf(1);
    const i1 = newGrid.lastIndexOf(1);
    grid = newGrid.slice(i0, i1 + 1);
    offset += i0;


    // if (iter % 100000 === 0) {
    //   console.log(iter, offset, grid.length);
    // }
    const ones = grid.sum();
    const sum =  grid.reduce((s, c, idx) => s + c * idx, 0)
    const total = sum + offset*ones;
    // console.log(iter, ones, sum, total, total - prev);

    // console.log(`${'.'.repeat(20+offset)}${grid.map((c) => ['.', '#'][c]).join('')}`, ones, sum, sum + offset*ones);
    if (++iter === num) {
      return [ones, sum, total, total - prev]
    }
    prev = total;
  }
}

function puzzle2() {
  const [ones, sum, total, delta] = puzzle1(1000);
  return total + (50000000000 - 1000) * delta;
}


console.log('puzzle 1:', puzzle1(20)[2])
console.log('puzzle 2:', puzzle2());
