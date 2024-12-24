import fs from 'fs';
import { Grid} from '../../Grid.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';
import chalk from 'chalk';
import { HSVtoRGB } from '../../utils.js';

const OPS = {
  'AND': (i0, i1) => i0 & i1,
  'OR': (i0, i1) => i0 | i1,
  'XOR': (i0, i1) => i0 ^ i1,
}

function parse() {
  const [init, mapping] = fs.readFileSync('./input.txt', 'utf-8').split('\n\n');
  const wires = new Map();
  const xx = [];
  const yy = [];
  const getWire = (name) => {
    let w = wires.get(name);
    if (!w) {
      w = {
        name: name,
        value: undefined,
        source: null,
        nodes: [],
      }
      wires.set(name, w);
    }
    return w;
  }
  for (const line of init.split('\n')) {
    if (!line.trim()) {
      continue;
    }
    const [ name, value ] = line.split(':');
    const w = getWire(name);
    w.value = parseInt(value, 10);
    if (name.startsWith('x')) {
      const idx = parseInt(name.substring(1), 10);
      xx[idx] = w;
    }
    if (name.startsWith('y')) {
      const idx = parseInt(name.substring(1), 10);
      yy[idx] = w;
    }
  }

  const zz = [];
  for (const line of mapping.split('\n')) {
    if (!line.trim()) {
      continue;
    }
    // tg XOR fgs -> mjb
    const [ i0, op, i1, o0] = line.split(/[ >-]+/g);
    const out = getWire(o0);
    const node = {
      in0: getWire(i0),
      in1: getWire(i1),
      op: OPS[op],
      op_name: op,
      out,
    }
    node.in0.nodes.push(node);
    node.in1.nodes.push(node);
    if (out.source) {
      throw Error();
    }
    out.source = node;
    if (o0.startsWith('z')) {
      const idx = parseInt(o0.substring(1), 10);
      zz[idx] = out;
    }
  }
  return {
    wires,
    xx,
    yy,
    zz,
  };
}

function getValue(wire) {
  if (wire.value === undefined) {
    const node = wire.source;
    wire.value = node.op(getValue(node.in0), getValue(node.in1));
  }
  return wire.value;
}

function solve(zz) {
  let acc = 0;
  for (let i = 0; i < zz.length; i++) {
    if (getValue(zz[i])) {
      acc += 2**i;
    }
  }
  return acc;
}

function puzzle1() {
  const { zz } = parse();
  return solve(zz);
}

function dump(wire, indent = '') {
  const node = wire.source;
  if (node) {
    console.log(`${indent}${node.in0.name} ${node.op_name} ${node.in1.name} -> ${wire.name}`);
    dump(node.in0, indent + '  ');
    dump(node.in1, indent + '  ');
  }
}

function dump_rev(wire, indent = '') {
  for (const node of wire.nodes) {
    console.log(`${indent}${node.in0.name} ${node.op_name} ${node.in1.name} -> ${node.out.name}`);
    dump_rev(node.out, indent + ' ');
  }
}


function puzzle2() {
  const { wires, xx, yy, zz } = parse();
  for (let i = 0; i < xx.length; i++) {
    // try out all x/y combinations for position I
    // dump(zz[i])
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        // reset circuit
        for (const w of wires.values()) {
          w.value = undefined;
        }
        for (const w of xx) {
          w.value = 0;
        }
        for (const w of yy) {
          w.value = 0;
        }
        xx[i].value = x;
        yy[i].value = y;
        solve(zz);
        console.log(i, x, y, zz[i].value, zz[i+1].value);
        if (zz[i].value !== (x + y) % 2) {
          // dump_rev(xx[i])
          dump(zz[i])
          // throw Error('add');
        }
        if (zz[i + 1].value !== (x + y) >> 1) {
          dump_rev(xx[i])
          dump(zz[i + 1])
          throw Error('carry');
        }
      }
    }
  }
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());

