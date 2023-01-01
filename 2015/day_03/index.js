import fs from 'fs';
import { Grid } from '../../MapGrid.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('');

// console.log(data);

const DIRS = {
  '^': [0, -1],
  'v': [0, 1],
  '<': [-1, 0],
  '>': [1, 0],
}

function move(g, v, c) {
  const d = DIRS[c];
  if (d) {
    v[0]+= d[0];
    v[1]+= d[1];
    g.getOrSet(v, () => { p: 1}, (c) => c.p++);
  }
}

function puzzle2() {
  const g = new Grid();
  let v0 = [0,0];
  let v1 = [0,0];
  g.put(v0, { p: 2 });
  for (let i = 0; i < data.length; i += 2) {
    move(g, v0, data[i]);
    move(g, v1, data[i + 1]);
  }
  // g.dump();
  return g.size();
}

function puzzle1() {
  const g = new Grid();
  let v = [0,0];
  g.put(v, { p: 1 });
  for (const c of data) {
    move(g, v, c);
  }
  // g.dump();
  return g.size();
}

console.log('puzzle 1: ', puzzle1()); // 2592
console.log('puzzle 2: ', puzzle2()); // 2360
