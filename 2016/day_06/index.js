import fs from 'fs';
import '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line.trim().split(''));

const W = data[0].length;

function histogram() {
  const hist = [];
  for (let pos = 0; pos < W; pos ++) {
    const g = new Map();
    for (const line of data) {
      const c = line[pos];
      g.set(c, (g.get(c) || 0) + 1);
    }
    hist.push([...g.entries()].sort((e0, e1) => e1[1] - e0[1]));
  }
  return hist;
}

function puzzle1() {
  return histogram().map((h) => h[0][0]).join('');
}

function puzzle2() {
  return histogram().map((h) => h.pop()[0]).join('');
}

console.log('puzzle 1: ', puzzle1()); // qoclwvah
console.log('puzzle 2: ', puzzle2()); // ryrgviuv
