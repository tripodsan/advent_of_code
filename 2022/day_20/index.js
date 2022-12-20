import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false

const KEY = 811589153;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n').map((d) => parseInt(d, 10));


function dump(first) {
  let n = first;
  let s = '';
  do {
    s += `${n.c}, `;
    n = n.next;
  } while (n !== first);
  console.log(s);
}

function find(n, idx) {
  while (idx--) {
    n = n.next;
  }
  // console.log(n.c);
  return n.c;
}

function init(m = 1) {
  const L = data.length -1;
  const nodes = [];
  let prev = null;
  let zero = null;
  for (let c of data) {
    c *= m;
    const node = {
      next: null,
      prev: null,
      c,
      s: c < 0 ? c % L + L : c % L,
    };
    if (c === 0) {
      zero = node;
    }
    nodes.push(node);
    if (prev) {
      node.prev = prev;
      prev.next = node;
    }
    prev = node;
  }
  prev.next = nodes[0];
  nodes[0].prev = prev;
  return { nodes, zero };
}

function mix(nodes) {
  for (const n of nodes) {
    let { s } = n;
    while (s--) {
      const { next } = n;
      n.prev.next = next;
      next.prev = n.prev;
      n.next = n.next.next;
      n.prev = next;
      next.next = n;
      n.next.prev = n;
    }
  }
}

function puzzle1() {
  const { nodes, zero } = init();
  const L = nodes.length;
  mix(nodes);
  return find(zero, 1000 % L) + find(zero, 2000 % L) + find(zero, 3000 % L);
}

function puzzle2() {
  const { nodes, zero } = init(KEY);
  const L = nodes.length;
  for (let i = 0; i < 10; i++) {
    mix(nodes);
  }
  return find(zero, 1000 % L) + find(zero, 2000 % L) + find(zero, 3000 % L);
}

console.log('puzzle 1 : ', puzzle1());  // 14888
console.log('puzzle 2 : ', puzzle2());  // 3760092545849
