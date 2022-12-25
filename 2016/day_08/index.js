import fs from 'fs';
import { ocr } from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');

const RE_RECT = /rect (\d+)x(\d+)/;
const RE_ROT_ROW = /rotate row y=(\d+) by (\d+)/;
const RE_ROT_COL = /rotate column x=(\d+) by (\d+)/;
const W = 50;
const H = 6;

function dump(g) {
  console.log('---------------------------');
  g.forEach((l) => console.log(l.join('')));
}


function parse() {
  const g = Array.init(H, () => Array.init(W, '.'));
  for (const line of data) {
    let m = line.match(RE_RECT);
    if (m) {
      for (let y = 0; y < parseInt(m[2], 10); y++) {
        for (let x = 0; x < parseInt(m[1], 10); x++) {
          g[y][x] = '#';
        }
      }
      continue;
    }
    m = line.match(RE_ROT_ROW);
    if (m) {
      const row = g[parseInt(m[1], 10)];
      let n = parseInt(m[2], 10);
      while (n--) {
        row.unshift(row.pop());
      }
      continue;
    }
    m = line.match(RE_ROT_COL);
    if (m) {
      const x = parseInt(m[1], 10);
      let n = parseInt(m[2], 10);
      while (n--) {
        const l = g[H-1][x];
        for (let y = H-1; y > 0; y--) {
          g[y][x] = g[y-1][x];
        }
        g[0][x] = l;
      }
      continue;
    }
    throw Error('syntax error: ' + line);
  }
  return g;
}

function puzzle1() {
  const g = parse();
  let s = 0;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (g[y][x] === '#') {
        s++;
      }
    }
  }
  return s;
}

function puzzle2() {
  return ocr(parse());
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
