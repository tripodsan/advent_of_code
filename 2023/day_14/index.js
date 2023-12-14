import fs from 'fs';
import { Grid } from '../../Grid.js';

const X = 0;
const Y = 1;
const rocks = [];
const rocks_by = [{}, {}];

function insert(x, y, c) {
  const rock = {p:[x,y], c};
  (rocks_by[X][x] = rocks_by[X][x] ?? []).push(rock);
  (rocks_by[Y][y] = rocks_by[Y][y] ?? []).push(rock);
  if (!c) {
    rocks.push(rock);
  }
}

let max_x = 0;
let max_y = 0;

fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .forEach((row, y)=> {
    row.split('').forEach((c, x) => {
      max_x = Math.max(x + 2, max_x);
      if (c !== '.') {
        insert(x + 1, y + 1, c === '#');
      }
    });
    insert(0, y + 1, true);
    insert(max_x, y + 1, true);
    max_y = y + 2;
  });
for (let x = 0; x <= max_x; x++) {
  insert(x, 0, true);
  insert(x, max_y, true);
}

Object.values(rocks_by[X]).forEach((rocks) => rocks.sort((r0, r1) => r0.p[Y] - r1.p[Y]));
Object.values(rocks_by[Y]).forEach((rocks) => rocks.sort((r0, r1) => r0.p[X] - r1.p[X]));

function move(a, r, d) {
  const old_col = rocks_by[a][r.p[a]];
  let idx = old_col.indexOf(r);
  old_col.splice(idx, 1);
  r.p[a] = d;
  const new_row = rocks_by[a][d];
  new_row.push(r);
  // we resort all rocks later
}

function dump() {
  for (let y = 0; y <= max_y; y++) {
    let line = Array.init(max_x, '.');
    for (const r of rocks_by[Y][y]) {
      line[r.p[X]] = r.c ? '#' : 'O';
    }
    console.log(line.join(''));
  }
}

// dump();

function tilt(a, d) {
  // for each column, move the rocks to the north or south
  const aa = 1-a;
  for (const col of Object.values(rocks_by[aa])) {
    if (d > 0) {
      for (let i = col.length - 1; i > 0; i--) {
        const r = col[i];
        if (!r.c) {
          move(a, r, col[i + 1].p[a] - 1);
        }
      }
    } else {
      for (let i = 0; i < col.length; i++) {
        const r = col[i];
        if (!r.c) {
          move(a, r, col[i - 1].p[a] + 1);
        }
      }
    }
  }
  Object.values(rocks_by[a]).forEach((rocks) => rocks.sort((r0, r1) => r0.p[aa] - r1.p[aa]));
}


function find_cycle(hist, idx, num) {
  // find if the P last elements already occur in the history
  for (let p = 5; p < hist.length / 2; p++) {
    const start = hist.length - 2*p;
    const end = hist.length - p;
    let found = true;
    for (let i = 0; i < p; i++) {
      if (hist[start + i] !== hist[end + i]) {
        found = false;
        break;
      }
    }
    if (found) {
      return {
        idx: start,
        len: p,
      }
    }
  }
  return null;
}

function run() {
  const history = [];
  const numIter = 1_000_000_000;
  // const numIter = 122;
  for (let i = 0; i < numIter; i++) {
    tilt(1, -1);
    if (i === 1) {
      const sum = rocks.reduce((acc, r) => acc + max_y - r.p[1], 0);
      console.log('puzzle 1: ', sum);
    }
    tilt(0, -1);
    tilt(1, 1);
    tilt(0,1);
    const sum = rocks.reduce((acc, r) => acc + max_y - r.p[1], 0);
    history.push(sum);
    if ( i > 100) {
      const cycle = find_cycle(history, i, sum);
      if (cycle) {
        const idx = (numIter - i) % cycle.len;
        console.log('puzzle 2: ', history[cycle.idx + idx - 2]);
        return
      }
    }
    // dump();
  }
}

// 109230
// 94876
run();
