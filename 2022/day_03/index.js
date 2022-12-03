import fs from 'fs';
import * as utils from '../../utils.js';


const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(''));


function priority(c) {
  c = c.charCodeAt(0);
  return c >= 97 ? c - 96 : c - 64 + 26;
}

function puzzle2() {
  let sum = 0;
  for (let i = 0; i < data.length; i += 3) {
    const s0 = new Set(data[i]).intersect(new Set(data[i + 1])).intersect(new Set(data[i + 2]));
    sum += priority(s0.first())
  }
  return sum;
}


function puzzle1() {
  let sum = 0;
  for (const cfg of data) {
    const s0 = new Set(cfg.slice(0, cfg.length / 2)).intersect(new Set(cfg.slice(cfg.length / 2)));
    sum += priority(s0.first())
  }
  return sum;
}

console.log('puzzle 1 : ', puzzle1()); // 8493
console.log('puzzle 2 : ', puzzle2()); // 2552
