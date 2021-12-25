import { Grid } from '../../utils.js';
import chalk from 'chalk';
import fs from 'fs';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const DIRS = [
  [ 0, -1],
  [-1,  0],
  [ 1,  0],
  [ 0,  1],
];

const OTHER = {
  'E': 'G',
  'G': 'E',
}

function init(ap = { 'E': 3, 'G': 3}) {
  const grid = new Grid();
  const mobs = [];

  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .forEach((s, y) => s.split('')
      .forEach((c, x) => {
        if (c === 'E' || c === 'G') {
          const mob = {
            id: mobs.length,
            type: c,
            hp: 200,
            ap: ap[c],
            pos: [x, y],
            round: -1,
          };
          mobs.push(mob);
          grid.put([x, y], { mob, c, })
        } else {
          grid.put([x, y], { c })
        }
      }));

  return {
    grid,
    mobs,
  }
}

function dump(grid) {
  grid.dump(undefined, (c) => {
    if (c.mob) {
      if (c.mob.type === 'E') {
        return chalk.green('E');
      } else {
        return chalk.red('G');
      }
    }
    if (c.c === '*') {
      return chalk.blue('*');
    }
    return chalk.gray(c.c);
  });
}

let visited = 0;

const readingComp = (m0, m1) => {
  let d = m0.d - m1.d;
  if (d !== 0) {
    return d;
  }
  d = m0.c.v[1] - m1.c.v[1];
  if (d !== 0) {
    return d;
  }
  return m0.c.v[0] - m1.c.v[0]
};

function getMobs(grid, type, cell) {
  visited++;
  const q = new Heap(readingComp);
  const mobs = [];
  q.add({
    d: 0,
    c: cell,
    p: [],
  });
  while (q.length) {
    const upd = (x, y, d, p) => {
      const c = grid.get([x, y]);
      if (!c || c.visited === visited) {
        return;
      }
      c.visited = visited;
      if (c.mob?.type === type) {
        // console.log('found', c, d, p);
        mobs.push({
          c, // cell
          d, // distance
          p, // path
        });
      } else if (c.c === '.') {
        q.add({
          d,
          c,
          p: [...p, [x, y]],
        })
      }
    };
    const { d, c, p } = q.pop();
    upd(c.v[0], c.v[1] - 1, d + 1, p);
    upd(c.v[0] - 1, c.v[1], d + 1, p);
    upd(c.v[0] + 1, c.v[1], d + 1, p);
    upd(c.v[0], c.v[1] + 1, d + 1, p);
  }
  // sort the mob list by distance, then y, then x coordinates
  return mobs.sort(readingComp)
}

function play(round, grid, mobs, suddenDeath) {
  // console.log('=============================================== round', round);
  for (let y = grid.min[1]; y <= grid.max[1]; y++) {
    for (let x = grid.min[0]; x <= grid.max[0]; x++) {
      const cell = grid.get([x, y]);
      if (!cell.mob) {
        continue;
      }
      const { mob } = cell;
      if (mob.round === round) {
        continue;
      }
      mob.round = round;
      const other = OTHER[mob.type];
      if (!mobs.find((m) => m.type === other)) {
        console.log(`no more ${other}. ${mob.type} wins.`);
        return false;
      }
      const es = getMobs(grid, other, cell);
      if (!es.length) {
        continue;
      }

      if (es[0].d > 1) {
        // move
        const [best] = es;
        const target = best.c.mob;
        const pos = best.p[0];
        // console.log(`move ${mob.type}${mob.id} towards ${target.type}${target.id} --> ${pos}`);
        delete cell.mob;
        cell.c = '.';
        mob.pos = pos;
        const newCell = grid.get(pos);
        newCell.mob = mob;
        newCell.c = mob.type;
      }

      // check if it can attack
      let best = null;
      DIRS.forEach((d) => {
        const p = vec2.add([0, 0], mob.pos, d);
        const c = grid.get(p);
        if (c?.mob?.type === other) {
          if (!best || c.mob.hp < best.mob.hp) {
            best = c;
          }
        }
      });
      if (best) {
        const target = best.mob;
        target.hp -= mob.ap;
        // console.log(`attack ${mob.type}${mob.id} --> ${target.type}${target.id}: ${target.hp}`);
        if (target.hp <= 0) {
          mobs.delete(target);
          delete best.mob;
          best.c = '.';
          if (target.type === suddenDeath) {
            return false;
          }
        }
      }
    }
  }
  // dump(grid);
  // mobs.forEach((mob) => {
  //   console.log(`${mob.type}${mob.id} ${mob.hp}`);
  // })
  return true;
}

function count(mobs, type) {
  return mobs.reduce((s, m) => s + (m.type === type ? 1 : 0), 0);
}

function puzzle1() {
  const { grid, mobs } = init();
  dump(grid);
  let round = 0;
  while (true) {
    if (!play(round, grid, mobs)) {
      break;
    }
    round++;
  }
  return mobs.reduce((s, m) => s += m.hp, 0) * round;
}

function puzzle2() {
  const ap = { 'E': 4, 'G': 3};
  while (true) {
    console.log('simulating with', ap);
    const { grid, mobs } = init(ap);
    const numElves = count(mobs, 'E');
    // dump(grid);
    let round = 0;
    while (true) {
      if (!play(round, grid, mobs, 'E')) {
        break;
      }
      round++;
    }
    if (count(mobs, 'E') === numElves) {
      console.log('Elves need', ap.E, 'attack power.');
      return mobs.reduce((s, m) => s += m.hp, 0) * round;
    }
    ap.E++;
  }
}

console.log('puzzle 1:', puzzle1())
console.log('puzzle 2:', puzzle2());
