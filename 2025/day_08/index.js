import fs from 'fs';
import { Heap } from 'heap-js';

function solve(input, n) {
  const boxes = fs.readFileSync(input, 'utf-8')
    .split('\n')
    .filter((c) => !!c)
    .map((line) => ({
      v: line.split(',').map((p) => Number.parseInt(p, 10)),
    }));

  const q = new Heap((e0, e1) => e0.d - e1.d);
  for (let i = 0; i < boxes.length - 1; i++) {
    for (let j = i + 1; j < boxes.length; j++) {
      const v0 = boxes[i].v;
      const v1 = boxes[j].v;
      q.push({
        b0: boxes[i],
        b1: boxes[j],
        d: (v0[0] - v1[0])**2 + (v0[1] - v1[1])**2 + (v0[2] - v1[2])**2,
      });
    }
  }
  const circuits = [];

  while (true) {
    const cx = q.pop();
    // console.log(cx);
    const b0 = cx.b0;
    const b1 = cx.b1;
    if (!b0.c  && !b1.c) {
      // neither of the boxes is in a circuit
      const c = [b0, b1]
      b0.c = c;
      b1.c = c;
      circuits.push(c);
    } else if (b0.c && !b1.c) {
      // add b1 to the same circuit
      b1.c = b0.c
      b0.c.push(b1);
    } else if (!b0.c && b1.c) {
      // add b0 to the same circuit
      b0.c = b1.c
      b1.c.push(b0);
    } else if (b0.c === b1.c) {
      // both are already in the same circuit
    } else {
      // merge circuits
      const c0 = b0.c;
      const c1 = b1.c;
      for (const b of c1) {
        c0.push(b);
        b.c = c0;
      }
      const i = circuits.indexOf(c1);
      circuits.splice(i, 1);
    }
    if (circuits[0].length === boxes.length) {
      console.log('puzzle 2: ', cx.b0.v[0] * cx.b1.v[0]); // 25325968
      return;
    }
    if (--n === 0) {
      // puzzle 1
      circuits.sort((a, b) => b.length - a.length);
      // console.log(circuits);
      let prod = 1;
      for (let i = 0; i < 3; i++) {
        prod *= circuits[i].length;
      }
      console.log('puzzle 1: ', prod); // 54180
    }
  }
}

// solve('./input_test.txt', 10);
solve('./input.txt', 1000);
