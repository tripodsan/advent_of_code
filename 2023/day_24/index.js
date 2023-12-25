import fs from 'fs';


const rays = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .filter((line) => !!line)
  .map((line) => {
    // 19, 13, 30 @ -2,  1, -2
    const v = line.split(/[, @]+/).map((c) => Number.parseInt(c, 10));
    return {
      p: v.splice(0, 3),
      v,
    };
  });


function ray_intersect_2d(p0, v0, p1, v1, min, max) {
  if (p0[0] === p1[0] && p0[1] === p1[0]) {
    throw Error();
  }
  const dx = p1[0] - p0[0];
  const dy = p1[1] - p0[1];
  const det = v0[0] * v1[1] - v0[1] * v1[0];
  if (det !== 0) { // near parallel line will yield noisy results
    const u = (v1[1] * dx - v1[0] * dy) / det;
    const v = (v0[1] * dx - v0[0] * dy) / det;
    if (u >= 0 && v >= 0) {
      const x = p0[0] + v0[0] * u;
      const y = p0[1] + v0[1] * u;
      // console.log(p0, p1, u, v, x, y);
      return x >= min && x <= max && y >= min && y <= max;
    }
  }
  return false;
}

function puzzle1() {
  // const min = 7
  // const max = 27;
  const min = 200000000000000;
  const max = 400000000000000;
  let num = 0;
  for (let i = 0; i < rays.length - 1; i++) {
    const { p: p0, v: v0} = rays[i];
    for (let j = i +1; j < rays.length; j++) {
      const r1 = rays[j];
      if (ray_intersect_2d(p0, v0, r1.p, r1.v, min, max)) {
        num++;
      }
    }
  }
  return num;
}



function puzzle2() {
}

console.log('puzzle 1:', puzzle1()); // 13754
console.log('puzzle 2:', puzzle2());

