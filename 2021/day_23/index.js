import chalk from 'chalk-template';
import { Heap } from 'heap-js';

function fix(s) {
  return s.split('').map((c) => {
    const t = c !== '.' && c.toUpperCase() === c;
    const p = HOUSES[c] ? c : c.toLowerCase();
    return {
      p,
      t,
    }
  });
}

const HOUSES = {
  'E': 'Ap'.split(''),
  'P': 'Ae'.split(''),
  'F': 'Bq'.split(''),
  'Q': 'Bf'.split(''),
  'G': 'Cr'.split(''),
  'R': 'Cg'.split(''),
  'H': 'Ds'.split(''),
  'S': 'Dh'.split(''),
}

const TRANS = {
  'E': [],
  'P': [],
  'F': [],
  'Q': [],
  'G': [],
  'R': [],
  'H': [],
  'S': [],
  'i': [
    fix('j.EP'),
    fix('j.k.FQ'),
    fix('j.k.l.GR'),
    fix('j.k.l.t.HS'),
  ],
  'j': [
    fix('.EP'),
    fix('.k.FQ'),
    fix('.k.l.GR'),
    fix('.k.l.t.HS'),
  ],
  'k': [
    fix('.EP'),
    fix('.FQ'),
    fix('.l.GR'),
    fix('.l.t.HS'),
  ],
  'l': [
    fix('.k.EP'),
    fix('.FQ'),
    fix('.GR'),
    fix('.t.HS'),
  ],
  't': [
    fix('.l.k.EP'),
    fix('.l.FQ'),
    fix('.GR'),
    fix('.HS'),
  ],
  'n': [
    fix('.t.l.k.EP'),
    fix('.t.l.FQ'),
    fix('.t.GR'),
    fix('.HS'),
  ],
  'o': [
    fix('n.t.l.k.EP'),
    fix('n.t.l.FQ'),
    fix('n.t.GR'),
    fix('n.HS'),
  ],
  'p': [
    fix('e.JI'),
    fix('e.K.L.T.NO'),
  ],
  'e': [
    fix('.JI'),
    fix('.K.L.T.N.O'),
  ],
  'q': [
    fix('f.K.JI'),
    fix('f.L.T.NO'),
  ],
  'f': [
    fix('.K.JI'),
    fix('.L.T.NO'),
  ],
  'r': [
    fix('g.L.K.JI'),
    fix('g.T.NO'),
  ],
  'g': [
    fix('.L.K.JI'),
    fix('.T.NO'),
  ],
  's': [
    fix('h.T.L.K.JI'),
    fix('h.NO'),
  ],
  'h': [
    fix('.T.L.K.JI'),
    fix('.NO'),
  ],
}

/*
#############
#ij.k.l.t.no#
###e#f#g#h###
  #p#q#r#s#
  #########

#############
#...........#
###B#C#B#D###
  #A#D#C#A#
  #########

*/

const ANIMALS = 'AABBCCDD'.split('');

// const input0 = 'PsegfRqh'.split('');
// const input0 = 'EPFQGRHS'.split('');

 /*
#############
#...........#
###D#D#A#A###
  #C#C#B#B#
  #########
*/

const input0 = 'ghrspqef'.split('');


const NRJ = {
  'A': 1,
  'B': 10,
  'C': 100,
  'D': 1000,
}

function moves(state, p, idx) {
  const paths = TRANS[p];
  if (!paths) {
    throw Error(p);
  }
  // console.log('paths for', p)
  const { e, map } = state;
  const a = ANIMALS[idx];
  const ret = [];
  paths.forEach((path) => {
    // console.log(path);
    let d = [p];
    for (let i = 0; i < path.length; i++) {
      const c = path[i];
      // if occupied
      if (map.indexOf(c.p) >= 0 || map.indexOf(c.p.toLowerCase()) >= 0) {
        break;
      }
      const house = HOUSES[c.p];
      if (house) {
        // if wrong house
        if (house[0] !== a) {
          break;
        }
        // check if house occupied by wrong animal
        let wrong = false;
        for (let i = 1; i < house.length; i++) {
          const s = map.indexOf(house[i]);
          if (s >= 0 && ANIMALS[s] !== a) {
            wrong = true;
            break;
          }
        }
        if (wrong) {
          break;
        }
      }
      d.push(c.p);
      if (c.t) {
        const newMap = [...map];
        newMap[idx] = c.p;
        ret.push({
          map: newMap,
          e: e + (i + 1) * NRJ[a],
        });
        // console.log(i + 1, d.join(''));
      }
    }
  });
  return ret;
}

function goal(state) {
  for (const p of state.map) {
    if (!HOUSES[p]) {
      return false;
    }
  }
  return true;
}

function dump(state) {
 let map =
   '#############\n' +
   '#ij.k.l.t.no#\n' +
   '###e#f#g#h###\n' +
   '  #p#q#r#s#\n' +
   '  #########';
 state.map.forEach((p, idx) => {
   const s = ANIMALS[idx];
   const l = p.toLowerCase();
   if (l !== p) {
     map = map.replace(l, chalk`{yellow ${s}}`);
   } else {
     map = map.replace(l, s);
   }
 });
 map = map.replace(/[efghijklnopqrst]/g, '.');
 console.log('energy:', state.e)
 console.log(map);
}

function djikstra(state) {
  const q = new Heap((e0, e1) => e1.e - e0.e);
  q.add(state);
  let best = Number.MAX_SAFE_INTEGER;
  let iter = 0;
  const seen = new Map();
  while (q.length) {
    const s = q.pop();
    if (s.e > best) {
      continue;
    }
    if (++iter % 100000 === 0) {
      console.log(iter, q.length, seen.size, best);
      dump(s);
    }
    if (goal(s)) {
      console.log('found', s.e);
      best = Math.min(best, s.e);
      continue;
    }

    s.map.forEach((p, idx) => {
      const newStates = moves(s, p, idx);
      for (const ns of newStates) {
        if (ns.e >= best) {
          continue;
        }
        const hash = ns.map.join('');
        if (seen.has(hash) && seen.get(hash)  < ns.e) {
          continue;
        }
        seen.set(hash, ns.e);
        q.add(ns);
      }
    });
  }

  return best;
}

function puzzle1() {
  const state = {
    map: input0,
    e: 0,
  }
  dump(state);
  // console.log(goal(state));
  return djikstra(state);

  // const newStates = moves(state, 'o', input0.indexOf('o'));
  // for (const ns of newStates) {
  //   dump(ns);
  // }

  // for (const e of Object.entries(state.map)) {
  //   const newStates = moves(state, e);
  //   for (const ns of newStates) {
  //     dump(ns);
  //   }
  // }
}

console.log('puzzle 1:', puzzle1()); // 589
