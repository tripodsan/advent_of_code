

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

function ggt(a, b) {
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
function kgv(a, b) {
  return (a*b) / ggt(a,b);
}


function simplify(a, b) {
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
function power(x, y, p) {
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

function egcd(a, b) {
  if (a === 0n)
    return [b, 0n, 1n];
  else {
    const [g, y, x] = egcd(b % a, a);
    return [g, x - (b / a) * y, y];
  }
}

function modinv(a, m) {
  [g, x, y] = egcd(a, m);
  if (g !== 1n)
    throw new Error('modular inverse does not exist');
  else {
    return x % m;
  }
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

function* rangedCounter(from, to) {
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

class Grid {
  constructor(dim = 2) {
    this._g = {};
    this.dim = dim;
    this.min = new Array(dim).fill(Number.MAX_SAFE_INTEGER);
    this.max = new Array(dim).fill(Number.MIN_SAFE_INTEGER);
  }

  key(v) {
    return v.join(':');
  }

  put(v, data) {
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
      d = fn();
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

  dump(pos, draw) {
    for (let y = this.min[1]; y <= this.max[1]; y++) {
      const row = [];
      let delim = ' ';
      for (let x = this.min[0]; x <= this.max[0]; x++) {
        if (pos && pos[0] === x && pos[1] === y) {
          row.push('[');
          delim = ']';
        } else {
          row.push(delim);
          delim = ' ';
        }
        const cell = this.get([x, y]);
        if (cell) {
          row.push(draw ? draw(cell) : '#');
        } else {
          row.push('.');
        }
      }
      console.log(row.join(''));
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

// // Array.prototype.flat = function() {
// //   return [].concat(...this);
// // }
//
// module.exports = {
//   permute,
//   ggt,
//   kgv,
//   simplify,
//   power,
//   egcd,
//   modinv,
//   PriorityQueue,
//   counter,
//   rangedCounter,
//   Grid,
// }
