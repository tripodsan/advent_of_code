const fs = require('fs');
const { Grid } = require('../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s, y) => s.split(''));

// console.log(data);

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
]

function dump(grid, pos) {
  for (let y = grid.min[1]; y <= grid.max[1]; y++) {
    const row = [];
    let delim = ' ';
    for (let x = grid.min[0]; x <= grid.max[0]; x++) {
      if (pos[0] === x && pos[1] === y) {
        row.push('[');
        delim = ']';
      } else {
        row.push(delim);
        delim = ' ';
      }
      row.push(grid.get([x, y])?.c ?? '.');
    }
    console.log(row.join(''));
  }
}

function init() {
  const grid = new Grid();
  data.forEach((row, y) => {
    row.forEach((cell, x) => {
      if (cell === '#') {
        grid.put([x, y], {
          c: cell,
        })
      } else {
        grid.touch([x,y]);
      }
    })
  })
  return grid;
}

function puzzle1(iter) {
  const grid = init();
  console.log(grid);
  let pos = [
    Math.floor(grid.max[0]/2),
    Math.floor(grid.max[1]/2),
  ];
  let dir = 0;
  let infections = 0;
  dump(grid, pos);

  for (let i = 0; i < iter; i++) {
    console.log('---------------------------', i, 'direction', dir, grid.min, grid.max);
    if (grid.get(pos)) {
      dir = (dir + 1) % 4;
      grid.del(pos);
    } else {
      dir = (dir + 3) % 4;
      infections++;
      grid.put(pos, {
        c: '#',
      });
    }
    pos[0] += DIRS[dir][0];
    pos[1] += DIRS[dir][1];
  }
  // dump(grid, pos);
  return infections;
}

const STATES = {
  '#': 'F',
  'F': '.',
  '.': 'W',
  'W': '#',
}

function puzzle2(iter) {
  const grid = init();
  let pos = [
    Math.floor(grid.max[0]/2),
    Math.floor(grid.max[1]/2),
  ];
  let dir = 0;
  let infections = 0;
  dump(grid, pos);
  /*

  Clean nodes become weakened.
  Weakened nodes become infected.
  Infected nodes become flagged.
  Flagged nodes become clean.


  Decide which way to turn based on the current node:
  If it is clean, it turns left.
  If it is weakened, it does not turn, and will continue moving in the same direction.
  If it is infected, it turns right.
  If it is flagged, it reverses direction, and will go back the way it came.
  Modify the state of the current node, as described above.
  The virus carrier moves forward one node in the direction it is facing.

 */
  for (let i = 0; i < iter; i++) {
    if (i % 100000 == 0) {
      console.log('---------------------------', i, 'direction', dir, grid.min, grid.max);
    }
    let node = grid.get(pos)?.c;
    if (!node) {
      dir = (dir + 3) % 4;
      node = 'W';
    } else if (node === 'W') {
      infections++;
      node = '#';
    } else if (node === '#') {
      dir = (dir + 1) % 4;
      node = 'F';
    } else if (node === 'F') {
      dir = (dir + 2) % 4;
      node = null;
    } else {
      throw Error('illegal state ' + node);
    }

    if (!node) {
      grid.del(pos);
    } else {
      grid.put(pos, {
        c: node,
      })
    }
    pos[0] += DIRS[dir][0];
    pos[1] += DIRS[dir][1];
    // dump(grid, pos);
  }
  return infections;
}

// console.log('puzzle 1:', puzzle1(70));
console.log('puzzle 2:', puzzle2(10000000));
