import * as utils from '../../utils.js';

function puzzle1(pos) {
  pos[0]--;
  pos[1]--;
  let score = [0, 0];
  let p = 0;
  let d = 1;
  let max = 0;
  let count = 0;
  while (max < 1000) {
    let roll = d;
    d = (d + 1) % 100;
    roll += d;
    d = (d + 1) % 100;
    roll += d;
    d = (d + 1) % 100;
    count += 3;
    pos[p] = (pos[p] + roll) % 10;
    score[p] += pos[p] + 1;
    max = Math.max(score[p]);
    p = (p + 1) % 2;
  }
  return score[p] * count;
}

function hash(turn, p0, p1, s0, s1) {
  // pos: 0..9
  // score: 0..21
  // turn: 0..1
  return turn
    + 10 * p0
    + 100 * p1
    + 1000 * s0
    + 100000 * s1
}

function puzzle2(pos0, pos1) {
  const ROLLS = [  // roll, num
    [3,1], [4,3], [5,6], [6,7], [7,6], [8,3], [9,1],
  ]

  const confs = new Map();

  let p0Score = 0;
  let p1Score = 0;

  const add = (t, p0, p1, s0, s1, count) => {
    if (s0 >= 21) {
      p0Score += count;
      return;
    }
    if (s1 >= 21) {
      p1Score += count;
      return;
    }
    const h = hash(t, p0, p1, s0, s1);
    const conf = confs.getOrSet(h, () => ({ h, t, p0, p1, s0, s1, u: 0 }));
    conf.u += count;
  }

  // add the initial configuration fin the 1. universe
  add(0, pos0 - 1, pos1 -1, 0, 0, 1);

  // where there are still configurations
  while (confs.size) {
    // pick one
    const [key, conf] = confs.entries().next().value;
    confs.delete(key);
    const { t, p0, p1, s0, s1, u } = conf;

    // create 27 new universes...
    const p = t ? p1 : p0;
    const nt = 1 - t;
    for (const [roll, num] of ROLLS) {
      const np = (p + roll) % 10;
      if (t) {
        add(nt, p0, np, s0, s1 + np + 1, num * u);
      } else {
        add(nt, np, p1, s0 + np + 1, s1, num * u);
      }
    }
  }
  return Math.max(p0Score, p1Score);
}
console.log('puzzle 1:', puzzle1([4 , 6]));
console.log('puzzle 2:', puzzle2(4 , 6));
