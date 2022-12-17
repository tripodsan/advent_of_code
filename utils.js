

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

export function permute(rest, prefix = []) {
  if (rest.length === 0) {
    return [prefix];
  }
  return (rest
      .map((x, index) => {
        const newRest = [...rest.slice(0, index), ...rest.slice(index + 1)];
        const newPrefix = [...prefix, x];
        return permute(newRest, newPrefix);
      })
      .reduce((flattened, arr) => [...flattened, ...arr], [])
  );
}

export function ggt(a, b) {
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
export function kgv(a, b) {
  return (a*b) / ggt(a,b);
}


export function simplify(a, b) {
  try {
    if (a === 0) {
      return [0, Math.sign(b)];
    }
    if (b === 0) {
      return [Math.sign(a), 0];
    }
    const d = ggt(Math.abs(a), Math.abs(b));
    return [a / d, b / d]
  } catch (e) {
    throw Error(`${a}/${b}: ${e}`);
  }
}

/* Iterative Function to calculate
   (x^y)%p in O(log y) */
export function power(x, y, p) {
  // Initialize result
  let res = BigInt(1);
  while (y > 0) {
    // If y is odd, multiply x
    // with result
    if (y%2n === 1n) {
      res = (res * x) % p;
      y--;
    }
    // y must be even now
    // y = y / 2
    y /= 2n;
    x = (x * x) % p;
  }
  return res;
}

export function egcd(a, b) {
  if (a === 0n)
    return [b, 0n, 1n];
  else {
    const [g, y, x] = egcd(b % a, a);
    return [g, x - (b / a) * y, y];
  }
}

export function modinv(a, m) {
  [g, x, y] = egcd(a, m);
  if (g !== 1n)
    throw new Error('modular inverse does not exist');
  else {
    return x % m;
  }
}

export class PriorityQueue {
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

  has(item) {
    return this._entries.has(item);
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

  *entries() {
    let entry = this._first.next;
    while (entry !== this._last) {
      yield [entry.item, entry.prio];
      entry = entry.next;
    }
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

export function* counter(digits, mag) {
  const base = digits.length;
  const idx = new Array(mag).fill(0);
  let overflow = false;
  do {
    yield idx.map((p) => digits[p]);
    for (let i = 0; i < mag; i++) {
      idx[i]++;
      if (idx[i] === base) {
        idx[i] = 0;
        if (i === mag - 1) {
          overflow = true;
        }
      } else {
        break;
      }
    }
  } while (!overflow);
}

export function* rangedCounter(from, to) {
  const mag = from.length;
  const idx = [...from];
  let overflow = false;
  do {
    yield idx;
    for (let i = 0; i < mag; i++) {
      idx[i]++;
      if (idx[i] >= to[i]) {
        idx[i] = from[i];
        if (i === mag - 1) {
          overflow = true;
        }
      } else {
        break;
      }
    }
  } while (!overflow);
}

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

  key(v) {
    return v.join(':');
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

  *neighbours(pos) {
    const DIRS = [
      [1, 0],
      [-1 ,0],
      [0, 1],
      [0, -1],
    ]
    for (const dir of DIRS) {
      const n = this.get(vec2.add([0, 0], pos, dir));
      if (n) {
        yield n;
      }
    }
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
