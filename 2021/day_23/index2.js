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
  'E': 'Apua'.split(''),
  'P': 'Aeua'.split(''),
  'U': 'Apea'.split(''),
  'A': 'Aeup'.split(''),
  'F': 'Bqvb'.split(''),
  'Q': 'Bfvb'.split(''),
  'V': 'Bfqb'.split(''),
  'B': 'Bfqv'.split(''),
  'G': 'Crwc'.split(''),
  'R': 'Cgwc'.split(''),
  'W': 'Cgrc'.split(''),
  'C': 'Cgrw'.split(''),
  'H': 'Dsxd'.split(''),
  'S': 'Dhxd'.split(''),
  'X': 'Dhsd'.split(''),
  'D': 'Dhsx'.split(''),
}

const TRANS = {
  'E': [],
  'P': [],
  'U': [],
  'A': [],
  'F': [],
  'Q': [],
  'V': [],
  'B': [],
  'G': [],
  'R': [],
  'W': [],
  'C': [],
  'H': [],
  'S': [],
  'X': [],
  'D': [],

  'i': [
    fix('j.EPUA'),
    fix('j.k.FQVB'),
    fix('j.k.l.GRWC'),
    fix('j.k.l.t.HSXD'),
  ],
  'j': [
    fix('.EPUA'),
    fix('.k.FQVB'),
    fix('.k.l.GRWC'),
    fix('.k.l.t.HSXD'),
  ],
  'k': [
    fix('.EPUA'),
    fix('.FQVB'),
    fix('.l.GRWC'),
    fix('.l.t.HSXD'),
  ],
  'l': [
    fix('.k.EPUA'),
    fix('.FQVB'),
    fix('.GRWC'),
    fix('.t.HSXD'),
  ],
  't': [
    fix('.l.k.EPUA'),
    fix('.l.FQVB'),
    fix('.GRWC'),
    fix('.HSXD'),
  ],
  'n': [
    fix('.t.l.k.EPUA'),
    fix('.t.l.FQVB'),
    fix('.t.GRWC'),
    fix('.HSXD'),
  ],
  'o': [
    fix('n.t.l.k.EPUA'),
    fix('n.t.l.FQVB'),
    fix('n.t.GRWC'),
    fix('n.HSXD'),
  ],

  'e': [
    fix('.JI'),
    fix('.K.L.T.N.O'),
  ],
  'p': [
    fix('e.JI'),
    fix('e.K.L.T.NO'),
  ],
  'u': [
    fix('pe.JI'),
    fix('pe.K.L.T.NO'),
  ],
  'a': [
    fix('upe.JI'),
    fix('upe.K.L.T.NO'),
  ],

  'f': [
    fix('.K.JI'),
    fix('.L.T.NO'),
  ],
  'q': [
    fix('f.K.JI'),
    fix('f.L.T.NO'),
  ],
  'v': [
    fix('qf.K.JI'),
    fix('qf.L.T.NO'),
  ],
  'b': [
    fix('vqf.K.JI'),
    fix('vqf.L.T.NO'),
  ],

  'g': [
    fix('.L.K.JI'),
    fix('.T.NO'),
  ],
  'r': [
    fix('g.L.K.JI'),
    fix('g.T.NO'),
  ],
  'w': [
    fix('rg.L.K.JI'),
    fix('rg.T.NO'),
  ],
  'c': [
    fix('wrg.L.K.JI'),
    fix('wrg.T.NO'),
  ],
  'h': [
    fix('.T.L.K.JI'),
    fix('.NO'),
  ],
  's': [
    fix('h.T.L.K.JI'),
    fix('h.NO'),
  ],
  'x': [
    fix('sh.T.L.K.JI'),
    fix('sh.NO'),
  ],
  'd': [
    fix('xsh.T.L.K.JI'),
    fix('xsh.NO'),
  ],
}

/*
#############
#ij.k.l.t.no#
###e#f#g#h###
  #p#q#r#s#
  #u#v#w#x#
  #a#b#c#d#
  #########

#############
#...........#
###B#C#B#D###
  #D#C#B#A#
  #D#B#A#C#
  #A#D#C#A#
  #########

*/

const ANIMALS = 'AAAABBBBCCCCDDDD'.split('');
// const input0  = 'AwsdevgrfqCxpubh'.split('');
// const input0 = 'EPFQGRHS'.split('');

 /*
#############
#...........#
###D#D#A#A###
  #D#C#B#A#
  #D#B#A#C#
  #C#C#B#B#
  #########

*/

const input0 = 'gwhsvrcdaqbxepuf'.split('');


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
        // sort the same animals
        let j = idx - (idx % 4)
        const insert = newMap.slice(j, j + 4).sort();
        newMap.splice(j, 4, ...insert);
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
   '  #u#v#w#x#\n' +
   '  #a#b#c#d#\n' +
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
 map = map.replace(/[efghijklnopqrstuvwxabcd]/g, '.');
 console.log('energy:', state.e)
 console.log(map);
}

function dijkstra(state) {
  const q = new Heap((e0, e1) => e0.e - e1.e);
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
        if (seen.has(hash) && seen.get(hash) <= ns.e) {
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
  return dijkstra(state);

  // const newStates = moves(state, 'e', input0.indexOf('e'));
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

console.log('puzzle 2:', puzzle1()); // 43413
