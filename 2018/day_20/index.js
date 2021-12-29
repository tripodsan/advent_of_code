import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';


const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((line) => {
    const [reg, score] = line.split(' ');
    return [reg.split(''), parseInt(score)];
  });

const DIRS = {
  'N': [0, -1, '-'],
  'E': [1, 0, '|'],
  'S': [0, 1, '-'],
  'W': [-1, 0, '|'],
};

const DIAGS = [
  [-1, -1],
  [1, -1],
  [1, 1],
  [-1, 1],
];

function dump(grid, pos) {
  console.log('----------------------------------------------');
  grid.dump(undefined, (c) => {
    if (!c) {
      return chalk.gray('.');
    }
    if (pos && c.v.equals(pos)) {
      return chalk.whiteBright('*');
    }
    if (c.c === '#') {
      return chalk.yellow('#');
    }
    if (c.c === '|' || c.c === '-') {
      return chalk.cyanBright(c.c);
    }
    if (c.c === '?') {
      return chalk.red('?');
    }
    if (c.c === 'X') {
      return chalk.greenBright('X');
    }
    return c.c;
  });
}

function plot(grid, pos, c) {
  const [x, y] = pos;
  for (const [dx, dy] of Object.values(DIRS)) {
    grid.getOrSet([x + dx, y + dy], () => ({ c: '?' }));
  }
  for (const [dx, dy] of DIAGS) {
    grid.put([x + dx, y + dy], { c: '#' });
  }
  return grid.getOrSet(pos, () => ({ c, d: Number.MAX_SAFE_INTEGER }));
}

function solve(reg) {
  reg.shift();
  reg.pop();
  const grid = new Grid();
  let pos = [0, 0];
  let prev = plot(grid, pos, 'X');
  prev.d = 0;
  const p = []
  while (reg.length) {
    const c = reg.shift();
    if (c === '(') {
      p.push(pos);
    } else if (c === ')') {
      pos = p.pop();
    } else if (c === '|') {
      pos = p[p.length - 1];
    } else {
      const [dx, dy, door] = DIRS[c];
      pos = [pos[0] + dx, pos[1] + dy];
      grid.put(pos, { c: door }); // draw door
      pos[0] += dx;
      pos[1] += dy;
      const next = plot(grid, pos, ' ');
      next.d = Math.min(next.d, prev.d + 1);
    }
    prev = grid.get(pos);
  }

  grid.values().forEach((c) => {
    if (c.c === '?') {
      c.c = '#';
    }
  });
  dump(grid);

  // console.log(d);
  const values = Array.from(grid.values().map((c) => c.d));
  console.log('puzzle 1:', values.max().max);

  const numRooms = values.reduce((s, d) => s + (d >=1000 ? 1 : 0), 0);
  console.log('puzzle 2:', numRooms);
}


for (const [reg, expected] of data) {
  if (expected) {
    console.log('expected for puzzle 1:', expected);
  }
  solve(reg);
}
