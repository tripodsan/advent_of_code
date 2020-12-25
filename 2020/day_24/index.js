
const fs = require('fs');
const { Grid } = require('../utils.js');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s);


DIRECTION = {
  EAST: 0,
  SOUTH_EAST: 1,
  SOUTH_WEST: 2,
  WEST: 3,
  NORTH_WEST: 4,
  NORTH_EAST: 5,
  BY_NAME: {
    e: 0,
    se: 1,
    sw: 2,
    w: 3,
    nw: 4,
    ne: 5,
  },
  DELTAS: [
    [1, 0], // e
    [0, 1], // se
    [-1, 1], // sw
    [-1, 0], // w
    [0, -1], // nw
    [1, -1], // ne
  ],
};

// console.log(data);
const dirs = [];

for (let line of data) {
  const d = [];
  while (line.length) {
    // e, se, sw, w, nw, and ne
    let dir;
    if (line[0] === 'e' || line[0] === 'w') {
      dir = DIRECTION.BY_NAME[line[0]];
      line = line.substring(1);
    } else {
      const dd = line.substring(0, 2);
      dir = DIRECTION.BY_NAME[dd];
      line = line.substring(2);
    }
    d.push(dir);
  }
  dirs.push(d);
}


function numBlacks(grid) {
  const [minx, miny] = grid.min;
  const [maxx, maxy] = grid.max;
  let count = 0;
  for (let y = miny; y <= maxy; y++) {
    for (let x = minx; x <= maxx; x++) {
      const g = grid.get([x, y]);
      if (g && g.black) {
        count++;
      }
    }
  }
  return count;
}

function run(grid = new Grid()) {
  for (const dir of dirs) {
    const v = [0,0];
    for (const d of dir) {
      const delta = DIRECTION.DELTAS[d];
      v[0] += delta[0];
      v[1] += delta[1];
    }
    let tile = grid.get(v);
    const black = !tile || !tile.black;
    grid.put(v, {
      black,
    })
  }
  return grid;
}

function numBlackNeighbours(grid, x, y) {
  let n = 0;
  for (const d of DIRECTION.DELTAS) {
    const v = [x + d[0], y + d[1]];
    const tile = grid.get(v);
    if (tile && tile.black) {
      n++;
    }
  }
  return n;
}

function puzzle2() {
  let grid = run();
  for (let day = 0; day < 100; day++) {
    const newGrid = new Grid();
    const [minx, miny] = grid.min;
    const [maxx, maxy] = grid.max;
    for (let y = miny - 1; y <= maxy + 1; y++) {
      for (let x = minx - 1; x <= maxx + 2; x++) {
        const v = [x,y];
        const numBlacks = numBlackNeighbours(grid, x, y);
        let tile = grid.get(v);
        if (tile && tile.black) {
          // Any black tile with zero or more than 2 black tiles immediately adjacent to it is flipped to white.
          if (numBlacks === 0 || numBlacks > 2) {
            // flip white
          } else {
            // stay black
            newGrid.put(v, tile);
          }
        } else {
          // Any white tile with exactly 2 black tiles immediately adjacent to it is flipped to black.
          if (numBlacks === 2) {
            newGrid.put(v, {
              black: true,
            })
          } else {
            // stay white
          }
        }
      }
    }
    grid = newGrid;
  }
  return numBlacks(grid);
}

function puzzle1() {
  const grid = run();
  return numBlacks(grid);
}



console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
