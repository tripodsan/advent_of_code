require('../../utils.js');
const fs = require('fs');
let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) =>
    s.split('')
      .map((c) => c.trim())
      .map((c) => parseInt(c, 10))
  );

const H = data.length;
const W = data[0].length;
data = data.flat();

const DIRS = [
  [0, -1],
  [1, -1],
  [1, 0],
  [1, 1],
  [0, 1],
  [-1, 1],
  [-1, 0],
  [-1, -1],
]

function dump() {
  for (let i = 0; i < data.length; i += W) {
    console.log(data.slice(i, i + W).join(''));
  }
}

function fill(x, y) {
  if (x < 0 || x >= W || y < 0 || y >= H) {
    return;
  }
  const i = x + y * W;
  const d = data[i] + 1;
  if (d < 0) {
    return;
  }
  if (d > 9) {
    data[i] = -2;
    DIRS.forEach(([dx, dy]) => fill(x + dx, y + dy));
  } else {
    data[i] = d;
  }
}

function puzzle1() {
  let gen = 0;
  let totalFlashes = 0;
  let tf100 = 0;
  let allFlash = 0;
  do {
    for (let y = 0; y < H; y++) {
      for (let x = 0; x < W; x++) {
        fill(x, y);
      }
    }
    gen++;

    let flashes = 0;
    for (let i = 0; i < data.length; i++) {
      if (data[i] < 0) {
        data[i] = 0;
        flashes++;
      }
    }
    totalFlashes += flashes;

    // console.log('--------------------------', gen, flashes, totalFlashes, allFlash);
    // dump();

    if (gen === 100) {
      tf100 = totalFlashes;
    }
    if (flashes === data.length && !allFlash) {
      allFlash = gen;
    }
  } while (!tf100 || !allFlash)

  console.log('puzzle 1: ', tf100);
  console.log('puzzle 2: ', allFlash);
}

puzzle1();
