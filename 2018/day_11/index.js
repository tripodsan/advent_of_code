require('../../utils.js');

const W = 300;
const H = 300;


function init(nr) {
  const grid = Array.init(H, () => Array.init(W, 0));

  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      // Find the fuel cell's rack ID, which is its X coordinate plus 10.
      const rackID = x + 11;

      // Begin with a power level of the rack ID times the Y coordinate.
      let power = rackID * (y + 1);

      //   Increase the power level by the value of the grid serial number (your puzzle input).
      power += nr;

      // Set the power level to itself multiplied by the rack ID.
      power *= rackID;

      //   Keep only the hundreds digit of the power level (so 12345 becomes 3; numbers with no hundreds digit become 0).
      power = Math.floor(power / 100) % 10;

      // Subtract 5 from the power level.
      power -= 5;

      grid[y][x] = power;
    }
  }
  return grid;
}

function puzzle1(grid, size) {
  let best = [-1, -1];
  let bestPower = Number.MIN_SAFE_INTEGER;

  for (let y = 0; y < H - size; y++) {
    for (let x = 0; x < W - size; x++) {
      let power = 0;
      for (let yy = 0; yy < size; yy++) {
        for (let xx = 0; xx < size; xx++) {
          power += grid[y + yy][x + xx];
        }
      }
      if (power > bestPower) {
        bestPower = power;
        best = [x + 1, y + 1];
      }
    }
  }
  return [`${best[0]},${best[1]}`, bestPower];
}

function puzzle2(grid) {
  let bestPower = 0;
  let bestSize = 0;
  let bestPos = '';
  for (let size = 1; size < 299; size++) {
    const [pos, power] = puzzle1(grid, size);
    console.log(size, pos, power);
    if (power > bestPower) {
      bestPower = power;
      bestSize = size;
      bestPos = pos;
    }
  }
  return `${bestPos},${bestSize}`;
}

const grid = init(7689);
console.log('puzzle 1:', puzzle1(grid, 3)[0])
console.log('puzzle 2:', puzzle2(grid));
