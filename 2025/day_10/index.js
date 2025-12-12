import fs from 'fs';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input_test.txt', 'utf-8')
  .split('\n')
  .filter((c) => !!c)
  .map((line) => {
    let pan = 0;
    const but = [];
    const buti = []
    let jol = [];
    for (const pat of line.split(' ')) {
      if (pat[0] === '[') {
        pan = Number.parseInt(pat.substring(1, pat.length - 1)
          .split('')
          .reverse()
          .join('')
          .replaceAll('.', '0')
          .replaceAll('#', '1'), 2);
      } else if (pat[0] === '(') {
        const bi = pat.substring(1, pat.length - 1)
          .split(',')
          .map(i => Number.parseInt(i, 10))
        buti.push(bi);
        but.push(bi.reduce((acc, i) => acc + 2**(parseInt(i, 10)), 0));

      } else if (pat[0] === '{') {
        jol = pat.substring(1, pat.length - 1)
          .split(',')
          .map(i => parseInt(i, 10));
      }
    }
    // console.log(pan.toString(2), but.map((b) => b.toString(2)), buti, jol)
    return { pan, but, buti, jol };
  });



function solve1(mashine) {
  const { pan, but, jol } = mashine;
  const q = new Heap((e0, e1) => e0.p.length - e1.p.length);

  const visited = new Set();
  q.push({
    c: 0, // config
    p: [], // path
  })
  while (!q.isEmpty()) {
    const e = q.pop();
    if (visited.has(e.c)) {
      // already visited
      continue;
    }
    visited.add(e.c);
    // press all buttons
    for (let i = 0; i < but.length; i++) {
      const nc = e.c ^ but[i];
      if (nc === pan) {
        const path = [...e.p, i].reverse();
        console.log(path);
        return path.length;
      }
      q.push({
        c: nc,
        p: [...e.p, i],
      });
    }
  }
  throw Error('no path');
}

function solve2(mashine) {
  const { buti, jol } = mashine;
  const match = jol.join();
  const q = new Heap((e0, e1) => e0.p.length - e1.p.length);

  const visited = new Set();
  q.push({
    c: new Array(jol.length).fill(0),
    p: [], // path
  })
  while (!q.isEmpty()) {
    const e = q.pop();
    if (visited.has(e.c)) {
      // already visited
      continue;
    }
    visited.add(e.c);
    // press all buttons
    for (let i = 0; i < buti.length; i++) {
      const nc = [...e.c];
      for (const b of buti[i]) {
        nc[b] += 1;
      }
      // console.log(e.c, buti[i], nc)
      if (nc.join() === match) {
        const path = [...e.p, i].reverse();
        console.log(path);
        return path.length;
      }
      q.push({
        c: nc,
        p: [...e.p, i],
      });
    }
  }
  throw Error('no path');
}

function puzzle(solver) {
  let s = 0;
  for (const m of data) {
    s += solver(m);
  }
  return s;
}

console.log('puzzle 1: ', puzzle(solve1)); // 479
console.log('puzzle 2: ', puzzle(solve2)); // 479
