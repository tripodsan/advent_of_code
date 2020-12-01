const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n');

const H = data.length + 1;
const W = (data.reduce((m, line) => Math.max(m, line.length), 0)) + 1;
const DIRS = [
  -W,
  1,
  W,
  -1,
];

const grid = new Array(H*W).fill(' ');
data.forEach((row, y) => {
  row.split('').forEach((c, x) => {
    const idx = y*W+x;
    grid[idx] = c;
  })
});


const portals = {};
const portalsByIdx = {};
let start = 0;
let goal = 0;

function addPortal(name, idx, delta) {
  let p = portals[name];
  if (!p) {
    p = {
      name,
    };
    portals[name] = p;
  }
  if (p.i0) {
    p.i1 = idx + delta;
  } else {
    p.i0 = idx + delta;
  }
  if (name === 'AA') {
    start = idx + delta;
    grid[idx] = '#';
  } else if (name === 'ZZ') {
    goal = idx + delta;
    grid[idx] = '#';
  } else {
    grid[idx + delta] = '@';
    portalsByIdx[idx + delta] = p;
  }
}

const uppercase = (c) => (c >= 'A' && c <= 'Z');

// calculate portals
grid.forEach((c, idx) => {
  if (uppercase(c)) {
    const c1 = grid[idx+1];
    if (uppercase(c1)) {
      const name = `${c}${c1}`;
      if (grid[idx + 2] === '.') {
        addPortal(name, idx + 1, 1);
      } else {
        addPortal(name, idx, -1);
      }
    }
    const c2 = grid[idx+W];
    if (uppercase(c2)) {
      const name = `${c}${c2}`;
      if (grid[idx + 2*W] === '.') {
        addPortal(name, idx + W, W);
      } else {
        addPortal(name, idx, -W);
      }
    }
  }
});

function renderGrid(grid) {
  grid.forEach((c, idx) => {
    if (idx > 0 && idx % W === 0) {
      process.stdout.write('\n');
    }
    process.stdout.write(c);
  });
  process.stdout.write('\n');
}

class PriorityQueue {
  constructor(defaultPrio = Number.MAX_SAFE_INTEGER) {
    this._defaultPrio = defaultPrio;
    this._first = { prev: null, };
    this._last = { next: null, };
    this._first.next = this._last;
    this._last.prev = this._first;
    this._entries = new Map();
  }

  add(item, prio = this._defaultPrio) {
    let e = this._entries.get(item);
    if (!e) {
      e = {
        item,
        next: this._last,
        prev: this._last.prev,
      };
      e.prev.next = e;
      e.next.prev = e;
      this._entries.set(item, e);
    }
    this._setPrio(e, prio);
  }

  getPrio(item) {
    const e = this._entries.get(item);
    return e ? e.prio : this._defaultPrio;
  }

  _setPrio(e, prio) {
    e.prio = prio;
    while (e.next !== this._last && prio > e.next.prio) {
      e.prev.next = e.next;
      e.next.prev = e.prev;
      const after = e.next;
      e.prev = after;
      e.next = after.next;
      e.next.prev = e;
      e.prev.next = e;
    }
    while (e.prev !== this._first && prio < e.prev.prio) {
      e.prev.next = e.next;
      e.next.prev = e.prev;
      const before = e.prev;
      e.next = before;
      e.prev = before.prev;
      e.next.prev = e;
      e.prev.next = e;
    }
  }

  setPrio(item, prio) {
    const e = this._entries.get(item);
    if (e) {
      this._setPrio(e, prio);
    }
  }

  remove(item) {
    const e = this._entries.get(item);
    if (!e) {
      return undefined;
    }
    this._entries.delete(item);
    e.prev.next = e.next;
    e.next.prev = e.prev;
    return e.value;
  }

  first() {
    if (this._first.next === this._last) {
      return undefined;
    }
    return this._first.next.item;
  }

  get size() {
    return this._entries.size;
  }
}

function reconstruct_path(cameFrom, current, dist) {
  const total_path = ['AA'];
  while (cameFrom[current]) {
    const from = cameFrom[current];
    if (portalsByIdx[from]) {
      total_path.unshift(portalsByIdx[from].name);
    }
    current = from;
  }
  total_path.push('ZZ', dist);
  return total_path
}

// A* finds a path from start to goal.
// h is the heuristic function. h(n) estimates the cost to reach goal from node n.
function A_Star(start, goal, h) {
  // The set of discovered nodes that may need to be (re-)expanded.
  // Initially, only the start node is known.
  const openSet = new PriorityQueue();
  openSet.add(start, h(start));

  // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
  // to n currently known.
  const cameFrom = {};

  // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
  const gScore = {};
  gScore[start] = 0;

  while (openSet.size) { // openSet is not empty
    // current := the node in openSet having the lowest fScore[] value
    let current = openSet.first();
    if (!current) {
      return [];
    }
    // if we reached the goal, finish
    if (current === goal) {
      return reconstruct_path(cameFrom, current, gScore[current]);
    }
    openSet.remove(current);

    // get the 4 direct neighbors
    const nbrs = DIRS.map((d) => current + d);

    // if we reached a portal, the other side is also a neighbor
    if (grid[current] === '@') {
      const p = portalsByIdx[current];
      if (p.i0 === current) {
        nbrs.push(p.i1);
      } else {
        nbrs.push(p.i0);
      }
    }

    // for each neighbor
    nbrs.forEach((neighbor) => {
      const c = grid[neighbor];
      if (c !== '.' && c !== '@') {
        return;
      }
      const dist = 1;
      // d(current,neighbor) is the weight of the edge from current to neighbor
      // tentative_gScore is the distance from start to the neighbor through current
      // tentative_gScore := gScore[current] + d(current, neighbor)
      let tentative_gScore = Number.MAX_SAFE_INTEGER;
      if (gScore[current] !== undefined) {
        tentative_gScore = gScore[current] + dist;
      }
      let scoreNeighbor = gScore[neighbor];
      if (scoreNeighbor === undefined) {
        scoreNeighbor = Number.MAX_SAFE_INTEGER;
      }
      if (tentative_gScore < scoreNeighbor) {
        // This path to neighbor is better than any previous one. Record it!
        cameFrom[neighbor] = current;
        gScore[neighbor] = tentative_gScore;
        openSet.add(neighbor, tentative_gScore + h(neighbor));
      }
    });
  }
  // Open set is empty but goal was never reached
  return [];
}

function puzzle1() {
  renderGrid(grid);
  console.log(portals);
  const path = A_Star(start, goal, (idx) => {
    return 1;
  });

  console.log(path);
  console.log('result 1: ', path.pop());
}

puzzle1();
