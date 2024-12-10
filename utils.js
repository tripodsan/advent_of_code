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

/**
 * Generator that creates pairs of elements in a
 * @param a
 * @param directed
 * @returns {Generator<*, void, *>}
 */
export function *pairs(a, directed = false) {
  if (directed) {
    for (let i = 0; i < a.length; i++) {
      for (let j = 0; j < a.length; j++) {
        if (i !== j) {
          yield [a[i], a[j]];
        }
      }
    }
  } else {
    for (let i = 0; i < a.length - 1; i++) {
      for (let j = i; j < a.length; j++) {
        yield [a[i], a[j]];
      }
    }
  }
}

/**
 * generator that creates permutations of `a`
 * copied from https://github.com/nodash/steinhaus-johnson-trotter
 * @param a
 */
export function *permutations(a) {
  const N = a.length;
  const directions = Array(N).fill(-1);
  const indices = Array.init(N, (i) => i);
  directions[0] = 0;

  function swap(i, j) {
    let tmp = indices[i];
    indices[i] = indices[j];
    indices[j] = tmp;

    tmp = directions[i];
    directions[i] = directions[j];
    directions[j] = tmp;
  }

  function result() {
    return indices.map((i) => a[i]);
  }

  yield result();

  while (true) {
    let maxIndex = directions.findIndex((d) => d);
    if (maxIndex === -1) {
      return;
    }
    for (let i = maxIndex + 1; i < N; i += 1) {
      if (directions[i] !== 0 && indices[i] > indices[maxIndex]) {
        maxIndex = i;
      }
    }
    let moveTo = maxIndex + directions[maxIndex];
    swap(maxIndex, moveTo);
    if (moveTo === 0 || moveTo === N - 1 || indices[moveTo + directions[moveTo]] > indices[moveTo]) {
      directions[moveTo] = 0;
    }
    for (let i = 0; i < N; i += 1) {
      if (indices[i] > indices[moveTo]) {
        if (i < moveTo) {
          directions[i] = 1;
        } else {
          directions[i] = -1;
        }
      }
    }
    yield result();
  }
}

export function *primes(max) {
  const len = Math.sqrt(max);
  const prime = new Array(max + 1).fill(true);
  for (let i = 2; i <= max; i++) {
    if (prime[i] === true) {
      yield i;
      if (i < len) {
        for (let j = i * 2; j <= max; j += i) {
          // Mark its multiples non-prime
          prime[j] = false;
        }
      }
    }
  }
}

function factorize(n, ps) {
  if (!ps) {
    ps = primes(n);
  }
  const factors = [];
  for (const p of ps) {
    while (n % p === 0) {
      factors.push(p);
      n /= p;
    }
  }
  return factors;
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
  let res = 1n;
  while (y > 0n) {
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
  const [g, x] = egcd(a, m);
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

Array.prototype.prod = function() {
  return this.reduce((s, e) => s * e, 1);
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
  lines = lines.map((l) => (Array.isArray(l) ? l : l.split('')).map((c) => (c === ' ' || c === '.') ? '.' : '#'));
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

/* accepts parameters
 * h  Object = {h:x, s:y, v:z}
 * OR
 * h, s, v
*/
export function HSVtoRGB(h, s, v) {
  var r, g, b, i, f, p, q, t;
  if (arguments.length === 1) {
    s = h.s, v = h.v, h = h.h;
  }
  i = Math.floor(h * 6);
  f = h * 6 - i;
  p = v * (1 - s);
  q = v * (1 - f * s);
  t = v * (1 - (1 - f) * s);
  switch (i % 6) {
    case 0: r = v, g = t, b = p; break;
    case 1: r = q, g = v, b = p; break;
    case 2: r = p, g = v, b = t; break;
    case 3: r = p, g = q, b = v; break;
    case 4: r = t, g = p, b = v; break;
    case 5: r = v, g = p, b = q; break;
  }
  return {
    r: Math.round(r * 255),
    g: Math.round(g * 255),
    b: Math.round(b * 255)
  };
}

