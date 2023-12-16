import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';

const DIRS = [
  [1, 0],  // 0: >
  [0, 1],  // 1: v
  [-1, 0], // 2: <
  [0, -1], // 3: ^
];

const TILES = [
  [ // '.'
    [0],
    [1],
    [2],
    [3],
  ],
  [ // '|'
    [1, 3], // >
    [1],    // v
    [1, 3], // <
    [3],    // ^
  ],
  [ // '-'
    [0],    // >
    [0, 2], // v
    [2],    // <
    [0, 2], // ^
  ],
  [ // '/'
    [3], // >
    [2], // v
    [1], // <
    [0], // ^
  ],
  [ // '\'
    [1], // >
    [0], // v
    [3], // <
    [2], // ^
  ],
];

const MAP = {
  '.': 0,
  '|': 1,
  '-': 2,
  '/': 3,
  '\\': 4,
};

const initial_grid = new Grid(2).init(fs.readFileSync('./input.txt', 'utf-8'), (x, y, c) => {
  return c === '.' ? null : { t: MAP[c] };
});


// initial_grid.dump(undefined, (dat) => dat ? ['.', '|', '-', '/', '\\'][dat.t] : '.');

function get_energy(start_pos, start_dir, grid) {
  const visits = {};
  const rays = [{
    pos: start_pos,
    dir: start_dir,
  }];

  while (rays.length) {
    const ray = rays[0];
    vec2.add(ray.pos, ray.pos, DIRS[ray.dir]);
    if (grid.inside(ray.pos)) {
      const key = grid.key(ray.pos);
      let v = visits[key];
      if (!visits[key]) {
        v = visits[key] = {
          dirs: [false, false, false, false],
        };
      }
      // if the tile was already visited by a ray in the same direction, we can ignore it
      if (v.dirs[ray.dir]) {
        rays.shift();
      } else {
        v.dirs[ray.dir] = true;
        // check if there is non empty tile
        const tile = grid.get(ray.pos);
        if (tile) {
          // split the ray
          // console.log(ray, tile);
          const new_dirs = TILES[tile.t][ray.dir];
          ray.dir = new_dirs[0];
          if (new_dirs.length === 2) {
            // add a new ray
            rays.push({ pos: [...ray.pos], dir: new_dirs[1] });
          }
        }
      }
    } else {
      // remove ray outside of the grid
      rays.shift();
    }
  }
  return Object.keys(visits).length;
}

function puzzle1() {
  return get_energy([-1, 0], 0, initial_grid);
}

function puzzle2() {
  let best = 0;
  for (let x = 0; x <= initial_grid.max[0]; x++) {
    best = Math.max(best, get_energy([x, -1], 1, initial_grid)); // top edge
    best = Math.max(best, get_energy([x, initial_grid.max[1] + 1], 3, initial_grid)); // bottom edge
  }
  for (let y = 0; y <= initial_grid.max[1]; y++) {
    best = Math.max(best, get_energy([-1, y], 0, initial_grid)); // left edge
    best = Math.max(best, get_energy([initial_grid.max[0] + 1, y], 2, initial_grid)); // right edge
  }
  return best;
}

console.log('puzzle 1:', puzzle1()); // 7996
console.log('puzzle 2:', puzzle2()); // 8239
