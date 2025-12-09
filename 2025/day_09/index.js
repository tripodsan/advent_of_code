import fs from 'fs';
import { Heap } from 'heap-js';

/*
 * x0,y0 ----- x1,y0
 * |             |
 * |             |
 * x0,y1 ----- x1,y1
 */

function intersect_dbg(r, p0, p1) {
  // // ignore self
  // if (p0.x === r.x0 && p0.y === r.y0 && p1.x === r.x1 && p1.y === r.y1) {
  //   return false;
  // }
  // check if vertical or horizontal line
  if (p0.x === p1.x) {
    // if the line is left or right of the rect, return false;
    if (p0.x < r.rx0 || p0.x > r.rx1) {
      return false;
    }
    // if the rect is above or below the line segment
    const [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y];
    return r.y0 >= y0 && r.y0 <= y1 || r.y1 >= y0 && r.y1 <= y1;

  } else if (p0.y === p1.y) {
    // if the line is above or below of the rect, return false;
    if (p0.y < r.ry0 || p0.y > r.ry1) {
      return false;
    }
    // if the rect is left or right the line segment
    const [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x];
    return r.x0 >= x0 && r.x0 <= x1 || r.x1 >= x0 && r.x1 <= x1;

  } else {
    throw Error('unexpected')
  }
}
const intersect = (r, p0, p1) => {
  const ret = intersect_dbg(r, p0, p1);
  console.log(r, p0, p1, ret);
  return ret;
}

function solve(input, n) {
  const tiles = fs.readFileSync(input, 'utf-8')
    .split('\n')
    .filter((c) => !!c)
    .map((line) => {
      const [x,y] = line.split(',').map((p) => Number.parseInt(p, 10));
      return { x, y };
    });

  const q = [];
  for (let i = 0; i < tiles.length - 1; i++) {
    for (let j = i + 1; j < tiles.length; j++) {
      const v0 = tiles[i];
      const v1 = tiles[j];
      const [rx0, rx1] = v0.x < v1.x ? [v0.x, v1.x] : [v1.x, v0.x];
      const [ry0, ry1] = v0.y < v1.y ? [v0.y, v1.y] : [v1.y, v0.y];
      q.push({
        x0: v0.x,
        y0: v0.y,
        x1: v1.x,
        y1: v1.y,
        rx0,
        rx1,
        ry0,
        ry1,
        d: (Math.abs(v0.x - v1.x) + 1)*(Math.abs(v0.y - v1.y) + 1),
      });
    }
  }
  q.sort((r0, r1) => r1.d - r0.d);
  console.log('puzzle 1: ', q[0].d); // 4763932976

  // skip all rectangles that intersect any line with the polygon
  for (const r of q) {
    let skip = false;
    for (let i = 0; i < tiles.length - 1; i++) {
      if (intersect(r, tiles[i], tiles[(i+1)%tiles.length])) {
        skip = true;
        break;
      }
    }
    if (!skip) {
      console.log('puzzle 2: ', r.d); // 4763932976
      return;
    }
  }
}

solve('./input_test.txt');
// solve('./input.txt');
