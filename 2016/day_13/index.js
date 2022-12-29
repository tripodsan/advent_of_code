import { Grid } from '../../MapGrid.js'

// const FAV = 10;
const START = [1,1];
// const END = [7,4];

const FAV = 1362;
const END = [31,39];

function isWall(x, y) {
  let d = x*x + 3*x + 2*x*y + y + y*y + FAV;
  let b = 0;
  while (d) {
    b += d % 2;
    d = Math.floor(d / 2);
  }
  return b % 2;
}

class BunnyGrid extends Grid {
  *neighbours(pos) {
    for (const v of this.neighboursV(pos)) {
      const [x, y] = v;
      if (x >=0 && y >= 0) {
        const c = this.get(v);
        if (c) {
          yield c;
        } else if (!isWall(x,y)) {
          yield this.put(v, {
            d: Number.MAX_SAFE_INTEGER,
          });
        }
      }
    }
  }
}

function puzzle1() {
  const grid = new BunnyGrid();
  grid.put(START);
  grid.put(END);
  const path = grid.aStar(START, END, () => 1)
  console.log(path);
  for (const v of path) {
    v.c = 'O';
  }
  grid.dump(null, (c) => {
    if (c?.c) {
      return c.c;
    }
    return c ? '.' : '#';
  });
  return path.length - 1;
}

function puzzle2() {
  const grid = new BunnyGrid();
  const open = [];
  open.push(grid.put([1, 1], {
    d: 0,
  }));
  while (open.length) {
    const cell = open.pop();
    const d = cell.d + 1;
    for (const n of grid.neighbours(cell.v)) {
      if (d < n.d && d < 50) {
        n.d = d;
        open.push(n);
      }
    }
  }
  grid.dump();
  return grid.size();
}

console.log('puzzle 1: ', puzzle1()); // 82
console.log('puzzle 2: ', puzzle2());
