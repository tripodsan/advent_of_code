

/*
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */
import v8 from 'v8';
import { vec2 } from './vec2.js';
import { Heap } from 'heap-js';


export class Grid {
  /**
   * Returns a heuristic function for the A* algorithm that calculates the value based on the
   * manhatten distance from the cell to the goal.
   * @param {vec2} goal
   * @returns {function(*): *}
   */
  static h_manhatten(goal) {
    return (cell) => {
      const dx = cell.v[0] - goal[0];
      const dy = cell.v[1] - goal[1];
      return Math.abs(dx) + Math.abs(dy);
    }
  }

  constructor(dim = 2) {
    this._g = {};
    this.dim = dim;
    this.min = new Array(dim).fill(Number.MAX_SAFE_INTEGER);
    this.max = new Array(dim).fill(Number.MIN_SAFE_INTEGER);
  }

  init(str, fn) {
    str
      .split('\n')
      .map((s) => s.trim())
      .filter((s) => !!s)
      .forEach((line, y) => {
        line.split('').forEach((c, x) => {
          const dat = fn(x, y, c);
          if (dat) {
            this.put([x, y], dat);
          }
        });
      })
    return this;
  }

  key_string(v) {
    return v.join(':');
  }
  key(v) {
    // assume dim = 2
    const v0 = BigInt(v[0]);
    const v1 = BigInt(v[1]);
    const k0 = v0 >= 0 ? v0 * 2n : - v0 * 2n - 1n;
    const k1 = v1 >= 0 ? v1 * 2n : - v1 * 2n - 1n;
    return (k0 + k1) * (k0 + k1 + 1n) / 2n + k1;
  }

  put(v, data = {}) {
    if (typeof data === 'string') {
      data = {
        c: data,
      }
    }
    const key = this.touch(v);
    return this._g[key] = {
      v: [...v],
      ...data,
    };
  }

  touch(v) {
    const key = this.key(v);
    for (let p = 0; p < v.length; p ++) {
      this.min[p] = Math.min(this.min[p], v[p]);
      this.max[p] = Math.max(this.max[p], v[p]);
    }
    return key;
  }

  del(v) {
    const key = this.key(v);
    delete this._g[key];
  }

  get(v) {
    return this._g[this.key(v)];
  }

  getOrSet(v, fn, up) {
    const key = this.touch(v);
    let d = this._g[key];
    if (!d) {
      d = {
        v: Array.from(v),
        ...fn(),
      };
      this._g[key] = d;
    } else if (up) {
      d = up(d);
    }
    return d;
  }

  size() {
    return this.values().length;
  }

  span(dim) {
    return this.max[dim] - this.min[dim] + 1;
  }

  area() {
    let s = 1;
    for (let i = 0; i < this.dim; i++) {
      s *= this.span(i);
    }
    return s;
  }



  values() {
    return Object.values(this._g);
  }

  trim() {
    this.min = new Array(this.dim).fill(Number.MAX_SAFE_INTEGER);
    this.max = new Array(this.dim).fill(Number.MIN_SAFE_INTEGER);
    for (const { v } of this.values()) {
      this.touch(v);
    }
  }

  *scan() {
    const min = [...this.min];
    const max = [...this.max];
    for (const v of rangedCounter(min, max)) {
      yield v;
    }
  }

  *neighboursV(pos) {
    const SIGN = [1, -1];
    for (let d = 0; d < this.dim; d++) {
      for (const s of SIGN) {
        const v = [...pos];
        v[d] += s;
        yield v;
      }
    }
  }


  *neighbours(pos, cond = (c) => !!c) {
    for (const v of this.neighboursV(pos)) {
      const c = this.get(v);
      if (cond(c)) {
        yield c;
      }
    }
  }

  numNeighbours(pos, cond = (c) => !!c) {
    let s = 0;
    for (const n of this.neighbours(pos, cond)) {
      s++;
    }
    return s;
  }

  dump(pos, draw) {
    const sep = pos === undefined ? '' : ' ';
    for (let y = this.min[1]; y <= this.max[1]; y++) {
      const row = [];
      let delim = ' ';
      for (let x = this.min[0]; x <= this.max[0]; x++) {
        if (pos && pos[0] === x && pos[1] === y) {
          row.push('[');
          delim = sep;
        } else {
          row.push(delim);
          delim = sep;
        }
        const cell = this.get([x, y]);
        if (cell) {
          row.push(draw ? draw(cell, [x, y]) : '#');
        } else {
          row.push(draw ? draw(null, [x, y]) : '.');
        }
      }
      console.log(row.join(''));
    }
  }

  /**
   * A* finds a path from start to goal.
   * h is the heuristic function. h(n) estimates the cost to reach goal from node n.
   * @param {vec2} start
   * @param {vec2} goal
   * @param {function} d distance function from current to neighbour cell.
   * @param {function} h
   * @returns {Array<Cell>}
   */
  aStar(start, goal, d, h = Grid.h_manhatten(goal)) {
    // ensure unique start end end vector
    const beg = this.get(start);
    const end = this.get(goal);

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
      for (const cell of openSet.values()) {
        const f = fScore.get(cell) ?? Number.MAX_SAFE_INTEGER;
        if (f < low) {
          low = f;
          current = cell;
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
      for (const neighbor of this.neighbours(current.v)) {
        // d(current,neighbor) is the weight of the edge from current to neighbor
        const dist = d(current, neighbor);
        if (dist <= 0) {
          continue;
        }

        // tentative_gScore is the distance from start to the neighbor through current
        let tentative_gScore = Number.MAX_SAFE_INTEGER;
        if (gScore.has(current)) {
          tentative_gScore = gScore.get(current) + dist;
        }
        const scoreNeighbor = gScore.get(neighbor) ?? Number.MAX_SAFE_INTEGER;

        // This path to neighbor is better than any previous one. Record it!
        if (tentative_gScore < scoreNeighbor) {
          cameFrom.set(neighbor, current);
          gScore.set(neighbor, tentative_gScore);
          fScore.set(neighbor, tentative_gScore + h(neighbor));
          openSet.add(neighbor);
        }
      }
    }
    // Open set is empty but goal was never reached
    return [];
  }

  dijkstra(start, check, dist) {
    const visited = new Set();
    const q = new Heap((e0, e1) => e0.d - e1.d);
    const beg = this.get(start);
    visited.add(beg)
    q.add({ d: 0, c: beg });

    while (q.size()) {
      const { d, c } = q.pop();
      if (check(c)) {
        return d;
      }
      for (const n of this.neighbours(c.v)) {
        if (!visited.has(n)) {
          const v = dist(c, n);
          if (v > 0) {
            visited.add(n);
            q.add({ d: d + v, c: n });
          }
        }
      }
    }
    return -1;
  }

  line(p0, p1, d) {
    const dx = p1[0] - p0[0];
    const dy = p1[1] - p0[1];
    const p = [p0[0], p0[1]];
    if (dx === 0) {
      while (p[1] !== p1[1]) {
        this.put(p, d);
        p[1] += Math.sign(dy);
      }
      this.put(p, d);
    } else if (dy === 0) {
      while (p[0] !== p1[0]) {
        this.put(p, d);
        p[0] += Math.sign(dx);
      }
      this.put(p, d);
    } else {
      throw Error('no implemented');
    }
  }

  fill(start, cond = (c) => !c, fn = (v) => this.put(v)) {
    const min = this.min;
    const max = this.max;
    const stack = [start];
    while (stack.length) {
      const v = stack.pop();
      fn(v);
      for (const n of this.neighboursV(v)) {
        if (n[0] >= min[0] && n[0] <= max[0]
          && n[1] >= min[1] && n[1] <= max[1]
          && n[2] >= min[2] && n[2] <= max[2]
          && cond(this.get(n))) {
          stack.push(n);
        }
      }
    }
  }
}

Set.prototype.intersect = function(other) {
  const ret = new Set();
  for (let k of this) {
    if (other.has(k)) {
      ret.add(k);
    }
  }
  return ret;
}

Set.prototype.diff = function(other) {
  const ret = new Set();
  for (let k of this) {
    if (!other.has(k)) {
      ret.add(k);
    }
  }
  for (let k of other) {
    if (!this.has(k)) {
      ret.add(k);
    }
  }
  return ret;
}

Set.prototype.first = function() {
  if (this.size === 0) {
    return undefined;
  }
  return this.keys().next().value;
}

Map.prototype.getOrSet = function(key, fnOrValue) {
  if (this.has(key)) {
    return this.get(key);
  }
  const value = (typeof fnOrValue === 'function') ? fnOrValue(key) : fnOrValue;
  this.set(key, value);
  return value;
}

Array.prototype.sum = function() {
  return this.reduce((s, e) => s + e, 0);
}

Array.prototype.max = function() {
  return this.reduce((p, e, idx) => {
    if (e > p.max) {
      p.max = e;
      p.idx = idx;
    }
    return p;
  }, { max: Number.MIN_SAFE_INTEGER, idx: -1 });
}

Array.prototype.min = function() {
  return this.reduce((p, e, idx) => {
    if (e < p.min) {
      p.min = e;
      p.idx = idx;
    }
    return p;
  }, { min: Number.MAX_SAFE_INTEGER, idx: -1 });
}

Array.init = function(size, value) {
  const a = new Array(size);
  if (typeof value === 'function') {
    for (let i = 0; i < size; i++) {
      a[i] = value(i);
    }
  } else {
    a.fill(value);
  }
  return a;
}

Array.prototype.delete = function(item) {
  const idx = this.indexOf(item);
  if (idx < 0) {
    return false;
  }
  this.splice(idx, 1);
  return true;
}

Array.prototype.equals = function(other) {
  if (this === other) {
    return true;
  }
  if (!Array.isArray(other)) {
    return false;
  }
  if (this.length !== other.length) {
    return false;
  }
  for (let i = 0; i < this.length; i++) {
    if (this[i] !== other[i]) {
      return false;
    }
  }
  return true;
}

export const clone = (o) => v8.deserialize(v8.serialize(o));

/**
 * Extracts the characters from the line array and transposes them.
 */
function ocr_extract(lines) {
  // make canonical
  lines = lines.map((l) => l.split('').map((c) => (c === ' ' || c === '.') ? '.' : '#'));
  const BLANK = '.'.repeat(lines.length);
  const chars = [];
  let wasBlank = true;
  for (let x = 0; x < lines[0].length; x += 1) {
    // transpose
    const col = lines.map((line) => line[x]).join('');
    const blank = col === BLANK;
    if (!blank) {
      if (wasBlank) {
        chars.push('');
      }
      chars[chars.length - 1] += col + '\n';
    }
    wasBlank = blank;
  }
  return chars;
}

const CHARSET = {
  map: 'ABCEFGHIJKLOPRSUYZ',
  chars: ocr_extract([
    '.##..###...##..####.####..##..#..#.###...##.#..#.#.....##..###..###...###.#..#.#...#.####',
    '#..#.#..#.#..#.#....#....#..#.#..#..#.....#.#.#..#....#..#.#..#.#..#.#....#..#.#...#....#',
    '#..#.###..#....###..###..#....####..#.....#.##...#....#..#.#..#.#..#.#....#..#..#.#....#.',
    '####.#..#.#....#....#....#.##.#..#..#.....#.#.#..#....#..#.###..###...##..#..#...#....#..',
    '#..#.#..#.#..#.#....#....#..#.#..#..#..#..#.#.#..#....#..#.#....#.#.....#.#..#...#...#...',
    '#..#.###...##..####.#.....###.#..#.###..##..#..#.####..##..#....#..#.###...##....#...####',
  ]),
}
CHARSET.chars = CHARSET.chars.reduce((obj, str, idx) => ({...obj, [str]:CHARSET.map[idx]}), {})

export function ocr(lines) {
  return ocr_extract(lines).map((c) => CHARSET.chars[c] || '?').join('');
}


/**
 * Calculates the distance map of the given graph using the floyd-warshall algorithm.
 * @param {Map<any, Map<any, number>>} graph
 */
export function shortestPath(graph) {
  const keys = [...graph.keys()];
  // initialize all distances with infinity
  const distMap = new Map(
    keys.map(k => [
      k,
      new Map(keys.map(l => [l, Number.MAX_SAFE_INTEGER])),
    ])
  );
  // and the given ones
  for (const u of keys) {
    distMap.get(u).set(u, 0);
    for (const [v, d] of graph.get(u)) {
      distMap.get(u).set(v, d);
    }
  }
  for (const k of keys) {
    const rowP= /** @type Map<any, number> */ distMap.get(k);
    for (const i of keys) {
      const row = /** @type Map<any, number> */ distMap.get(i);
      for (const j of keys) {
        row.set(j, Math.min(row.get(j), row.get(k) + rowP.get(j)))
      }
    }
  }
  return distMap;
}

function testShortestPath() {
  const graph = new Map();
  graph.set('A', new Map([['B', 3], ['D', 5]]));
  graph.set('B', new Map([['A', 2], ['D', 4]]));
  graph.set('C', new Map([['B', 1]]));
  graph.set('D', new Map([['C', 2]]));
  console.log(shortestPath(graph));
  /*
    Map(4) {
      'A' => Map(4) { 'A' => 0, 'B' => 3, 'C' => 7, 'D' => 5 },
      'B' => Map(4) { 'A' => 2, 'B' => 0, 'C' => 6, 'D' => 4 },
      'C' => Map(4) { 'A' => 3, 'B' => 1, 'C' => 0, 'D' => 5 },
      'D' => Map(4) { 'A' => 5, 'B' => 3, 'C' => 2, 'D' => 0 }
   */
}
