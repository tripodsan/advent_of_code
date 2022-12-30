import crypto from 'crypto';
import { Heap } from 'heap-js';

const DIRS = [
  { n: 'U', dv: [0, -1] },
  { n: 'D', dv: [0,  1] },
  { n: 'L', dv: [-1,  0] },
  { n: 'R', dv: [1,  0] },
];

function solve(pwd) {
  const q = new Heap((e0, e1) => e0.d - e1.d);
  q.add({ d: 0, v:[0,0], p: '' });
  while (q.size()) {
    const { d, v, p } = q.pop();
    if (v[0] === 3 && v[1] === 3) {
      return p;
    }
    const hash = crypto
      .createHash('md5')
      .update(`${pwd}${p}`)
      .digest('hex')
      .slice(0, 4)
      .split('')
      .map((d) => parseInt(d, 16));
    for (let i = 0; i < 4; i++) {
      const { n, dv } = DIRS[i];
      const x = v[0] + dv[0];
      const y = v[1] + dv[1];
      if (x >= 0 && x <= 3 && y >= 0 && y <= 3 && hash[i] > 10) {
        const vp = [x, y];
        q.add({
          d: d + 1,
          v: vp,
          p: p + n,
        })
      }
    }
  }
  return -1;
}

function puzzle1() {
  // return solve('ihgpwlah');
  // return solve('kglvqrro');
  // return solve('ulqzkmiv');
  return solve('pvhmgsws');
}

function bfs(p, x, y) {
  if (x === 3 && y === 3) {
    return p;
  }
  const hash = crypto
    .createHash('md5')
    .update(p)
    .digest('hex')
    .slice(0, 4)
    .split('')
    .map((d) => parseInt(d, 16));
  let best = '';
  let bestLen = 0;
  for (let i = 0; i < 4; i++) {
    const { n, dv } = DIRS[i];
    const xx = x + dv[0];
    const yy = y + dv[1];
    if (xx >= 0 && xx <= 3 && yy >= 0 && yy <= 3 && hash[i] > 10) {
      const pp = bfs(p + n, xx, yy);
      if (pp.length > bestLen) {
        best = pp;
        bestLen = pp.length;
      }
    }
  }
  return best;
}

function puzzle2() {
  // return bfs('ihgpwlah', 0, 0).length - 8; // 370
  // return bfs('kglvqrro', 0, 0).length - 8; // 492
  // return bfs('ulqzkmiv', 0, 0).length - 8; // 830
  return bfs('pvhmgsws', 0, 0, true).length - 8; // 830
}

console.log('puzzle 1: ', puzzle1()); // DRRDRLDURD
console.log('puzzle 2: ', puzzle2()); // 618
