import { Grid } from '../../utils.js';
import chalk from 'chalk';
import fs from 'fs';
import { vec2 } from '../../vec2.js';

const DIRS = [
  [ 0, -1],
  [ 1,  0],
  [ 0,  1],
  [-1,  0],
];

const TRAIN_DIR = {
  '^': 0,
  '>': 1,
  'v': 2,
  '<': 3,
}

const TURNS = {
  '\\': [3, 1, 3, 1],
  '/': [1, 3, 1, 3],
}

const RAIL  = ['|', '-', '|', '-'];
const TDIRS = ['^', '>', 'v', '<'];
const TDELTA = [3, 0, 1];

function init() {
  const grid = new Grid();
  const trains = [];
  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .forEach((s, y) => s.split('')
      .forEach((c, x) => {
        const td = TRAIN_DIR[c];
        if (td !== undefined) {
          const train = {
            id: trains.length,
            pos: [x, y],
            dir: td,
            turns: 0,
          };
          trains.push(train);
          grid.put([x, y], {
            c: RAIL[td],
            t: train
          });
        } else if (c !== ' ') {
          grid.put([x, y], { c })
        }
      }));

  return {
    grid,
    trains,
  }
}

function dump(grid) {
  grid.dump(undefined, (c) => {
    if (c.c === 'X') {
      return chalk.red('X');
    }
    if (c.t) {
      return chalk.yellow(TDIRS[c.t.dir]);
    }
    return c.c;
  });
}

function puzzle1(continuous) {
  const { grid, trains } = init();
  // dump(grid);
  let iter = 0;
  while (trains.length > 1) {
    // console.log('=========================================================================', iter, trains.length)
    for (let y = grid.min[1]; y <= grid.max[1]; y++) {
      for (let x = grid.min[0]; x <= grid.max[0]; x++) {
        const cell = grid.get([x, y]);
        if (cell && cell.t && cell.t.iter !== iter) {
          const { t } = cell;
          t.iter = iter;
          delete cell.t;
          vec2.add(t.pos, t.pos, DIRS[t.dir]);
          const nc = grid.get(t.pos);
          if (nc.t) {
            if (!continuous) {
              nc.c = 'X';
              // dump(grid);
              return t.pos;
            } else {
              trains.delete(nc.t);
              trains.delete(t);
              delete nc.t;
            }
            continue;
          }
          nc.t = t;
          if (nc.c === '+') {
            t.dir = (t.dir + TDELTA[t.turns]) % 4;
            t.turns = (t.turns + 1) % 3;
          }
          if (TURNS[nc.c]) {
            t.dir = (t.dir + TURNS[nc.c][t.dir]) % 4;
          }
        }
      }
    }
    iter++;
    // dump(grid);
  }
  return trains[0].pos;
}

console.log('puzzle 1:', puzzle1())
console.log('puzzle 2:', puzzle1(true));
