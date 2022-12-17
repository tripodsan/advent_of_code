import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

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
    const nd = /** @type Valve */ {
      id,
      r,           // flow rate
      c,           // child names
      e: [],       // edges
    };
    map.set(id, nd);
    // if valve has a pressure release, create a fake node
    if (r > 0) {
      const nid = `${id}'`;
      map.set(nid, {
        id: nid,
        r,           // flow rate
        c,           // child names
        e: [],       // edges
      });
      nd.r = 0;
      nd.c.push(nid);
    }
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
    if (++iter % 1000 === 0) {
      console.log(iter, q.length, s.time, seen.size, s.open.size, best, s.openKey);
    }
    if (s.pres > best) {
      best = s.pres;
      console.log(s.open);
    }

    const { valve, time } = s;
    // if there is no time to visit and open a next valve, continue
    if (time < 2) {
      continue;
    }

    for (const next of valve.e) {
      // ignore valve that is already open
      if (s.open.has(next.id)) {
        continue;
      }

      let pres = s.pres;
      let time = s.time - 1;
      let openKey = s.openKey;
      let open = s.open;
      if (next.r > 0) {
        pres += time * next.r;
        open = new Map(s.open);
        open.set(next.id, time);
        openKey += `,${next.id}`;
      }

      const key = `${next.id}:${s.pres}:${s.openKey}`
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      q.add(/** @type State */ {
        valve: next,
        pres,
        open,
        openKey,
        time,
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
  });
}

function puzzle2() {
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
