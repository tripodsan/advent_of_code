import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n').map(((l) => JSON.parse(`[${l}]`)));

// console.log(data);

function visit(visited, p) {
  visited.add(p);
  for (const n of p.n) {
    if (!visited.has(n)) {
      visit(visited, n);
    }
  }
}

function puzzle1() {
  // create a graph will all points and join them
  const points = data.map((v, idx) => ({
    idx,
    v,
    n: [],
  }));
  for (let i = 0; i < points.length; i++) {
    const p0 = points[i];
    const v0 = p0.v;
    for (let j = i + 1; j < points.length; j++) {
      const p1 = points[j];
      const v1 = p1.v;
      const d = Math.abs(v0[0] - v1[0]) + Math.abs(v0[1] - v1[1]) + Math.abs(v0[2] - v1[2]) + Math.abs(v0[3] - v1[3]);
      if (d <= 3) {
        p0.n.push(p1);
        p1.n.push(p0);
      }
    }
  }

  // console.log(points);

  // count the constellations
  const visited = new Set();
  let num = 0;
  for (const p of points) {
    if (!visited.has(p)) {
      num += 1;
      visit(visited, p);
    }
  }
  return num;
}

function puzzle2() {
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());
