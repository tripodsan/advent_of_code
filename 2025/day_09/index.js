import fs from 'fs';
import { Heap } from 'heap-js';

/*
 *        p0
 *         |
 * x0,y0 --+-- x1,y0
 * |       |     |
 * |      p1     |
 * x0,y1 ----- x1,y1
 *
 */

function intersect(r, p0, p1) {
  // check if vertical or horizontal line
  if (p0.x === p1.x) {
    // if the line is left or right of the rect, return false;
    if (p0.x <= r.x0 || p0.x >= r.x1) {
      return false;
    }
    // if the rect is above or below the line segment
    const [y0, y1] = p0.y < p1.y ? [p0.y, p1.y] : [p1.y, p0.y];
    return r.y0 < y1 && r.y1 > y0;

  } else if (p0.y === p1.y) {
    // if the line is above or below of the rect, return false;
    if (p0.y <= r.y0 || p0.y >= r.y1) {
      return false;
    }
    // if the rect is left or right the line segment
    const [x0, x1] = p0.x < p1.x ? [p0.x, p1.x] : [p1.x, p0.x];
    return r.x0 < x1 && r.x1 > x0;

  } else {
    throw Error('unexpected')
  }
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
      const [x0, x1] = v0.x < v1.x ? [v0.x, v1.x] : [v1.x, v0.x];
      const [y0, y1] = v0.y < v1.y ? [v0.y, v1.y] : [v1.y, v0.y];
      q.push({
        x0,
        x1,
        y0,
        y1,
        d: (x1 - x0 + 1)*(y1 - y0 + 1),
      });
    }
  }
  q.sort((r0, r1) => r1.d - r0.d);
  console.log('puzzle 1: ', q[0].d); // 4763932976

  // skip all rectangles that intersect with any line of the polygon
  for (const r of q) {
    let skip = false;
    for (let i = 0; i < tiles.length; i++) {
      if (intersect(r, tiles[i], tiles[(i+1)%tiles.length])) {
        skip = true;
        break;
      }
    }
    if (!skip) {
      console.log('puzzle 2: ', r.d); // 1501292304
      return;
    }
  }
}

// solve('./input_test.txt');
solve('./input.txt');
