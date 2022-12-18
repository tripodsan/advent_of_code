import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const grid = new Grid(3);

fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n')
  .map((d) => d.split(',').map((d) => parseInt(d, 10)))
  .forEach((d) => grid.put(d));

function puzzle1() {
  let s = 0;
  // summ up all the voxel sides that have no neighbouring voxel
  for (const { v } of grid.values()) {
    s += grid.numNeighbours(v, (c) => !c);
  }
  return s;
}

function puzzle2() {
  // get the surface area
  let total = puzzle1();

  // expand the bounding cube to allow fill into concave indents
  for (let i = 0; i < 3; i++) {
    grid.min[i]--;
    grid.max[i]++;
  }

  // fill the grid from the outside, leaving only enclosed pockets
  grid.fill(grid.min);

  // subtract the number of neighbours of empty voxels
  for (const v of grid.scan()) {
    if (!grid.get(v)) {
      total -= grid.numNeighbours(v)
    }
  }

  return total;
}

console.log('puzzle 1 : ', puzzle1()); // 4340
console.log('puzzle 2 : ', puzzle2()); // 2468
