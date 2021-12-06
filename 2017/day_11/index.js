const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(',').map((c) => c.trim()));

function cubeRound(cube) {
  let x = Math.round(cube[0]);
  let y = Math.round(cube[1]);
  let z = Math.round(cube[2]);
  const dx = Math.abs(x - cube[0]);
  const dy = Math.abs(y - cube[1]);
  const dz = Math.abs(z - cube[2]);
  if (dx > dy && dx > dz) {
    x = -y - z;
  } else if (dy > dz) {
    y = -x - z;
  } else {
    z = -x - y;
  }
  return [x, y, z];
}

function cubeToAxial(cube) {
  return [cube[0], cube[2]];
}

function axialToCube(hex) {
  const x = hex[0];
  const z = hex[1];
  const y = -x - z;
  return [x, y, z];
}

function hexDistance(a, b) {
  return (Math.abs(a[0] - b[0])
    + Math.abs(a[0] + a[1] - b[0] - b[1])
    + Math.abs(a[1] - b[1])) / 2;
}


/*
  \ n  /
nw +--+ ne
  /    \
-+      +-
  \    /
sw +--+ se
  / s  \

 */
const DIR = {
  'n': [0, -1],
  'ne': [1, -1],
  'se': [1, 0],
  's': [0, 1],
  'sw': [-1, 1],
  'nw': [-1, 0],
}


function puzzle1(line) {
  const pos = [0, 0];
  line.forEach((d) => {
    const dir = DIR[d];
    pos[0] += dir[0];
    pos[1] += dir[1];
  })
  return hexDistance([0,0], pos);
}

function puzzle2(line) {
  let max = 0;
  const pos = [0, 0];
  line.forEach((d) => {
    const dir = DIR[d];
    pos[0] += dir[0];
    pos[1] += dir[1];
    max = Math.max(max, hexDistance([0,0], pos));
  })
  return max;
}

data.forEach((line) => {
  console.log('puzzle 1: ', puzzle1(line));
  console.log('puzzle 2: ', puzzle2(line));
})
