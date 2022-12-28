import fs from 'fs';
import '../../utils.js';

const CONFIG = {
  TEST: {
    ITEMS: [
      [0, 1], [0, 2],
    ],
    ITEM_NAMES: ['H', 'F'],
  },
  /*
  F3   .. .. .. .. .. .. .. .. .. ..
  F4   .. .. .. .. .. .. .. .. .. ..
  F2   PM .. IM .. .. .. .. .. .. ..
  F1 E .. PG .. IG TM TG RM RG CM CG
   */
  PUZZLE1: {
    ITEMS: [
      [1, 0], [1 ,0], [0, 0], [0, 0], [0, 0]
    ],
    ITEM_NAMES: ['P', 'I', 'T', 'R', 'C'],
  },
  PUZZLE2: {
    ITEMS: [
      [1, 0], [1 ,0], [0, 0], [0, 0], [0, 0], [0, 0], [0, 0]
    ],
    ITEM_NAMES: ['P', 'I', 'T', 'R', 'C', 'D', 'E'],
  },
}

const {
  ITEMS, ITEM_NAMES,
} = CONFIG.PUZZLE2;

function sort(items) {
  return items.sort((i0, i1) => {
    const c = i0[0] - i1[0];
    if (c) {
      return c;
    }
    return i0[1] - i1[1];
  });
}

function hash(items, e) {
  const v = [e];
  for (const i of items) {
    v.push(i[0]);
    v.push(i[1]);
  }
  return v.join('');
}


function valid(items, floor) {
  let m = 0;
  let g = 0;
  for (const i of items) {
    if (i[0] === floor && i[1] !== floor) {
      m++;
    } else if (i[1] === floor) {
      g++;
    }
  }
  return m === 0 || g === 0;
}

function unhash(cfg) {
  const e = cfg.charCodeAt(0) - 48;
  const items = [];
  for (let i = 1; i < cfg.length; i +=2) {
    items.push([
      cfg.charCodeAt(i) - 48,
      cfg.charCodeAt(i + 1) - 48,
    ]);
  }
  return {
    items,
    e,
  }
}

function* computeMoves(cfg) {
  // unhash
  const { items, e} = unhash(cfg);

  // get the items on the current floor
  const eItems = [];
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item[0] === e) {
      eItems.push([i, 0]);
    }
    if (item[1] === e) {
      eItems.push([i, 1]);
    }
  }

  // try to move a single item
  for (const i of eItems) {
    if (e > 0) {
      const itemsP = [...items];
      const v = [...itemsP[i[0]]];
      v[i[1]]--;
      itemsP[i[0]] = v;
      if (valid(itemsP, e) && valid(itemsP, e - 1)) {
        yield [itemsP, e - 1];
      }
    }
    if (e < 3) {
      const itemsP = [...items];
      const v = [...itemsP[i[0]]];
      v[i[1]]++;
      itemsP[i[0]] = v;
      if (valid(itemsP, i) && valid(itemsP, e + 1)) {
        yield [itemsP, e + 1];
      }
    }
  }

  // try to move 2 items
  for (let i = 0; i < eItems.length - 1; i++) {
    for (let j = i + 1; j < eItems.length; j++) {
      const ii = eItems[i];
      const jj = eItems[j];
      if (e > 0) {
        const itemsP = [...items];
        const v0 = [...itemsP[ii[0]]];
        const v1 = [...itemsP[jj[0]]];
        v0[ii[1]]--;
        v1[jj[1]]--;
        itemsP[ii[0]] = v0;
        itemsP[jj[0]] = v1;
        if (valid(itemsP, e) && valid(itemsP, e - 1)) {
          yield [itemsP, e - 1];
        }
      }
      if (e < 3) {
        const itemsP = [...items];
        const v0 = [...itemsP[ii[0]]];
        const v1 = [...itemsP[jj[0]]];
        v0[ii[1]]++;
        v1[jj[1]]++;
        itemsP[ii[0]] = v0;
        itemsP[jj[0]] = v1;
        if (valid(itemsP, e) && valid(itemsP, e + 1)) {
          yield [itemsP, e + 1];
        }
      }
    }
  }
}

function dump(items, e) {
  console.log('----------------------------------------------')
  for (let f = 0; f < 4; f++) {
    const r = [];
    r.push(`F${f} `);
    r.push(e === f ? 'E ' : '  ');
    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      r.push(item[0] === f ? `${ITEM_NAMES[i]}M ` : '.. ');
      r.push(item[1] === f ? `${ITEM_NAMES[i]}G ` : '.. ');
    }
    console.log(r.join(''));
  }
}

function aStar(items) {
  // heuristic: count how far every item is from the goal
  const h = (is) => {
    return is.reduce((sum, it) => sum + (3 - it[0]) + (3 - it[1]), 0);
  }

  // ensure unique start end end vector
  let e = 0;
  const beg = hash(items, e);

  const end = hash(items.map(() => [3, 3]), 3);

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
  fScore.set(beg, h(items));

  let iter = 0;
  while (openSet.size) { // openSet is not empty
    if (iter++ % 10000 === 0) {
      console.log(openSet.size);
    }
    // current := the node in openSet having the lowest fScore[] value
    let current = null;
    let low = Number.MAX_SAFE_INTEGER;
    for (const config of openSet.values()) {
      const f = fScore.get(config) ?? Number.MAX_SAFE_INTEGER;
      if (f < low) {
        low = f;
        current = config;
      }
    }
    if (!current) {
      return [];
    }

    if (current === end) {
      const total_path = [];
      do {
        total_path.unshift(current);
        current = cameFrom.get(current);
      } while (current);
      return total_path
    }

    openSet.delete(current);

    /// for each neighbor of current
    for (const [itemsP, eP] of computeMoves(current)) {
      sort(itemsP);
      // dump(itemsP, eP);
      // d(current,neighbor) is the weight of the edge from current to neighbor
      const move = hash(itemsP, eP);
      const dist = 1;

      // tentative_gScore is the distance from start to the neighbor through current
      let tentative_gScore = Number.MAX_SAFE_INTEGER;
      if (gScore.has(current)) {
        tentative_gScore = gScore.get(current) + dist;
      }
      const scoreNeighbor = gScore.get(move) ?? Number.MAX_SAFE_INTEGER;

      // This path to neighbor is better than any previous one. Record it!
      if (tentative_gScore < scoreNeighbor) {
        cameFrom.set(move, current);
        gScore.set(move, tentative_gScore);
        fScore.set(move, tentative_gScore + h(itemsP));
        openSet.add(move);
      }
    }
  }
  // Open set is empty but goal was never reached
  return [];
}

function puzzle1() {
  sort(ITEMS);
  dump(ITEMS, 0);
  const path = aStar(ITEMS);
  console.log(path);
  for (const p of path) {
    const { items, e} = unhash(p);
    dump(items, e);
  }
  return path.length - 1;
}

function puzzle2() {
}

console.log('puzzle 1: ', puzzle1()); // 47
console.log('puzzle 2: ', puzzle2()); // 71

