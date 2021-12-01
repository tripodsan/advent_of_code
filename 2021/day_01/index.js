
const fs = require('fs');
// 1567
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));


function sliding(data, size) {
  size--;
  const w = [];
  for (let i = 0; i < data.length; i++) {
    const n = data[i];
    for (let j = 0; j < size; j++) {
      w[i - j] += n;
    }
    w.push(n);
  }
  w.splice(w.length - size, size);
  return w;
}

function puzzle2() {
  return sliding(data, 3)
    .map((n, idx, a) => n - a[idx-1])
    .filter((n) => n > 0)
    .length;
}

function puzzle1() {
  return data
    .map((n, idx) => n - data[idx-1])
    .filter((n) => n > 0)
    .length;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
