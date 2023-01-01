import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n')
  .map((line) => line.split(/\s+/));

// console.log(data);

const OPS = {
  EQ: (v0) => v0,
  NOT: (v0) => ~v0,
  LSHIFT: (v0, v1) => v0 << v1,
  RSHIFT: (v0, v1) => v0 >> v1,
  AND: (v0, v1) => v0 & v1,
  OR: (v0, v1) => v0 | v1,
}

function parse() {
  const gates = new Map();
  for (const l of data) {
    const out = l[l.length - 1];
    let input = [];
    let ops = '';
    if (l[1] === '->') {
      input.push(l[0]);
      ops = OPS.EQ;
    } else if (l[0] === 'NOT') {
      input.push(l[1]);
      ops = OPS.NOT;
    } else {
      input.push(l[0], l[2]);
      ops = OPS[l[1]];
    }
    const gate = {
      ops,
      input,
      out,
    };
    gates.set(out, gate);
    for (let i = 0; i < input.length; i++) {
      const d = parseInt(input[i], 10);
      if (!Number.isNaN(d)) {
        input[i] = d;
        gates.set(d, { value: d });
      }
    }
  }
  // console.log(gates);
  return gates;
}


function get(gates, k) {
  const g = gates.get(k);
  if (g.value === undefined) {
    const l0 = get(gates, g.input[0]);
    const l1 = g.input.length > 1 ? get(gates, g.input[1]) : 0;
    g.value = g.ops(l0, l1);
  }
  return g.value;
}

function puzzle1() {
  const gates = parse();
  return get(gates, 'a') & 0xffff;
}

function puzzle2() {
  let gates = parse();
  const a = get(gates, 'a');
  gates = parse();
  gates.get('b').value = a;
  return get(gates, 'a') & 0xffff;
}

console.log('puzzle 1: ', puzzle1()); // 16076
console.log('puzzle 2: ', puzzle2()); // 2797
