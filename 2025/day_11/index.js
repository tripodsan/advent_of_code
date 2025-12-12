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
        from: [],
      }
      racks.set(id, rack);
    });
  racks.set('out', {
    id: 'out',
    ports: [],
    paths: 0,
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

function prune(racks, ex) {
  let removed = true;
  while (removed) {
    removed = false;
    for (const id of racks.keys()) {
      const r = racks.get(id);
      if (r.ports.length === 0 && id !== ex) {
        // irrelevant leaf node
        removed = true;
        racks.delete(id);
        for (const port of r.from) {
          const src = racks.get(port);
          if (src) {
            src.ports.splice(src.ports.indexOf(id), 1);
          }
        }
      }
    }
  }
}

function solve(input, start, end) {
  const racks = parse(input);
  prune(racks, end);
  if (!racks.has(start) || !racks.has(end)) {
    return 0;
  }
  const q = new Heap((e0, e1) => e0.d - e1.d);
  q.push(racks.get(start));
  while (!q.isEmpty()) {
    const from = q.pop();
    for (const port of from.ports) {
      const dst = racks.get(port);
      if (!dst) throw Error('missing ' + port)
      dst.paths += 1;
      if (dst.id !== end) {
        q.push(dst);
      }
    }
  }
  return racks.get(end).paths;
}

function puzzle1(input) {
  return solve(input, 'you', 'out');
}

function puzzle2(input) {
  let p0, p1, p2, p3;
  console.log(p0 = solve(input, 'svr', 'fft')); // svr -> fft: 11315
  console.log(p1 = solve(input, 'dac', 'fft')); // dac -> fft: 0
  console.log(p2 = solve(input, 'fft', 'dac')); // fft -> dac: 4099825
  console.log(p3 = solve(input, 'dac', 'out')); // fft -> dac: 8281
  return p0 * p2 * p3;
}

console.log('puzzle 1: ', puzzle1('./input.txt')); // 470
console.log('puzzle 2: ', puzzle2('./input.txt'));
