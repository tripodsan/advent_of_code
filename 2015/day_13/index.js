import fs from 'fs';
import '../../utils.js';
import { permutations } from '../../utils.js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');

const RE = /(\w+) would (gain|lose) (\d+) happiness units by sitting next to (\w+)./;

// console.log(data);

function distanceMap() {
  const dist = new Map();

  const update = (k0, k1, d) => {
    const edge = dist.getOrSet(k0, () => new Map());
    edge.set(k1, (edge.get(k1) ?? 0) + d);
  }

  for (const line of data) {
    const m = line.match(RE);
    if (!m) {
      throw Error();
    }
    let d = parseInt(m[3], 10);
    if (m[2] === 'lose') {
      d *= -1;
    }
    update(m[1], m[4], d);
    update(m[4], m[1], d);
  }
  return dist;
}

function brute(dist) {
  const keys = [...dist.keys()];
  let best = 0;
  for (const path of permutations(keys)) {
    let prev;
    let first;
    let sum = 0;
    for (const location of path) {
      if (!first) {
        first = location;
      }
      if (prev) {
        sum += dist.get(prev).get(location);
      }
      prev = location;
    }
    sum += dist.get(prev).get(first);
    best = Math.max(best, sum);
  }
  return best;
}

function puzzle1() {
  return brute(distanceMap());
}

function puzzle2() {
  const dist = distanceMap();
  const me = new Map();
  for (const [k, v] of dist.entries()) {
    v.set('me', 0);
    me.set(k, 0);
  }
  dist.set('me', me);
  return brute(dist);
}

console.log('puzzle 1: ', puzzle1()); // 664
console.log('puzzle 2: ', puzzle2()); // 640
