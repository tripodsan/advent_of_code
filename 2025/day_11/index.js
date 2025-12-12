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
        paths: [],
        from: [],
      }
      racks.set(id, rack);
    });
  racks.set('out', {
    id: 'out',
    ports: [],
    paths: [],
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
  q.push({
    rack: racks.get(start),
    path: [start],
  });
  while (!q.isEmpty()) {
    const p = q.pop();
    const { rack } = p;
    if (rack.ports.length === 0) {
      // leaf node
      rack.paths.push(p);
      continue;
    }
    if (rack.paths.length === 0) {
      // if a rack was not visited yet create new paths for each port
      for (let i = 0; i < rack.ports.length; i++) {
        const port = rack.ports[i];
        let pp = p;
        if (i > 0) {
          // create new path by cloning the existing one
          pp = {
            path: [...p.paths, port],
          }
        }
        pp.rack = racks.get(port);
        p.push(pp);
        rack.paths.push(pp);
      }
    } else {
      // a new path reached this rack, so add the paths we accumulated
      for (const path of rack.paths) {
        rack.paths.numPaths += p.numPaths;
      }
    }
  }
  console.log(racks);
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


console.log('puzzle 1: ', puzzle1('./input_test.txt')); // 470

// console.log('puzzle 2: ', puzzle2('./input_test2.txt'));
// console.log('puzzle 2: ', puzzle2('./input.txt'));
