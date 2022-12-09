import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';

const DIR = {
  L: [-1, 0],
  U: [0, -1],
  R: [1, 0],
  D: [0, 1],
};

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((l) => l.split(' '))
  .map(([r, l]) => [DIR[r], parseInt(l, 10)]);

// console.log(data);

function drag(h, t) {
  const dx = h[0] - t[0];
  const dy = h[1] - t[1];
  if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
    vec2.add(t, t, [Math.sign(dx), Math.sign(dy)]);
  }
}

function calc(num) {
  const g = new Grid();
  g.put([0, 0]);
  const r = Array.init(num, () => ([0, 0]));
  for (const [d, l] of data) {
    for (let i = 0; i < l; i += 1) {
      vec2.add(r[0], r[0], d);
      for (let j = 1; j < num; j+= 1) {
        drag(r[j-1], r[j])
      }
      g.put(r[num-1]);
    }
  }
  // g.dump()
  return g.size();
}

console.log('puzzle 1 : ', calc(2));
console.log('puzzle 2 : ', calc(10));
