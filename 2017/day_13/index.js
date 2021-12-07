const fs = require('fs');

// p1: 1632
// p2: 3834136

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/[^0-9]+/).map((c) => parseInt(c.trim())));

let max = data.reduce((p, [d]) => Math.max(p, d), 0);

// console.log(data);

function init(delay = 0) {
  const layers = [];
  data.forEach(([n, size]) => {
    const f = size * 2 - 2
    layers.push({
      freq: f,
      scan: (((-delay -n) % f) + f) % f,
      depth: n,
      range: size,
    })
  })
  return layers;
}

function puzzle1() {
  return init().reduce((p, layer) => p + (layer.scan === 0 ? layer.depth * layer.range : 0), 0)
}


function puzzle2() {
  let delay = 0;
  while (true) {
    const layers = init(delay);
    let hit = 0;
    for (const layer of layers) {
      hit += layer.scan === 0 ? 1 : 0;
    }
    if (!hit) {
      return delay;
    }
    delay++;
  }
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
