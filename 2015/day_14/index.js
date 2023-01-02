import fs from 'fs';
import '../../utils.js';

const TEST = false;

const N = TEST ? 1000 : 2503;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim()
  .split('\n');

const RE = /(\w+) can fly (\d+) km\/s for (\d+) seconds, but then must rest for (\d+) seconds./;

function parse() {
  const d = [];
  for (const line of data) {
    const m = line.match(RE);
    if (!m) {
      throw Error();
    }
    d.push({
      name: m[1],
      speed: parseInt(m[2]),
      fly: parseInt(m[3]),
      rest: parseInt(m[4]),
      period: parseInt(m[3]) + parseInt(m[4]),
      dist: 0,
      points: 0,
    });
  }
  return d;
}


function puzzle1() {
  const d = parse();
  let best = 0;
  for (const deer of d) {
    const p = deer.period;
    let flyTime = Math.floor(N / p) * deer.fly; // full cycles
    const r = N % p; // remainder
    flyTime += Math.min(r, deer.fly);
    const dist = flyTime * deer.speed;
    best = Math.max(best, dist);
  }
  return best;
}

function puzzle2() {
  const d = parse();
  for (let t = 0; t < N; t++) {
    for (const deer of d) {
      const tt = t % deer.period;
      if (tt < deer.fly) {
        deer.dist += deer.speed;
      }
    }
    d.sort((d0, d1) => d1.dist - d0.dist);
    const leedDist = d[0].dist;
    for (const deer of d) {
      if (deer.dist === leedDist) {
        deer.points++;
      } else {
        break;
      }
    }
  }
  d.sort((d0, d1) => d1.points - d0.points);
  return d[0].points;
}

console.log('puzzle 1: ', puzzle1()); // 2660
console.log('puzzle 2: ', puzzle2()); // 1256
