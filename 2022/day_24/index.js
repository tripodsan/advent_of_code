import fs from 'fs';
import { kgv} from '../../utils.js';
import { Grid } from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n');

data.pop();
data.shift();

const W = data[0].length - 2;
const H = data.length;
const P = kgv(W,H);

console.log(`maze is ${W}x${H}. Period = ${P}`);

const DIRS = {
  '>': [1, 0],
  '<': [-1, 0],
  'v': [0, 1],
  '^': [0, -1],
}

const DIRS_V = [
  [0, 0],
  [1, 0],
  [-1, 0],
  [0, 1],
  [0, -1],
];

function charFromDir(v) {
  if (v[0] === 0) {
    return v[1] < 0 ? '^' : 'v';
  } else {
    return v[0] < 0 ? '<' : '>';
  }
}

function dump(g, z) {
  for (let y = 0; y < H; y++) {
    const row = [];
    for (let x = 0; x < W; x++) {
      const cell = g.get([x, y, z]);
      if (cell) {
        if (cell.h.length > 1) {
          row.push(cell.h.length);
        } else {
          row.push(cell.c);
        }
      } else {
        row.push('.');
      }
    }
    console.log(row.join(''));
  }
}

function parse() {
  const g = new Grid(3);
  const hs = [];
  data.forEach((line, y) => {
    line.split('').forEach((c, x) => {
      x--;
      const d = DIRS[c];
      if (x >= 0 && x < W && d) {
        g.put([x, y, 0], {
          c,
          h: [d],
        });
        hs.push({ x, y, d });
      }
    });
  })

  // console.log('----------------------', 0);
  // dump(g, 0);
  // propagate hurricanes
  for (let z = 1; z < P; z++) {
    for (const h of hs) {
      h.x = (h.x + h.d[0] + W) % W;
      h.y = (h.y + h.d[1] + H) % H;
      g.getOrSet([h.x, h.y, z], () => ({
        c: charFromDir(h),
        h: [h],
      }), (hc) => {
        hc.h.push(h);
      })
    }
    // console.log('----------------------', z);
    // dump(g, z);
  }
  return g;
}

function aStar(g, start, end) {
  const beg = g.put(start);
  const endX = end[0];
  const endY = end[1];

  const h = ({ v }) => {
    return Math.abs(v[0] - endX) + Math.abs(v[1] - endY);
  }

  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  const openSet = new Set();
  openSet.add(beg);

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
  const cameFrom = new Map();

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = new Map();
  gScore.set(beg, 0);

  // For node n, fScore[n] := gScore[n] + h(n).
  const fScore = new Map();
  fScore.set(beg, h(beg));

  while (openSet.size) { // openSet is not empty
    // current := the node in openSet having the lowest fScore[] value
    let current = null;
    let low = Number.MAX_SAFE_INTEGER;
    for (const c of openSet.values()) {
      const f = fScore.get(c) ?? Number.MAX_SAFE_INTEGER;
      if (f < low) {
        low = f;
        current = c;
      }
    }
    if (!current) {
      return [];
    }
    const { v } = current;

    if (v[0] === endX && v[1] === endY) {
      const total_path = [];
      do {
        total_path.unshift(current);
        current = cameFrom.get(current);
      } while (current);
      return total_path
    }

    openSet.delete(current);

    /// for each neighbor of current
    for (const dir of DIRS_V) {
      const xx = v[0] + dir[0];
      const yy = v[1] + dir[1];
      if ((xx < 0 || xx >= W || yy < 0 || yy >= H)
        && (xx !== 0 || yy !== -1)
        && (xx !== W - 1 || yy !== H)) {
        continue;
      }
      const vp = [xx, yy, (v[2] + 1) % P];
      let c = g.get(vp);
      if (c?.h) {
        continue;
      }
      if (!c) {
        c = g.put(vp);
      }

      // tentative_gScore is the distance from start to the neighbor through current
      let tentative_gScore = Number.MAX_SAFE_INTEGER;
      if (gScore.has(current)) {
        tentative_gScore = gScore.get(current) + 1;
      }
      const scoreNeighbor = gScore.get(c) ?? Number.MAX_SAFE_INTEGER;

      // This path to neighbor is better than any previous one. Record it!
      if (tentative_gScore < scoreNeighbor) {
        cameFrom.set(c, current);
        gScore.set(c, tentative_gScore);
        fScore.set(c, tentative_gScore + h(c));
        openSet.add(c);
      }
    }
  }
  // Open set is empty but goal was never reached
  return [];
}


function puzzle1() {
  console.log('simulating hurricanes...')
  const g = parse();
  console.log('done.')
  return {
    g,
    path: aStar(g, [0, -1, 0], [W-1, H-1]),
  };
}

function puzzle2() {
  const { g, path } = puzzle1();
  let m = path.length;
  const end = path.pop();
  const path1 = aStar(g, [W - 1, H, (end.v[2] + 1) % P], [0, 0]);
  m += path1.length;
  const end1 = path1.pop();
  const path2 = aStar(g, [0, -1, (end1.v[2] + 1) % P], [W-1, H-1]);
  m += path2.length;
  return m;
}

// console.log('puzzle 1 : ', puzzle1().path.length);  // 314
console.log('puzzle 2 : ', puzzle2()); // !894
