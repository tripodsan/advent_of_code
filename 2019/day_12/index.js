
const input = [
  [1, 3, -11],
  [17, -10, -8],
  [-1, -15, 2],
  [12, -4, -4],
];
// const input = [
// [-1,0,   2],
// [2, -10, -7],
// [4, -8,  8],
// [3, 5,   -1],
// ]

const AXIS = [0, 1, 2];

function ggt(a, b) {
  for (;;) {
    const d = a - b;
    if (d>0) {
      a = d;
    } else if (d < 0) {
      a = b;
      b = - d;
    } else {
      return a;
    }
  }
}
function kgv(a, b) {
  return (a*b) / ggt(a,b);
}

function step(moons, x) {
  moons.forEach((m0) => {
    moons.forEach((m1) => {
      if (m0 !== m1) {
        m0.v[x] += Math.sign(m1.p[x] - m0.p[x]);
      }
    })
  });
  moons.forEach((m) => {
    m.p[x] += m.v[x];
  });
}

function init() {
  return input.map((p) => ({
    p: [...p],
    v: [0, 0, 0]
  }))
}

function puzzle2() {
  const moons = init();
  let p = 0;
  AXIS.forEach((x) => {
    let t = 0;
    do {
      step(moons, x);
      t++;
    } while (moons.findIndex((m, idx) => (m.p[x] !== input[idx][x] || m.v[x] !== 0)) >= 0);
    p = p === 0 ? t : kgv(t, p);
  });
  console.log('result 2: ', p);
}

function puzzle1() {
  const moons = init();
  for (let t = 0; t < 1000; t++) {
    AXIS.forEach((x) => step(moons, x));
  }
  const e = moons.reduce((c, m) => {
    const pot = AXIS.reduce((s, x) => s + Math.abs(m.p[x]), 0);
    const kin = AXIS.reduce((s, x) => s + Math.abs(m.v[x]), 0);
    return c + pot * kin;
  }, 0);
  console.log('result 1: ', e);
}

puzzle1();
puzzle2();
