const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => Number.parseInt(s))
  .sort((a,b) => a - b)

data.push(data[data.length-1] + 3);
// console.log(data);

function process() {
  let jolt = 0;
  let hist = [0, 0, 0, 0];
  for (let a of data) {
    const d = a - jolt;
    if (d <= 3) {
      hist[d]++;
      jolt = a;
    }
  }
  // console.log(hist);
  return hist[1] * hist[3];
}

const cache = [];

function connect(jolt, idx) {
  if (cache[jolt] !== undefined) {
    return cache[jolt];
  }
  let num = 0;
  while (data[idx] - jolt <= 3) {
    if (idx === data.length - 1) {
      return 1;
    }
    const a = data[idx++];
    num += connect(a, idx);
  }
  cache[jolt] = num;
  return num;
}

function puzzle2() {
  return connect(0, 0);
}

function puzzle1() {
    return process();
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
