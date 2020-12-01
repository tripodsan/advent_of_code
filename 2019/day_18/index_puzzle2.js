/*
 * Copyright 2019 Adobe. All rights reserved.
 * This file is licensed to you under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License. You may obtain a copy
 * of the License at http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software distributed under
 * the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR REPRESENTATIONS
 * OF ANY KIND, either express or implied. See the License for the specific language
 * governing permissions and limitations under the License.
 */

const fs = require('fs');

const data = fs.readFileSync('./input_2.txt', 'utf-8')
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

function puzzle2() {
  renderGrid(grid);

  const map = {};
  const allKeys = ['1', '2', '3', '4'];
  let robot = 1;
  grid.forEach((c, idx) => {
    if (c >= 'a' && c <= 'z' || c >= 'A' && c <= 'Z' || c === '@') {
      if (c === '@') {
        c = `${robot++}`;
      }
      map[c] = {
        nam: c,
        pos: idx,
        x: idx % W,
        y: Math.floor(idx / W),
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
    const x = goalIdx % W;
    const y = Math.floor(goalIdx / W);
    return A_Star(startIdx, goalIdx, (idx) => {
      const dx = x - idx % W;
      const dy = y - Math.floor(idx / W);
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
        if (map[k1].dst[k0]) {
          map[k0].dst[k1] = {
            d: map[k1].dst[k0].d,
            p: Array.from(map[k1].dst[k0].p).reverse(),
          };
        }
      } else {
        const p = getPath(k0, k1);
        if (p.length > 0) {
          map[k0].dst[k1] = {
            d: p.pop(),
            p,
          }
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
    const idx = 5 + key.charCodeAt(0) - A_LOWER;
    return mapKey.substring(0, idx) + key + mapKey.substring(idx + 1);
  }

  function hasKey(mapKey, key) {
    const c = key.charCodeAt(0);
    if (c >= A_UPPER && c <= Z_UPPER) {
      return mapKey[5 + c - A_UPPER] !== '.';
    } else {
      return mapKey[5 + c - A_LOWER] !== '.';
    }
  }

  function getReachable(mapKey) {
    const ret = [];
    for (let r = 0; r < 4; r++) {
      const key = mapKey[r];
      Object.values(map[key].dst).forEach(({d, p}) => {
        for (let i = 1; i < p.length; i++) {
          const c = p[i];
          if (c === '1' || c === '2' || c === '3' || c === '4') {
            continue;
          }
          if (c >= 'a' && c <= 'z') {
            if (i === p.length - 1) {
              let newKey = collectKey(mapKey, c);
              newKey = newKey.substring(0, r) + c + newKey.substring(r + 1, 4) + '-' + newKey.substring(5);
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
    }
    // console.log('reachable', mapKey, ret);
    return ret;
  }

  function reconstruct_path2(cameFrom, current, dist) {
    const total_path = [current.charAt(0)];
    while (cameFrom.has(current)) {
      current = cameFrom.get(current);
      total_path.unshift(current.charAt(0));
    }
    total_path.push(dist);
    return total_path
  }

  // dijkstra finds a path from start to goal.
  function dijkstra(start) {
    // The set of discovered nodes that may need to be (re-)expanded.
    // Initially, only the start node is known.
    const openSet = new PriorityQueue();
    openSet.add(start);

    // For node n, cameFrom[n] is the node immediately preceding it on the cheapest path from start
    // to n currently known.
    const cameFrom = new Map();

    // For node n, gScore[n] is the cost of the cheapest path from start to n currently known.
    const gScore = new Map();
    gScore.set(start, 0);

    let count = 0;
    while (openSet.size > 0) { // openSet is not empty
      let current = openSet.first();
      if (!current) {
        return [];
      }

      if (count++ % 10000 === 0) {
        console.log(current, openSet.size, gScore.size);
      }

      if (current.indexOf('.') < 0) {
        console.log('num combinations', gScore.size);
        return reconstruct_path2(cameFrom, current, gScore.get(current));
      }

      openSet.remove(current);
      /// for each neighbor of current
      getReachable(current).forEach(([neighbor, dist]) => {
        // d(current,neighbor) is the weight of the edge from current to neighbor
        // tentative_gScore is the distance from start to the neighbor through current
        let tentative_gScore = Number.MAX_SAFE_INTEGER;
        const score = gScore.get(current);
        if (score !== undefined) {
          tentative_gScore = score + dist;
        }
        const scoreNeighbor = gScore.get(neighbor) || Number.MAX_SAFE_INTEGER;
        if (tentative_gScore < scoreNeighbor) {
          // This path to neighbor is better than any previous one. Record it!
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative_gScore);
          openSet.add(neighbor, tentative_gScore);
        }
      });
    }
    // Open set is empty but goal was never reached
    return [];
  }

  const start = `1234-${'.'.repeat(allKeys.length - 4)}`;
  console.log(start);
  const path = dijkstra(start);
  console.log(path);
}


puzzle2();
