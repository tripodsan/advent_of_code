import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';


const START = [0,0];
const END = [70, 70];
const SIM = 1024;
// const END = [6, 6];
// const SIM = 12;
const MX = END[0] + 1;
const MY = END[1] + 1;

function init() {
  const bytes = fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((c) => c.trim().split(',').map((v) => parseInt(v, 10)));

  const grid = new Grid(2);
  for (let y = 0; y < MY; y++) {
    for (let x = 0; x < MX; x++) {
      grid.put([x,y], '.');
    }
  }
  return {
    grid,
    bytes,
  }
}

function dump(grid, p) {
  const path = new Set(p);
  grid.dump(null, (c) => {
    return path.has(c)
      ? chalk.bold('O')
      : chalk.grey(c.c);
  });
}

function get_path(grid, start, end) {
  return grid.aStar(start, end,(c, n) => ((grid.inside(n.v) && n.c !== '#') ? 1: -1));
}


function puzzle1() {
  const { grid, bytes } = init();
  for (let i = 0; i < SIM; i += 1) {
    grid.put(bytes[i], '#');
  }
  // grid.dump();
  const path = get_path(grid, START, END);
  dump(grid, path);
  return path.length - 1;
}

function puzzle2() {
  const { grid, bytes } = init();
  for (let i = 0; i < SIM; i += 1) {
    grid.put(bytes[i], '#');
  }
  let path = get_path(grid, START, END);
  for (let i = SIM; i < bytes.length; i++) {
    const byte = bytes[i];
    const cell = grid.get(byte);
    cell.c = '#';
    if (path.includes(cell)) {
      // byte fell on path, need to find a new one
      const newPath = get_path(grid, START, END);
      if (newPath.length === 0) {
        dump(grid, path);
        return byte;
      }
      path = newPath;
    }
  }
  return [];

}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());
