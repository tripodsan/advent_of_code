const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n');

const W = 5;
const H = 5;

const SET_MASK = [];
const CLR_MASK = [];

for (let i=0;i<25;i++) {
  SET_MASK[i] = Math.pow(2,i);
  CLR_MASK[i] = ~SET_MASK[i];
}

function setPixel(d, x, y, c) {
  const i = y*W+x;
  if (c) {
    return d | SET_MASK[i];
  } else {
    return d & CLR_MASK[i];
  }
}

function getPixel(d, x, y) {
  const i = y*W+x;
  return (d & SET_MASK[i]) ? 1 : 0;
}

function numNeighbors(d, x, y) {
  let s = 0;
  if (x > 0) {
    s+= getPixel(d, x -1 ,y);
  }
  if (x < W-1) {
    s+= getPixel(d, x +1 ,y);
  }
  if (y > 0) {
    s+= getPixel(d, x ,y - 1);
  }
  if (y < H-1) {
    s+= getPixel(d, x  ,y + 1);
  }
  return s;
}

/**
 * Call this level 0;
 * the grid within this one is level 1,
 * and the grid that contains this one is level -1.
 */
function numNeighborsInv(d, x, y, up, down) {
  let s = 0;
  if (x === 0) {
    // left edge of grid, down's 12 is to our left
    s+= getPixel(down, 1, 2);
    s+= getPixel(d, x + 1 ,y);
  } else if (x === 4) {
    // right edge of grid, down's 14 is to our right
    s+= getPixel(down, 3, 2);
    s+= getPixel(d, x - 1 ,y);
  } else if (x === 1 && y === 2) {
    // 'up' is to our right, so all its left edge neighbors count
    for (let i=0; i<5; i++) {
      s += getPixel(up, 0, i);
    }
    s+= getPixel(d, x - 1 ,y);
  } else if (x === 3 && y === 2) {
    // 'up' is to our left, so all its right edge neighbors count
    for (let i=0; i<5; i++) {
      s += getPixel(up, 4, i);
    }
    s+= getPixel(d, x + 1 ,y);
  } else {
    s+= getPixel(d, x - 1 ,y);
    s+= getPixel(d, x + 1 ,y);
  }

  if (y === 0) {
    // top edge of grid, down's 8 is to our top
    s+= getPixel(down, 2, 1);
    s+= getPixel(d, x  ,y + 1);
  } else if (y === 4) {
    // bottom edge of grid, down's 18 is to our bottom
    s+= getPixel(down, 2, 3);
    s+= getPixel(d, x ,y - 1);
  }  else if (x === 2 && y === 1) {
    // 'up' is to our bottom, so all its top edge neighbors count
    for (let i=0; i<5; i++) {
      s += getPixel(up, i, 0);
    }
    s+= getPixel(d, x ,y - 1);
  } else if (x === 2 && y === 3) {
    // 'up' is to our top, so all its bottom edge neighbors count
    for (let i=0; i<5; i++) {
      s += getPixel(up, i, 4);
    }
    s+= getPixel(d, x  ,y + 1);
  } else {
    s+= getPixel(d, x ,y - 1);
    s+= getPixel(d, x  ,y + 1);
  }
  return s;
}

function initGrid() {
  let d = 0;
  data.forEach((row, y) => {
    row.trim().split('').forEach((c, x) => {
      d = setPixel(d, x, y, c === '#');
    });
  });
  return d;
}

function step(d) {
  let dp = d;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const n = numNeighbors(d, x, y);
      if (getPixel(d, x, y)) {
        // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
        if (n !== 1) {
          dp = setPixel(dp, x, y, 0);
        }
      } else {
        // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
        if (n === 1 || n === 2) {
          dp = setPixel(dp, x, y, 1);
        }
      }
    }
  }
  return dp;
}

function stepInv(d, up = 0, down = 0) {
  let dp = d;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      if (x === 2 && y === 2) {
        continue;
      }
      const n = numNeighborsInv(d, x, y, up, down);
      if (getPixel(d, x, y)) {
        // A bug dies (becoming an empty space) unless there is exactly one bug adjacent to it.
        if (n !== 1) {
          dp = setPixel(dp, x, y, 0);
        }
      } else {
        // An empty space becomes infested with a bug if exactly one or two bugs are adjacent to it.
        if (n === 1 || n === 2) {
          dp = setPixel(dp, x, y, 1);
        }
      }
    }
  }
  return dp;
}

function render(d) {
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      process.stdout.write(getPixel(d, x, y) ? '#' : '.');
    }
    process.stdout.write('\n');
  }
}

function numBugs(d) {
  let s = 0;
  for (let i = 0; i < 25; i++) {
    s += (d & SET_MASK[i]) ? 1 : 0;
  }
  return s;
}

function puzzle1() {
  let d = initGrid();
  render(d);

  const bio = new Set();
  while (!bio.has(d)) {
    bio.add(d);
    d = step(d);
  }
  console.log('-------------');
  render(d);

  console.log('result 1: ', d); // 18350099
}

function puzzle2() {
  let d = initGrid();
  let levels = [ d ];
  let zero = 0;

  for (let i =0; i < 200; i++) {
    // copy existing levels
    const newLevels = Array.from(levels);
    for (let l = 0; l < levels.length; l++) {
      newLevels[l] = stepInv(levels[l], levels[l+1], levels[l-1]);
    }
    // check if new down level appears
    const down = stepInv(0, levels[0], 0);
    if (down) {
      newLevels.unshift(down);
      zero++;
    }
    // check if new up level appears
    const up = stepInv(0, 0, levels[levels.length - 1]);
    if (up) {
      newLevels.push(up);
    }
    levels = newLevels;
  }

  let n = 0;
  levels.forEach((l, depth) => {
    // console.log('Depth ', depth - zero);
    // render(l);
    n += numBugs(l);
  });
  console.log('Num levels: ', levels.length)
  console.log('result 2: ', n, 'bugs');
}

puzzle1();
puzzle2();