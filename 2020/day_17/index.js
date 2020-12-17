const fs = require('fs');

const { counter, rangedCounter } = require('../utils');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)

function key(v) {
  return v.join(':');
}

function activate(context, v) {
  context.map[key(v)] = true;
  for (let p = 0; p < v.length; p ++) {
    context.min[p] = Math.min(context.min[p], v[p]);
    context.max[p] = Math.max(context.max[p], v[p]);
  }
}

function numActive(map, dim,  v, max) {
  let n = 0;
  for (let k of counter([-1, 0, 1], dim)) {
    if (k.find((p) => p !== 0)) {
      const vk = k.map((vv, idx) => v[idx] + vv);
      if (map[key(vk)]) {
        n++;
        if (n > max) {
          break;
        }
      }
    }
  }
  return n;
}

function createContext(dim) {
  const context = {
    map: {},
    dim: dim,
    min: new Array(dim).fill(Number.MAX_SAFE_INTEGER),
    max: new Array(dim).fill(Number.MIN_SAFE_INTEGER),
  }
  data.forEach((l, y) => {
    const v = new Array(dim).fill(0);
    l.split('').forEach((c,x) => {
      if (c === '#') {
        v[0] = x;
        v[1] = y;
        activate(context, v);
      }
    });
  })
  return context;
}

/*
If a cube is active and exactly 2 or 3 of its neighbors are also active, the cube remains active. Otherwise, the cube becomes inactive.
If a cube is inactive but exactly 3 of its neighbors are active, the cube becomes active. Otherwise, the cube remains inactive.
 */

function simulate(context) {
  const min = context.min.map((m) => m -1);
  const max = context.max.map((m) => m + 2);
  const { map, dim } = context;
  context.map = {};
  for (let v of rangedCounter(min, max)) {
    const n = numActive(map, dim, v, 3);
    const k = key(v);
    const a = map[k];
    if (a && (n === 2 || n === 3)) {
      context.map[k] = a;
    } else if (!a && n === 3) {
      activate(context, v);
    }
  }
}

function puzzle2() {
  const context = createContext(4);
  for (let n = 0; n < 6; n++) {
    console.log(n);
    simulate(context);
  }
  console.log(context.min, context.max);
  return Object.keys(context.map).length;
}

function puzzle1() {
  const context = createContext(3);
  for (let n = 0; n < 6; n++) {
    console.log(n);
    simulate(context);
  }
  return Object.keys(context.map).length;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
