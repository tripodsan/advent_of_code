import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = true;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n');


/**
 * @typedef Valve
 * @property {string} id
 * @property {number} r
 * @property {Array<string>} c
 * @property {Array<Valve>} e
 * @property {boolean} o
 */

function parse() {
  const map = new Map();
  for (const line of data) {
    const parts = line.split(/[\s=;,]+/);
    const [,id,,,,fr,,,,,...c] = parts;
    const r = parseInt(fr, 10);
    map.set(id, /** @type Valve */ {
      id,
      r,           // flow rate
      c,           // child names
      e: [],       // edges
    });
  }
  for (const v of map.values()) {
    v.e = v.c.map((n) => map.get(n));
  }
  return map;
}

/**
 * @typedef State
 * @property {Valve} valve
 * @property {number} pres
 * @property {number} time
 * @property {Map} open
 * @property {String} openKey
 */

/**
 * @param {State} state
 * @returns {number}
 */
function dijkstra(state) {
  const q = new Heap((e0, e1) => {
    const c = e1.pres - e0.pres;
    if (c) {
      return c;
    }
    return e1.time - e0.time;
  });
  q.add(state);
  let best = 0;
  let iter = 0;
  const seen = new Set();
  while (q.length) {
    const s = /** @type State */ q.pop();
    if (++iter % 100000 === 0) {
      console.log(iter, q.length, s.time, seen.size, s.open.size, best, s.openKey);
    }
    if (s.pres > best) {
      best = s.pres;
      console.log(s.open);
    }

    if (s.time === 0) {
      if (!s.elephant) {
        console.log('summoning elephant')
        // add new state as elephant
        q.add({
          valve: state.valve,
          time: 26,
          open: s.open,
          pres: s.pres,
          openKey: s.openKey,
          elephant: true,
        })
      }
      continue;
    }

    const { valve, elephant } = s;
    const time = s.time - 1;
    // create state with open valve if it can release pressure and not already open
    if (valve.r > 0 && !s.open.has(valve.id)) {
      const pres = s.pres + time * valve.r;
      const open = new Map(s.open);
      open.set(valve.id, time);
      const openKey = `${s.openKey},${valve.id}`;
      q.add(/** @type State */ {
        valve,
        pres,
        open,
        openKey,
        time,
        elephant,
      });
    }

    for (const next of valve.e) {
      const key = `${next.id}:${s.pres}:${s.openKey}:${s.elephant}`
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      q.add(/** @type State */ {
        valve: next,
        pres: s.pres,
        open: s.open,
        openKey: s.openKey,
        time,
        elephant,
      });
    }
  }

  return best;
}

function puzzle1() {
  const g = parse();
  return dijkstra({
    valve: g.get('AA'),
    pres: 0,
    time: 30,
    openKey: '',
    open: new Map(),
    elephant: false,
  });
}

function puzzle2() {
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
