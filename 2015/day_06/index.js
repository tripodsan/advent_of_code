import fs from 'fs';

const RE = /(turn on|turn off|toggle) (\d+),(\d+) through (\d+),(\d+)/

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => {
    const m = line.match(RE);
    if (!m) {
      throw Error();
    }
    return {
      o: m[1],
      v0: [parseInt(m[2], 10), parseInt(m[3], 10)],
      v1: [parseInt(m[4], 10), parseInt(m[5], 10)],
    }
  });

// console.log(data);

function solve(ops) {
  const g = new Array(1000*1000).fill(0);
  for (const { o, v0, v1} of data) {
    for (let y = v0[1]; y <= v1[1]; y++) {
      for (let x = v0[0]; x <= v1[0]; x++) {
        ops[o](g, x + y * 1000);
      }
    }
  }
  return g.reduce((sum, v) => sum + v, 0);
}

function puzzle1() {
  return solve({
    'turn on': (g, i) => g[i] = 1,
    'turn off': (g, i) => g[i] = 0,
    'toggle': (g, i) => g[i] ^= 1,
  });
}

function puzzle2() {
  return solve({
    'turn on': (g, i) => g[i]++,
    'turn off': (g, i) => g[i] = Math.max(0, g[i] - 1),
    'toggle': (g, i) => g[i] += 2,
  });
}

console.log('puzzle 1: ', puzzle1()); // 400410
console.log('puzzle 2: ', puzzle2()); // 15343601
