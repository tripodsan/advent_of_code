
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((c) => +c);

console.log('data length:', data.length);
const W = 25;
const H = 6;
const WH = W * H;

const layers = [];
data.forEach((d, idx) => {
  const l = Math.floor(idx / WH);
  if (layers.length <= l) {
    layers.push([]);
  }
  layers[l].push(d);
});


console.log('num layers', layers.length);

function puzzle2() {
  layers[0].forEach((d, idx) => {
    let l = 1;
    while (d === 2 && l < layers.length) {
      d = layers[l++][idx]
    }
    layers[0][idx] = d;
  });

  let output = '';
  layers[0].forEach((c, idx) => {
    if ((idx % 25) === 0) {
      output += '\n';
    }
    output += c === 1 ? 'X' : ' ';
  });
  console.log('result 2: ', output);
}

function puzzle1() {
  let best = null;
  let min = Number.MAX_SAFE_INTEGER;
  layers.forEach((l) => {
    const zeroes = l.filter((d) => d === 0).length;
    if (zeroes <= min) {
      best = l;
      min = zeroes;
    }
  });
  const ones = best.filter((d) => d === 1).length;
  const twos = best.filter((d) => d === 2).length;
  console.log('\nresult 1: ', ones * twos);
}

puzzle1();
puzzle2();
