import fs from 'fs';
import { Grid } from '../../MapGrid.js';

const RE = /\/dev\/grid\/node-x(\d+)-y(\d+)/;

// root@ebhq-gridcenter# df -h
// Filesystem              Size  Used  Avail  Use%
// /dev/grid/node-x0-y0     92T   73T    19T   79%
const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');

function parse() {
  const g = new Grid();
  for (const line of data) {
    const a = line.split(/\s+/);
    let [,x,y] = a[0].match(RE);
    const v = [parseInt(x, 10), parseInt(y, 10)];
    g.put(v, {
      size: parseInt(a[1]),
      used: parseInt(a[2]),
      avail: parseInt(a[3]),
    });
  }
  return g;
}

function puzzle1() {
  const g = parse();
  const nodes = g.values();
  let pairs = 0;
  for (let i = 0; i < nodes.length; i++) {
    const n0 = nodes[i];
    if (n0.used === 0) {
      continue;
    }
    for (let j = 0; j < nodes.length; j++) {
      const n1 = nodes[j];
      if (n0.used <= n1.avail) {
        pairs++;
      }
    }
  }
  return pairs;
}

function dump(g, pos, avail) {
  g.dump(pos, (c) => {
    if (c.used === 0) {
      return '-';
    }
    if (c.used <= avail) {
      return '.';
    }
    return '#';
  })
}

function puzzle2() {
  const g = parse();
  let minUsed = Number.MAX_SAFE_INTEGER;
  let empty;
  for (const c of g.values()) {
    if (c.used) {
      minUsed = Math.min(minUsed, c.used);
    } else {
      empty = c;
      console.log(c);
    }
  }
  const xx = g.max[0];
  let steps = 0;
  let [x,y] = empty.v;
  const move = (xx, yy) => {
    steps += Math.abs(xx) + Math.abs(yy);
    x += xx;
    y += yy;
  }
  // go left
  move(-x, 0);
  // go all the way up
  move(0, -y);
  // go one before the target data
  move(xx - 1, 0);
  dump(g, [x, y], empty.avail);

  // swap and move around until target node is at [1,0], plus one last swap
  const swaps = 5 * (xx - 1) + 1;
  return steps + swaps;
}

console.log('puzzle 1: ', puzzle1()); // 1020
console.log('puzzle 2: ', puzzle2()); // 198
