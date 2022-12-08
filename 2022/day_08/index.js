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
  const height = data[y][x];
  let score = 1;
  let visible = false;
  for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
    let s = 0;
    let v = true;
    for (let xx = x + dx, yy = y + dy; v && xx >= 0 && xx < W && yy >= 0 && yy < H; xx += dx, yy += dy) {
      s += 1;
      if (data[yy][xx] >= height) {
        v = false;
      }
    }
    score *= s ? s : 1;
    visible |= v;
  }
  return [score, visible];
}

function run() {
  let s = 0;
  let v = 0;
  for (let y = 0; y < H; y += 1) {
    for (let x = 0; x < W; x += 1) {
      const [score, visible] = calc(x, y);
      s = Math.max(s, score);
      if (visible) {
        v += 1;
      }
    }
  }
  console.log('puzzle 1 : ', v); // 1733
  console.log('puzzle 2 : ', s); // 284648
}

run();
