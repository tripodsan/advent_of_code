import fs from 'fs';
import { Grid } from '../../utils.js';
import chalk from 'chalk';

function init() {
  const grid = new Grid();
  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .forEach((line) => {
      const segs = line.split(/[=,. ]+/);
      if (segs[0] === 'x') {
        let x = parseInt(segs[1]);
        let y = parseInt(segs[3]);
        let y1 = parseInt(segs[4]);
        while (y <= y1) {
          grid.put([x, y++], { c: '#'});
        }
      } else {
        let y = parseInt(segs[1]);
        let x = parseInt(segs[3]);
        let x1 = parseInt(segs[4]);
        while (x <= x1) {
          grid.put([x++, y], { c: '#'});
        }
      }
    });
  return grid;
}

function dump(grid) {
  console.log('----------------------------------------------');
  grid.dump(undefined, (c) => {
    if (!c) {
      return chalk.gray('.');
    }
    if (c.c === '|' || c.c === '~' || c.c === '+' || c.c === '<' || c.c === '>') {
      return chalk.blue(c.c);
    }
    if (c.c === '#') {
      return chalk.yellow(c.c);
    }
    return c.c;
  });
}

function tick(grid, sources) {
  const upd = (x, y, c) => {
    return grid.getOrSet(
      [x, y],
      () => ({ v: [x, y], c }),
      (cell) => {
        cell.c = c;
        return cell;
      },
    );
  }

  let modified = false;
  for (let i = 0; i < sources.length; i++) {
    let source = sources[i];
    let [x, y] = source.v;
    if (source.c !== '|') {
      // backtrack
      sources[i] = upd(x, y - 1, '|');
      // sources.splice(i--, 1);
      continue;
    }
    // fill down
    let s = grid.get([x, y + 1])?.c;
    while (s !== '#' && s !== '~') {
      if (s === '|' || y >= grid.max[1]) {
        sources.splice(i, 1);
        return true;
      }
      y++;
      sources[i] = upd(x, y, '|');
      s = grid.get([x, y + 1])?.c;
      modified = true;
    }

    // find left
    let x0 = x - 1;
    let left = true;
    while (grid.get([x0, y])?.c !== '#') {
      modified = true;
      upd(x0, y, '|');
      s = grid.get([x0, y + 1])?.c;
      if (!s || s === '|') {
        left = false;
        break;
      }
      x0--;
    }
    // find right
    let x1 = x + 1;
    let right = true;
    while (grid.get([x1, y])?.c !== '#') {
      modified = true;
      upd(x1, y, '|');
      s = grid.get([x1, y + 1])?.c;
      if (!s || s === '|') {
        right = false;
        break;
      }
      x1++;
    }
    if (left && right) {
      // make solid
      while (++x0 < x1) {
        upd(x0, y, '~');
      }
      // backtrack
      sources[i] = upd(x, y - 1, '|');
      modified = true;
    } else {
      sources.splice(i, 1);
      i--;
      if (!left) {
        sources.push(upd(x0, y, '|'));
        modified = true;
      }
      if (!right) {
        sources.push(upd(x1, y, '|'));
        modified = true;
      }
    }
  }
  return modified;
}


function solve() {
  const grid = init();
  let minY = grid.min[1];
  let maxY = grid.max[1];
  grid.put([500, 0], { c: '+'});
  const sources = [
    grid.put([500, 1], { c: '|'}),
  ]
  while (true) {
    if (!tick(grid, sources)) {
      break;
    }
  }
  dump(grid);
  let water = 0;
  let stale = 0;
  grid.values().forEach(({v, c}) => {
    if (v[1] >= minY && v[1] <= maxY && c !== '#') {
      water++;
      if (c === '~') {
        stale++;
      }
    }
  })

  console.log('puzzle 1:', water);
  console.log('puzzle 2:', stale);
}

solve();
