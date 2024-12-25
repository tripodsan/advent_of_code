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
  const nodes = [];
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
    nodes.push(node);
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
    nodes,
    wires,
    xx,
    yy,
    zz,
  };
}

const swaplist = new Map();

function getValue(wire) {
  if (wire.value === undefined) {
    let node = wire.source;
    if (swaplist.has(node)) {
      node = swaplist.get(node);
    }
    if (node.visited) {
      throw Error('Cycle');
    }
    node.visited = true;
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

function get_sources(wire, ret = []) {
  let node = wire.source;
  if (node) {
    if (swaplist.has(node)) {
      node = swaplist.get(node);
    }
    ret.push(node);
    // console.log(`${indent}${node.in0.name} ${node.op_name} ${node.in1.name} -> ${wire.name}`);
    get_sources(node.in0, ret);
    get_sources(node.in1, ret);
  }
  return ret;
}

function dump_rev(wire, indent = '') {
  for (const node of wire.nodes) {
    console.log(`${indent}${node.in0.name} ${node.op_name} ${node.in1.name} -> ${node.out.name}`);
    dump_rev(node.out, indent + ' ');
  }
}

function add_swap(wires, wn0, wn1) {
  const w0 = wires.get(wn0);
  const w1 = wires.get(wn1);
  const n0 = w0.source;
  const n1 = w1.source;
  if (!n0 ||  !n1) {
    throw Error();
  }
  swaplist.set(n0, n1);
  swaplist.set(n1, n0);
}


function puzzle2() {
  const { wires, xx, yy, zz, nodes } = parse();

  // 9 1 1
  // fgb,z10
  // kwg,z10
  // skm,z10
  // vcf,z10
  add_swap(wires, 'vcf', 'z10');
  // 17 0 1
  // fhg,z17
  // jfb,z17
  add_swap(wires, 'z17', 'fhg');
  // 35 0 1
  // bbf,fsq
  // bwc,z35
  // dvb,fsq
  // fsq,jsn
  // fsq,tgn
  // fsq,z35
  // z35,z36
  add_swap(wires, 'dvb','fsq');
  // 38 1 1
  // gqm,rvd
  // mnd,rvd
  // rvd,tnc
  // rvd,z40
  // tnc,wrj
  // tnc,z39
  // wrj,z40
  // z39,z40
  add_swap(wires, 'tnc','z39');

  const check = (i, x, y) => {
    // reset circuit
    for (const w of wires.values()) {
      w.value = undefined;
      if (w.source) {
        w.source.visited = false;
      }
    }
    for (const w of xx) {
      w.value = 0;
    }
    for (const w of yy) {
      w.value = 0;
    }
    xx[i].value = x;
    yy[i].value = y;
    try {
      solve(zz);
    } catch (e) {
      return false;
    }
    // console.log(i, x, y, zz[i].value, zz[i+1].value);
    if (zz[i].value !== (x + y) % 2) {
      // console.log('AE', i, x, y, zz[i].value, zz[i+1].value);
      return false;
    }
    if (zz[i + 1].value !== (x + y) >> 1) {
      // console.log('CE', i, x, y, zz[i].value, zz[i+1].value);
      return false;
    }
    return true;
  }

  for (let i = 0; i < xx.length; i++) {
    // try out all x/y combinations for position I
    // dump(zz[i])
    let err = false;
    for (let x = 0; x < 2; x++) {
      for (let y = 0; y < 2; y++) {
        if (!check(i, x, y)) {
          let found = [];
          // console.log(sources.map((n) => n.out.name));
          for (let n = 0; n < nodes.length - 1; n++) {
            const s0 = nodes[n];
            if (!s0.out) {
              continue;
            }
            if (swaplist.has(s0)) {
              continue;
            }
            for (let m = n + 1; m < nodes.length; m++) {
              const s1 = nodes[m];
              if (!s1.out) {
                continue;
              }
              if (swaplist.has(s1)) {
                continue;
              }
              swaplist.set(s0, s1);
              swaplist.set(s1, s0);
              if (check(i, x, y)) {
                const pair = [s0.out.name, s1.out.name].sort((a, b) => a.localeCompare(b)).join(',');
                if (!found.includes(pair)) {
                  // console.log('found swap:', i, pair)
                  found.push(pair);
                }
              }
              swaplist.delete(s0);
              swaplist.delete(s1);
            }
          }
          if (!found) {
            throw Error('no swap found')
          }
          found.sort(((a, b) => a.localeCompare(b)));
          console.log(i, x, y);
          console.log(found.join('\n'));
        }
      }
    }
  }
  return [...swaplist.keys()].map((n) => n.out.name).sort((a, b) => a.localeCompare(b)).join(',');
}

console.log('puzzle 1:', puzzle1());
console.log('puzzle 2:', puzzle2());

