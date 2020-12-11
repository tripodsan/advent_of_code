
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  // .map((s) => s.split(''));


const W = data[0].length;
const H = data.length;
// console.log(data, W, H);

const dirs = [
  [-1, -1],
  [0, -1],
  [1, -1],
  [-1, 0],
  [1, 0],
  [-1,1],
  [0,1],
  [1,1],
]

function getOccupied(grid, x,y) {
  let o = 0;
  dirs.forEach(([dx,dy]) => {
    const cx = x + dx;
    const cy = y + dy;
    if (cx >= 0 && cx < W && cy >= 0 && cy < H && grid[cy][cx] === '#') {
      o++;
    }
  })
  return o;
}

function getOccupied2(grid, x,y) {
  let o = 0;
  dirs.forEach(([dx,dy]) => {
    let cx = x + dx;
    let cy = y + dy;
    while (cx >= 0 && cx < W && cy >= 0 && cy < H) {
      const c = grid[cy][cx];
      if (c === '#') {
        o++;
        break;
      }
      if (c === 'L') {
        break;
      }
      cx += dx;
      cy += dy;
    }
  })
  return o;
}

function step(grid, fn, limit) {
  const ret = [];
  let changes = 0;
  let occ = 0;
  for (let y = 0; y < H; y++) {
    let row = '';
    for (let x = 0; x < W; x++) {
      const c = grid[y][x];
      let nc = c;
      if (c !== '.') {
        const n = fn(grid, x, y);
        if (c === '#') {
          nc = n >= limit ? 'L' : '#';
        } else {
          nc = n === 0 ? '#' : 'L';
        }
      }
      row += nc;
      if (c !== nc) {
        changes++;
      }
      if (nc === '#') {
        occ++;
      }
    }
    ret.push(row);
  }
  return [ret, changes, occ];
}

function run(fn, limit) {
  let grid = data;
  let changes = 0;
  let occ = 0;

  do {
    [ grid, changes, occ] = step(grid, fn, limit);
  } while (changes > 0);
  return occ;
}

function puzzle2() {
  return run(getOccupied2, 5);
}

function puzzle1() {
  return run(getOccupied, 4);
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
