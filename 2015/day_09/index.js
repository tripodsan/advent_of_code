import fs from 'fs';
import '../../utils.js';
import { permutations } from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n').map((line) => line.split(/\s+/));

// console.log(data);

function distanceMap() {
  const dist = new Map();
  for (const [from,,to,,d] of data) {
    const dd = parseInt(d, 10);
    const src = dist.getOrSet(from, () => new Map());
    src.set(to, dd);
    const dst = dist.getOrSet(to, () => new Map());
    dst.set(from, dd);
  }
  return dist;
}

function brute(dist, max) {
  const keys = [...dist.keys()];
  let best = max ? 0 : Number.MAX_SAFE_INTEGER;
  for (const path of permutations(keys)) {
    let prev;
    let sum = 0;
    for (const location of path) {
      if (prev) {
        sum += dist.get(prev).get(location);
      }
      prev = location;
    }
    best = max
      ? Math.max(best, sum)
      : Math.min(best, sum);
  }
  return best;
}

function puzzle1() {
  return brute(distanceMap());
}

function puzzle2() {
  return brute(distanceMap(), true);
}

console.log('puzzle 1: ', puzzle1()); // 251
console.log('puzzle 2: ', puzzle2()); // 898
