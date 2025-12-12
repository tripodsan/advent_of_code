import fs from 'fs';
import { Heap } from 'heap-js';
import {Grid} from "../../Grid.js";


const shapes = [];
const regions = [];
const chunks = fs.readFileSync('./input.txt', 'utf-8').split('\n\n');
for (const ch of chunks) {
  if (ch.indexOf('#') > 0) {
    const lines = ch.split('\n');
    lines.shift();
    const grid = new Grid().init(lines.join('\n'), (x,y,c) => c === '#' ? '#' : '');
    shapes.push({
      size: grid.values().length,
      grid,
    });
    grid.dump()
    console.log(grid.values().length)
  } else {
    const lines = ch.split('\n');
    lines.filter((c) => !!c).forEach((line) => {
      // 4x4: 0 0 0 0 2 0
      const n = line.split(/[x: ]+/).map((c) => Number.parseInt(c, 10));
      const w = n.shift();
      const h = n.shift();
      regions.push({
        w,
        h,
        p: n,
      })
    })
  }
}

function puzzle1() {
  let ok = 0;
  for (const r of regions) {
    // calculate min size
    const min = r.p.reduce((acc, v, idx) => acc + v * shapes[idx].size, 0);
    if (min > r.w*r.h) {
      // console.log('too small:', r, r.w*r.h, min);
    } else {
      ok += 1;
    }
  }
  return ok;
}

console.log('num regions:',regions.length);


console.log('puzzle 1: ', puzzle1());

// console.log('puzzle 2: ', puzzle2('./input_test2.txt'));
// console.log('puzzle 2: ', puzzle2('./input.txt'));
