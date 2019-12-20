const fs = require('fs');

const data = fs.readFileSync('./input_1.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim());

const W = data[0].length;
const grid = data.reduce((a, r) => {
  a.push(...r.split(''));
  return a;
}, []);

function renderGrid(grid) {
  grid.forEach((c, idx) => {
    if (idx > 0 && idx % W === 0) {
      process.stdout.write('\n');
    }
    process.stdout.write(c);
  });
  process.stdout.write('\n');
}

const DIRS = [
  -W,
  1,
  W,
  -1,
];

function puzzle1() {
  renderGrid(grid);

  const map = {};
  const allKeys = ['@'];
  grid.forEach((c, idx) => {
    if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '@') {
      map[c] = {
        nam: c,
        pos: idx,
        x: idx % W,
        y: Math.floor(idx/W),
        dst: {},
      };
      if (c >= 'a' && c <= 'z') {
        allKeys.push(c);
      }
    }
  });
  allKeys.sort();

  function reconstruct_path(cameFrom, current) {
    let dist = 0;
    const total_path = [grid[current]];
    while (cameFrom[current]) {
      const from = cameFrom[current];
      dist++;
      current = from;
      const c = grid[current];
      if (c !== '.') {
        total_path.unshift(grid[current]);
      }
    }
    total_path.push(dist);
    return total_path
  }

  // A* finds a path from start to goal.
  // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
  function A_Star(start, goal, h) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // openSet := {start}
    const openSet = {};
    openSet[start] = true;

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
    // cameFrom := an empty map
    const cameFrom = {};

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    const gScore = {}; //:= map with default value of Infinity
    gScore[start] = 0;

    // For node n, fScore[n] := gScore[n] + h(n).
    const fScore = {}; //:= map with default value of Infinity
    fScore[start] = h(start);

    while (Object.keys(openSet).length > 0) { // openSet is not empty
      // current := the node in openSet having the lowest fScore[] value
      let current = '';
      let low = Number.MAX_SAFE_INTEGER;
      Object.keys(openSet).forEach((k) => {
        if (fScore[k] !== undefined && fScore[k] < low) {
          low = fScore[k];
          current = +k;
        }
      });
      if (!current) {
        return [];
      }

      if (current === goal) {
        return reconstruct_path(cameFrom, current);
      }

      delete openSet[current]; /// openSet.Remove(current)
      /// for each neighbor of current
      // console.log('current', current);
      DIRS.forEach((dir) => {
        const neighbor = current + dir;
        const c = grid[neighbor];
        if (c === '#') {
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
          fScore[neighbor] = gScore[neighbor] + h(neighbor);
          openSet[neighbor] = true;
        }
      });
    }
    // Open set is empty but goal was never reached
    return [];
  }

  function getPath(start, goal) {
    const startIdx = map[start].pos;
    const goalIdx = map[goal].pos;
    const x = goalIdx%W;
    const y = Math.floor(goalIdx/W);
    return A_Star(startIdx, goalIdx, (idx) => {
      const dx = x - idx%W;
      const dy = y - Math.floor(idx/W);
      return Math.abs(dx) + Math.abs(dy);
    });
  }

  // calculate all paths
  allKeys.forEach((k0) => {
    allKeys.forEach((k1) => {
      if (k0 === k1) {
        // ignore
      } else if (k1 < k0) {
        // already computed reverse
        map[k0].dst[k1] = {
          d: map[k1].dst[k0].d,
          p: Array.from(map[k1].dst[k0].p).reverse(),
        };
      } else {
        const p = getPath(k0, k1);
        map[k0].dst[k1] = {
          d: p.pop(),
          p,
        }
      }
    });
  });

  //------------------------------------------------------------------------------------------------

  const A_LOWER = 'a'.charCodeAt(0);
  const Z_LOWER = 'z'.charCodeAt(0);
  const A_UPPER = 'A'.charCodeAt(0);
  const Z_UPPER = 'Z'.charCodeAt(0);

  function collectKey(mapKey, key) {
    const idx = 2+key.charCodeAt(0)-A_LOWER;
    return mapKey.substring(0, idx) + key + mapKey.substring(idx + 1);
  }
  function hasKey(mapKey, key) {
    const c = key.charCodeAt(0);
    if (c >= A_UPPER && c <= Z_UPPER) {
      return mapKey[2+c - A_UPPER] !== '.';
    } else {
      return mapKey[2+c - A_LOWER] !== '.';
    }
  }

  function getReachable(mapKey) {
    const key = mapKey[0];
    const ret = [];
    Object.values(map[key].dst).forEach(({ d, p }) => {
      for (let i = 1; i < p.length; i++) {
        const c = p[i];
        if (c === '@') {
          continue;
        }
        if (c >= 'a' && c <= 'z') {
          if (i === p.length - 1) {
            let newKey = collectKey(mapKey, c);
            newKey = `${c}-${newKey.substring(2)}`;
            ret.push([newKey, d]);
          }
          break;
        } else {
          if (!hasKey(mapKey, c)) {
            break;
          }
        }
      }
    });
    // console.log('reachable', mapKey, ret);
    return ret;
  }

  function reconstruct_path2(cameFrom, current, dist) {
    const total_path = [current.charAt(0)];
    while (cameFrom[current]) {
      const from = cameFrom[current];
      current = from;
      total_path.unshift(current.charAt(0));
    }
    total_path.push(dist);
    return total_path
  }

  // A* finds a path from start to goal.
  // h is the heuristic function. h(n) estimates the cost to reach goal from node n.
  function A_Star2(start, h) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    // openSet := {start}
    const openSet = {};
    openSet[start] = true;

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start to n currently known.
    // cameFrom := an empty map
    const cameFrom = {};

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    const gScore = {}; //:= map with default value of Infinity
    gScore[start] = 0;

    // For node n, fScore[n] := gScore[n] + h(n).
    const fScore = {}; //:= map with default value of Infinity
    fScore[start] = h(start);

    let count = 0;
    while (Object.keys(openSet).length > 0) { // openSet is not empty
      // current := the node in openSet having the lowest fScore[] value
      let current = '';
      let low = Number.MAX_SAFE_INTEGER;
      Object.keys(openSet).forEach((k) => {
        if (fScore[k] !== undefined && fScore[k] < low) {
          low = fScore[k];
          current = k;
        }
      });
      if (!current) {
        return [];
      }

      if (count++ % 10000 === 0) {
        console.log(current, Object.keys(openSet).length, Object.keys(openSet).length);
      }

      if (current.indexOf('.') < 0) {
        console.log('num combinations', Object.keys(openSet).length);
        return reconstruct_path2(cameFrom, current, gScore[current]);
      }

      delete openSet[current]; /// openSet.Remove(current)
      /// for each neighbor of current
      // console.log('current', current);
      getReachable(current).forEach(([neighbor, dist]) => {
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
          fScore[neighbor] = gScore[neighbor] + h(neighbor);
          openSet[neighbor] = true;
        }
      });
    }
    // Open set is empty but goal was never reached
    return [];
  }

  const start = `@-${'.'.repeat(allKeys.length - 1)}`;
  console.log(start);
  const path = A_Star2(start, (n) => {
    return 1;
  });
  console.log(path);
}


puzzle1();

