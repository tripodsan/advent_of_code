import fs from 'fs';
import { Heap } from 'heap-js';


function parse(input) {
  // ccc: ddd eee fff
  const racks = new Map();
  fs.readFileSync(input, 'utf-8')
    .split('\n')
    .filter((c) => !!c)
    .forEach((line) => {
      const [id, ...ports] = line.split(/[: ]+/);
      const rack = {
        id,
        ports,
        paths: 0,
        routes: [],
        from: [],
      }
      racks.set(id, rack);
    });
  racks.set('out', {
    id: 'out',
    ports: [],
    paths: 0,
    routes: [],
    from: [],
  })
  // connect reverse
  racks.forEach((r) => {
    for (const port of r.ports) {
      racks.get(port).from.push(r.id);
    }
  });
  // console.log(racks);
  return racks;
}

function solve(input, start, end) {
  const racks = parse(input);
  const q = new Heap((e0, e1) => e0.d - e1.d);
  q.push(racks.get(start));
  while (!q.isEmpty()) {
    const from = q.pop();
    for (const port of from.ports) {
      const dst = racks.get(port);
      dst.paths += 1;
      if (dst.id !== end) {
        q.push(dst);
      }
    }
  }
  return racks.get(end).paths;
}

function solve2(input, start, end) {
  const racks = parse(input);
  const q = new Heap((e0, e1) => e0.d - e1.d);
  q.push(racks.get(start));
  while (!q.isEmpty()) {
    const from = q.pop();
    for (const port of from.ports) {
      const dst = racks.get(port);
      for 

      if (!dst.visited) {
        dst.visited = true;
        q.push(dst);
      }
    }
  }
  return racks.get(end).paths;
}

function reverse(input, start, end) {
  const racks = parse(input);
  const q = new Heap((e0, e1) => e0.d - e1.d);
  q.push(racks.get(end));
  while (!q.isEmpty()) {
    const dst = q.pop();
    for (const port of dst.from) {
      const src = racks.get(port);
      src.paths += 1;
      q.push(src);
    }
  }
  return racks.get(start).paths;
}

function puzzle1(input) {
  return solve2(input, 'you', 'out');
}

function puzzle2(input) {
  console.log(reverse(input, 'svr', 'fft')); // svr -> fft: 11315
  console.log(solve(input, 'dac', 'fft')); // dac -> fft: 0
  console.log(solve(input, 'fft', 'dac')); // fft -> dac: 0
}


console.log('puzzle 1: ', puzzle1('./input.txt')); // 470

// console.log('puzzle 2: ', puzzle2('./input_test2.txt'));
// console.log('puzzle 2: ', puzzle2('./input.txt'));
