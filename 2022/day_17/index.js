import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const MAX_X = 7;

const TILES = [
  // ..####.
  {
    w: 4,
    p: [
      0b01111000,
    ],
  },

  // ...#.
  // ..###
  // ...#.
  {
    w: 3,
    p: [
      0b00100000,
      0b01110000,
      0b00100000,
    ],
  },

  // ..#
  // ..#
  // ###
  {
    w: 3,
    p: [
      0b01110000,
      0b00010000,
      0b00010000,
    ],
  },

  // #
  // #
  // #
  // #
  {
    w: 1,
    p: [
      0b01000000,
      0b01000000,
      0b01000000,
      0b01000000,
    ],
  },

  // ##
  // ##
  {
    w: 2,
    p: [
      0b01100000,
      0b01100000,
    ],
  },
];

for (const tile of TILES) {
  const p = tile.p;
  tile.p = [];
  for (let x = 0; x + tile.w <= MAX_X; x++) {
    tile.p.push([...p]);
    // console.log('----------------------', x);
    // dump(p);
    for (let i = 0; i < p.length; i++) {
      p[i] = p[i] >> 1;
    }
  }
}

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('').map((c) => c === '<' ? -1 : 1);


function dump(grid, p = [], y) {
  for (let i = 0; i < grid.length; i++) {
    const d = grid[i] | (p[i - y] || 0);
    console.log(d.toString(2)
      .padStart(8, '0')
      .replaceAll('0', '.')
      .replaceAll('1', '#')
      .substring(1));
  }
}

function collide(grid, p, y) {
  for (let i = 0n; i < p.length; i++) {
    if ((grid[y + i] & p[i]) !== 0) {
      return true;
    }
  }
  return false;
}

function puzzle(N) {
  const grid = [0b1111111];
  let minY = -1n;
  let maxY = 0n;
  let tick = 0;
  let tileNr = 0;
  const patterns = new Map();

  for (let n = 0n; n < N; n++) {
    let tetris = 0;
    let x = 2;
    let y = maxY + 3n;
    // add empty space if needed
    while (BigInt(grid.length) - (maxY - minY) < 5) {
      grid.push(0);
    }
    const tile = TILES[tileNr];
    tileNr = (tileNr + 1) % TILES.length
    let p = tile.p[x];
    while (true) {
      const xx = x + data[tick];
      tick = (tick + 1) % data.length
      const pp = tile.p[xx];
      if (pp && !collide(grid, pp, y - minY)) {
        x = xx;
        p = pp;
      }
      const yy = y - 1n;
      if (collide(grid, p, yy - minY)) {
        for (let i = 0n; i < p.length; i++) {
          const idx = y - minY + i;
          if ((grid[idx] |= p[i]) === 127) {
            tetris = idx;
          }
        }
        y += BigInt(p.length);
        if (y > maxY) {
          maxY = y;
        }
        // console.log('=====================', n, minY, maxY);
        // dump(grid);
        break;
      }
      y = yy;
      // console.log('------------------', tick);
      // dump(grid, p, y - minY);
      if (y - minY < 0) {
        throw Error('y');
      }
    }
    // reduce grid if tetris
    if (tetris) {
      grid.splice(0, Number(tetris));
      minY += tetris;
      // console.log('======= splice ======', n, minY);
      // dump(grid);
    }
    if (n % 1_000_000n === 0n) {
      console.log('=====================', n, minY, maxY);
      // dump(grid);
    }
    // calculate ground hash
    if (n > data.length) {
      let h = 0n;
      for (let i = 1; i < grid.length && grid[i]; i++) {
        h = h * 128n + BigInt(grid[i]);
      }
      // console.log(h.toString(2));
      // add rock cycles
      h = h * 5n + BigInt(tileNr);

      // add wind cycle
      h = h * BigInt(data.length) + BigInt(tick);

      const entry = patterns.get(h);
      if (!entry) {
        patterns.set(h, [{
          n,
          t: tileNr,
          d: tick,
          maxY,
        }]);
      } else {
        entry.push({
          n,
          t: tileNr,
          d: tick,
          maxY,
        });
        console.log('found cycle', tileNr, tick, entry, maxY);
        const deltaN = entry[1].n - entry[0].n;
        const deltaY = entry[1].maxY - entry[0].maxY;
        const numIters = (N - n) / deltaN;
        maxY += deltaY * numIters;
        minY += deltaY * numIters;
        n += deltaN * numIters;
        console.log('ffw to ', n, maxY);
        patterns.clear();
      }
    }
  }
  return maxY;
}

console.log('puzzle 1 : ', puzzle(2022));
console.log('puzzle 2 : ', puzzle(1_000_000_000_000n));
