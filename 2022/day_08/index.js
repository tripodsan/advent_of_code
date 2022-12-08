import fs from 'fs';
import * as utils from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((l) => l.split('').map((c) => parseInt(c, 10)));

const W = data.length;
const H = data[0].length;

// console.log(W, H)

function calc(x, y) {
  const h = data[y][x];
  let ss = 1;
  let vv = false;
  let s = 0;
  let v = true;

  const visit = (height) => {
    s += 1;
    if (height >= h) {
      v = false;
    }
  }

  // scan to the left
  for (let xx = x - 1; v && xx >= 0; xx -= 1) {
    visit(data[y][xx]);
  }
  ss *= s ? s : 1;
  vv |= v;

  // scan to the right
  s = 0;
  v = true;
  for (let xx = x + 1; v && xx < W; xx += 1) {
    visit(data[y][xx]);
  }
  ss *= s ? s : 1;
  vv |= v;

  // scan to the top
  s = 0;
  v = true;
  for (let yy = y - 1; v && yy >= 0; yy -= 1) {
    visit(data[yy][x]);
  }
  ss *= s ? s : 1;
  vv |= v;

  // scan to the bottom
  s = 0;
  v = true;
  for (let yy = y + 1; v && yy < H; yy += 1) {
    visit(data[yy][x]);
  }
  ss *= s ? s : 1;
  vv |= v;

  return [ss, vv];
}

function run() {
  let s = 0;
  let v = 0;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const [sc, visible] = calc(x, y);
      s = Math.max(s, sc);
      if (visible) {
        v += 1;
      }
    }
  }
  console.log('puzzle 1 : ', v); // 1733
  console.log('puzzle 2 : ', s); // 284648
}

run();
