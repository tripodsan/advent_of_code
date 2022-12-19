import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';
import { Heap } from 'heap-js';

const TYPES = ['.', '=', '|'];

// const DEPTH = 510;
// const TARGET = [10, 10];

const DEPTH = 8787;
const TARGET = [10,725];


function create(i) {
  // A region's erosion level is its geologic index plus the cave system's depth, all modulo 20183.
  const e = (i + DEPTH) % 20183;
  return {
    i,
    e,
    // If the erosion level modulo 3 is 0, the region's type is rocky.
    // If the erosion level modulo 3 is 1, the region's type is wet.
    // If the erosion level modulo 3 is 2, the region's type is narrow.
    r: e % 3,
  };
}

function getRegion(grid, v) {
  const cell = grid.get(v);
  if (cell) {
    return cell;
  }
  const [x, y] = v;
  // If the region's Y coordinate is 0, the geologic index is its X coordinate times 16807.
  if (y === 0) {
    return grid.put(v, create(x * 16807));
  }
  // If the region's X coordinate is 0, the geologic index is its Y coordinate times 48271.
  if (x === 0) {
    return grid.put(v, create(y * 48271));
  }
  // Otherwise, the region's geologic index is the result of multiplying the erosion levels of the regions at X-1,Y and X,Y-1.
  const { e: e0 } = getRegion(grid, [x - 1, y]);
  const { e: e1 } = getRegion(grid, [x, y - 1]);
  return grid.put(v, create(e0 * e1));
}

function init() {
  const grid = new Grid();
  // The region at 0,0 (the mouth of the cave) has a geologic index of 0.
  grid.put([0 ,0], create(0));

  // populate
  getRegion(grid, TARGET);

  // The region at the coordinates of the target has a geologic index of 0.
  grid.put(TARGET, create(0));

  return grid;
}

function puzzle1() {
  const grid = init();
  grid.dump(null, (c) => c ? TYPES[c.r] : '?');
  let risk = 0;
  for (const { r } of grid.values()) {
    risk += r;
  }
  return risk;
}

function puzzle2() {
  const NOTHING = 1;
  const TORCH = 2;
  const GEAR = 4;

  const TRANS = [
    // In rocky regions, you can use the climbing gear or the torch. You cannot use neither (you'll likely slip and fall).
    TORCH | GEAR,
    // In wet regions, you can use the climbing gear or neither tool. You cannot use the torch (if it gets wet, you won't have a light source).
    NOTHING | GEAR,
    // In narrow regions, you can use the torch or neither tool. You cannot use the climbing gear (it's too bulky to fit).
    NOTHING | TORCH,
  ]
  const grid = init();

  /**
   * @typedef State
   * @property {Array} cell
   * @property {number} tool
   * @property {number} time
   */

  const visited = new Map();
  const q = new Heap((e0, e1) => e0.time - e1.time);

  const start = grid.get([0,0]);
  const end = grid.get(TARGET);
  visited.set(start, 0);
  q.add({
    cell: start,
    tool: TORCH,
    time: 0,
  });

  let iter = 0;
  let bestTime = Number.MAX_SAFE_INTEGER;
  while (q.size()) {
    const { cell, tool, time } = q.pop();
    if (iter++ % 10000 === 0) {
      console.log(time, visited.size, q.size(), cell.v, bestTime);
    }
    const timeP = time + 1;
    if (timeP >= bestTime) {
      continue;
    }
    for (const v of grid.neighboursV(cell.v)) {
      if (v[0] >=0 && v[1] >= 0) {
        const n = getRegion(grid, v);
        if (n === end) {
          bestTime = Math.min(bestTime, tool === TORCH ? timeP : timeP + 7);
          continue;
        }
        const key = [tool, ...v].join(':');
        let lv = visited.get(key) ?? Number.MAX_SAFE_INTEGER;
        if (timeP >= lv) {
          continue;
        }
        // check if we can enter the next region w/o switching
        if ((TRANS[n.r] & tool) !== 0) {
          visited.set(key, timeP);
          q.add({
            cell: n,
            tool,
            time: timeP,
          });
        // check if we can switch to a tool allowed in this and the next region
        } else {
          const toolP = TRANS[cell.r] & TRANS[n.r];
          if (toolP) {
            const keyP = [toolP, ...cell.v].join(':');
            lv = visited.get(keyP) ?? Number.MAX_SAFE_INTEGER;
            const tp = time + 7;
            if (tp < lv) {
              visited.set(keyP, tp);
              q.add({
                cell,
                tool: toolP,
                time: tp,
              });
            }
          }
        }
      }
    }
  }
  return bestTime;
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2()); // 990 ..... 997
