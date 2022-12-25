import { vec2 } from '../../vec2.js';
import fs from 'fs';
import { Grid } from '../../MapGrid.js';

/*
position=<-3,  6> velocity=< 2, -1>

 */

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((c) => c.trim())
  .filter((c) => !!c)
  .map((c) => c.split(/[^0-9-]+/).filter((d) => !!d).map((d) => parseInt(d, 10)));

function init() {
  const points = [];
  data.forEach(([x, y, vx, vy]) => {
    points.push({
      p: [x, y],
      v: [vx, vy],
    });
  })
  return points;
}


// console.log(data);

function fill(points) {
  const grid = new Grid();
  points.forEach((p) => {
    grid.put(p.p, {});
  })
  return grid;
}

function puzzle1() {
  const points = init();
  // fill(points).dump();

  let y = Number.MAX_SAFE_INTEGER;
  let best = null;
  let time = 0;
  while (true) {
    // console.log('------------------------------');
    points.forEach((p) => {
      vec2.add(p.p, p.p, p.v);
    })
    const grid = fill(points);
    const dy = grid.max[1] - grid.min[1];
    if (dy < y) {
      best = grid;
      y = dy;
      // console.log(y);
    } else if (best) {
      break;
    }
    time++;
  }
  best.dump();
  console.log('puzzle 1:', best.ocr());
  return time;
}

console.log('puzzle 2:', puzzle1());


