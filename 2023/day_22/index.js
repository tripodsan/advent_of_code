import fs from 'fs';

/**
 * @typedef Vec
 *
 * @typedef Brick
 * @property {Vec} p0
 * @property {Vec} p1
 */

function parse() {
  const bricks = fs.readFileSync('./input.txt', 'utf-8')
    .trim()
    .split('\n')
    .map((line, id) => {
      // 0,1,6~2,1,6
      const [x0, y0, z0, x1, y1, z1] = line.split(/[,~]+/);
      return /** @type Brick */ {
        id: String.fromCharCode(id + 65),
        p0: /** @type Vec */ [parseInt(x0), parseInt(y0), parseInt(z0)],
        p1: /** @type Vec */ [parseInt(x1), parseInt(y1), parseInt(z1)],
        supported_by: new Set(),
        supports: new Set(),
      };
    });
  // sort by bottom Z
  return bricks.sort((b0, b1) => b0.p0[2] - b1.p0[2]);
}

function between(p, b, a) {
  return p >= b.p0[a] && p <= b.p1[a];
}

function intersect(b0, b1, a) {
  return between(b0.p0[a], b1, a)
    || between(b0.p1[a], b1, a)
    || between(b1.p0[a], b0, a)
    || between(b1.p1[a], b0, a)
}

function dump(b) {
  return `${b.id}: ${b.p0}-${b.p1}`;
}

function solve() {
  const bricks = parse();
  // connect all bricks
  for (const b0 of bricks) {
    for (const b1 of bricks) {
      if (b0.p1[2] < b1.p0[2] && intersect(b0, b1, 0) && intersect(b0, b1, 1)) {
        // console.log(`${dump(b0)} supports ${dump(b1)}: ${b1.p0[2] - b0.p1[2]}`);
        b0.supports.add(b1);
        b1.supported_by.add(b0);
      }
    }
  }

  // now collapse bricks
  for (const b1 of bricks) {
    let d = b1.p0[2] - 1;
    if (b1.supported_by.size > 0) {
      // find minimal support distance
      d = Number.MAX_SAFE_INTEGER;
      for (const b0 of b1.supported_by.values()) {
        d = Math.min(d, b1.p0[2] - b0.p1[2] - 1);
      }
    }
    // move brick down
    b1.p0[2] -= d;
    b1.p1[2] -= d;

    // remove supports not touching
    for (const b0 of b1.supported_by.values()) {
      if (b1.p0[2] - b0.p1[2] > 1) {
        b1.supported_by.delete(b0);
        b0.supports.delete(b1);
      }
    }
    // console.log(`${b1.id} supported by ${b1.supported_by.map((b) => b.id)}`);
  }

  // check which can be removed
  let num = 0;
  let total_fall = 0;
  for (const b0 of bricks) {
    // console.log(`${b0.id} supports ${b0.supports.map((b) => b.id)}`);

    // calc chain reaction
    const removed = new Set();
    const queue = [b0];
    while (queue.length) {
      const b1 = queue.shift();
      removed.add(b1.id);
      for (const b2 of b1.supports.values()) {
        if (!removed.has(b2.id)){
          let all_removed = true;
          for (const b3 of b2.supported_by.values()) {
            if (!removed.has(b3.id)) {
              all_removed = false;
              break;
            }
          }
          if (all_removed) {
            queue.push(b2);
          }
        }
      }
    }
    // console.log(removed, removed.size);
    const num_fall = removed.size - 1;
    if (num_fall === 0) {
      num++;
    } else {
      total_fall += num_fall;
    }
  }
  console.log('puzzle 1:', num); // 403
  console.log('puzzle 2:', total_fall); // 70189
}

solve();
