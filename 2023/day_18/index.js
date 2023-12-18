import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';

const DIRS = [
  [1, 0],  // 0: >
  [0, 1],  // 1: v
  [-1, 0], // 2: <
  [0, -1], // 3: ^
];

const DIR_MAP = {
  'R':  0,
  'D': 1,
  'L': 2,
  'U': 3,
};

function parse(fn) {
  return fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((line)=> {
      const [d, l, c] = line.split(/[ (#)]+/);
      return fn(d, l, c);
    });
}

function solve_fill(data) {
  const grid = new Grid(2);
  const pos = [0, 0];
  grid.put(pos);
  for (const { d, l } of data) {
    const dir = DIRS[d];
    for (let i = 0; i < l; i++) {
      vec2.add(pos, pos, dir);
      grid.put(pos);
    }
  }
  // grid.dump();
  // get top left
  const top_left = [grid.max[0], grid.min[1]];
  for (const c of grid.values()) {
    if (c.v[1] === top_left[1]) {
      top_left[0] = Math.min(top_left[0], c.v[0]);
    }
  }
  top_left[0]++;
  top_left[1]++;
  grid.fill(top_left);
  return grid.size();
}

const CORNERS = [
  [0,0], // 0
  [1,0], // 1
  [1,1], // 2
  [0,1], // 3
];

function solve_alg(data, debug) {
  const pos = [0, 0];
  const points = [];
  const p = [0,0];
  const grid = new Grid(2);
  let corner = 0;
  let len = data.length;
  for (let i = 0; i < len; i++) {

    const { d, l } = data[i];
    const dir = DIRS[d];
    // move to next point
    vec2.add(pos, pos, vec2.scale([0, 0], dir, l));

    // paint grid
    if (debug) {
      const DIR_CHARS = ['▄', '▌', '▀', '▐'];
      for (let i = 0; i < l; i++) {
        vec2.add(p, p,dir);
        grid.put(p, { c: DIR_CHARS[d] })
      }
    }

    // paint corner
    const nd = data[(i + 1) % len].d;
    const old_corner = corner;

    if (debug) {
      if (d === 0 && nd === 1) {
        corner = 1;
        grid.put(p, { c: '▖' })
      } else if (d === 1 && nd === 2) {
        corner = 2;
        grid.put(p, { c: '▘' })
      } else if (d === 2 && nd === 3) {
        corner = 3;
        grid.put(p, { c: '▝' })
      } else if (d === 3 && nd === 0) {
        corner = 0;
        grid.put(p, { c: '▗' })

      } else if (d === 0 && nd === 3) {
        corner = 0;
        grid.put(p, { c: '▟' })
      } else if (d === 3 && nd === 2) {
        corner = 3;
        grid.put(p, { c: '▜' })
      } else if (d === 2 && nd === 1) {
        corner = 2;
        grid.put(p, { c: '▛' })
      } else if (d === 1 && nd === 0) {
        corner = 1;
        grid.put(p, { c: '▙' })
      }
    }
    if ((nd + 4 - d) % 4  === 1) {
      // right hand turn
      corner = nd;
    } else {
      // left hand turn
      corner = d;
    }
    const corner_delta = vec2.sub([0, 0], CORNERS[corner], CORNERS[old_corner]);
    vec2.add(pos, pos, corner_delta);

    points.push([...pos]);
  }

  if (debug) {
    grid.dump(undefined, (c) => c ? c.c : '.');
  }
  len = points.length;
  return points.reduce((acc, p, i) => acc + p[1] * ([points[(i - 1 + len) % len][0] - points[(i + 1) % len][0]]), 0) / 2;
}

function puzzle1() {
  const data = parse((d, l, c) => ({
    d: DIR_MAP[d],
    l: Number.parseInt(l, 10),
  }));

  return solve_alg(data, false);
  // return solve_fill(data);
}

function puzzle2() {
  const data = parse((d, l, c) => ({
    d: Number.parseInt(c.substring(5), 10),
    l: Number.parseInt(c.substring(0, 5), 16),
  }));
  // console.log(data);
  return solve_alg(data);
}

console.log('puzzle 1:', puzzle1()); // 48652
console.log('puzzle 2:', puzzle2());
