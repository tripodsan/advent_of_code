
const fs = require('fs');

const data0 = fs.readFileSync('./input0.txt', 'utf-8')
  .split(',')
  .map((s)=>s.trim());
const data1 = fs.readFileSync('./input1.txt', 'utf-8')
  .split(',')
  .map((s)=>s.trim());

function run(code, m, mx, points, pass) {
  let x = mx / 2;
  let y = mx / 2;
  let steps = 0;

  const move = (dx, dy) => {
    steps++;
    x += dx;
    y += dy;
    const val = m[x + y * mx];
    if (pass === 0) {
      if (!val) {
        m[x + y * mx] = steps;
      }
    } else {
      if (val) {
        // console.log(x,y);
        const cx = x - mx/2;
        const cy = y - mx/2;
        const d = Math.abs(cx)+Math.abs(cy);
        points.push({d, steps: val + steps, x: cx, y: cy});
      }
    }
    if (x < 0 || y < 0) {
      console.log(x,y);
    }
  };

  code.forEach((c) => {
    let d = Number.parseInt(c.substring(1));
    switch (c[0]) {
      case 'R':
        while (d--) {
          move(1, 0);
        }
        break;
      case 'L':
        while (d--) {
          move(-1, 0);
        }
        break;
      case 'D':
        while (d--) {
          move(0, 1);
        }
        break;
      case 'U':
        while (d--) {
          move(0, -1);
        }
        break;
    }
  });
}

function puzzle2() {
  const mx = 23000;
  const m = new Array(mx*mx);
  const points = [];
  run(data0, m, mx, points, 0);
  run(data1, m, mx, points, 1);

  points.sort((a, b) => (a.steps - b.steps));
  console.log(points[0]);
  console.log('result 1: ', points[0].steps);
}

function puzzle1() {
  const mx = 23000;
  const m = new Array(mx*mx);
  const points = [];
  run(data0, m, mx, points, 0);
  run(data1, m, mx, points, 1);

  points.sort((a, b) => (a.d - b.d));
  console.log(points[0]);
  console.log('result 1: ', points[0].d);
}

puzzle1();
puzzle2();
