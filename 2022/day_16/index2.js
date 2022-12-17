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
 * @property {Edge[]} e
 * @property {boolean} o
 *
 * @typedef Edge
 * @property {string} id
 * @property {number} d
 * @property {Valve} v
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
      e: c.map((cid) => ({
        id: cid,
        d: 1,
        v: null,
      })),
    };
    map.set(id, nd);
  }

  // connect all edges
  for (const v of map.values()) {
    for (const /** @type Edge */ edge of v.e) {
      edge.v = map.get(edge.id);
    }
  }

  // collapse all zero nodes
  let s = 0
  while (s !== map.size) {
    s = map.size;
    for (const v of map.values()) {
      if (v.r === 0 && v.e.length === 2) {
        const e0 = v.e[0];
        const e1 = v.e[1];
        const se0 = e0.v.e.find((e) => e.id === v.id);
        const se1 = e1.v.e.find((e) => e.id === v.id);
        se0.id = e1.id;
        se0.v  = map.get(se0.id);
        se0.d += e1.d;
        se1.id = e0.id;
        se1.v  = map.get(se1.id);
        se1.d += e0.d;
        map.delete(v.id);
      }
    }
  }

  // create virtual nodes for the closed valves to simplify the path finding
  for (const v of [...map.values()]) {
    if (v.r) {
      const nid = `${v.id}'`;
      const nv = {
        id: nid,
        r: v.r,
        e: v.e,
      };
      map.set(nid, nv);
      // mark original node as ignored and create single edge to the open state
      v.r = 0;
      v.e = [...v.e, {
        id: nid,
        v: nv,
        d: 1,
      }];
    }
  }


  return map;
}

class SuperSet {
  constructor() {
    this.current = new Set();
    this.sets = [this.current];
  }

  add(v) {
    if (this.current.size === 16_777_000) {
      this.current = new Set();
      this.sets.push(this.current)
    }
    return this.current.add(v)
  }

  has(v) {
    for (const set of this.sets) {
      if (set.has(v)) return true
    }
    return false;
  }

  get size() {
    let s = 0;
    for (const { size } of this.sets) {
      s += size;
    }
    return s;
  }
}

/**
 * @typedef State
 * @property {Valve} v0
 * @property {Valve} v1
 * @property {number} pres
 * @property {number} t0
 * @property {number} t1
 * @property {Map} open
 * @property {String} openKey
 */

/**
 * @param {State} state
 * @returns {number}
 */
function dijkstra(state, maxValves) {
  const q = new Heap((e0, e1) => e1.pres - e0.pres);
  q.add(state);
  let best = 0;
  let iter = 0;
  const seen = new SuperSet();
  while (q.length) {
    const s = /** @type State */ q.pop();
    if (++iter % 100000 === 0) {
      console.log(iter, q.length, s.t0, s.t1, seen.size, s.open.size, s.pres, best, s.openKey);
    }
    // if (s.pres > best) {
    //   best = s.pres;
    //   console.log(s.open, best);
    // }
    // if (s.open.size === maxValves) {
    //   continue;
    // }

    // if there is no time to visit and open a next valve, continue
    // if (s.time < 2) {
    //   continue;
    // }

    // get all possible moves of the 2 players
    const pairs = new Set();
    // console.log(s.v0.id, s.v1.id);
    for (let i = 0; i < s.v0.e.length; i += 1) {
      const e0 = s.v0.e[i];
      if (s.open.has(e0.id)) {
        continue;
      }
      let t0 = s.t0 - e0.d;
      if (t0 < 1) {
        t0 = 0;
        // continue;
      }
      for (let j = 0; j < s.v1.e.length; j += 1) {
        const e1 = s.v1.e[j];
        if (e0.id === e1.id) {
          continue;
        }
        if (s.open.has(e1.id)) {
          continue;
        }
        let t1 = s.t1 - e1.d;
        if (t1 < 1) {
          t1 = 0;
          // continue;
        }

        // const es = [e0, e1].sort((v0, v1) => v0.id.localeCompare(v1.id));
        // const pk = `${es[0].id}:${es[1].id}`;
        // if (pairs.has(pk)) {
        //   continue;
        // }
        // pairs.add(pk);

        let pres = s.pres;
        let open = null;
        let openKey = s.openKey;

        // check if they can release pressure
        if (e0.v.r) {
          pres += t0 * e0.v.r;
          open = new Map(s.open);
          open.set(e0.id, t0);
        }
        if (e1.v.r) {
          pres += t1 * e1.v.r;
          open = open || new Map(s.open);
          open.set(e1.id, t1);
        }
        if (!open) {
          open = s.open;
        } else {
          openKey = [...open.keys()].sort().join('');
        }

        if (pres > best) {
          best = pres;
          console.log(open, best);
        }
        if (t0 < 1 && t1 < 1) {
          continue;
        }
        if (open.size === maxValves) {
          continue;
        }
        // const es = [e0.id, e1.id].sort((s0, s1) => s0.localeCompare(s1));
        // const key = `${es[0]}:${es[1]}:${pres}:${openKey}`
        // console.log(key);
        // if (!seen.has(key)) {
          // seen.add(key);
          q.add(/** @type State */ {
            v0: e0.v,
            v1: e1.v,
            pres,
            open,
            openKey,
            t0,
            t1,
          });
        // }
      }
    }
  }

  return best;
}

function puzzle2() {
  const g = parse();
  // for (const v of g.values()) {
  //   console.log(v.id, v.r);
  //   for (const e of v.e) {
  //     console.log(`  -> ${e.id} ${e.d}`);
  //   }
  // }
  // return;
  const num = [...g.values()].reduce((sum, v) => sum += v.r > 0 ? 1 : 0, 0);
  console.log(num);
  return dijkstra({
    v0: g.get('AA'),
    v1: g.get('AA'),
    pres: 0,
    t0: 26,
    t1: 26,
    openKey: '',
    open: new Map(),
  }, num);

}

console.log('puzzle 2 : ', puzzle2()); // 2705
