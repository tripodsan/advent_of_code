import fs from 'fs';
import { Grid } from '../../utils.js';
import { vec2 } from '../../vec2.js';
import { Heap } from 'heap-js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n').map((d) => d.split(' '));

const OPS = {
  '+': (a,b) => a + b,
  '-': (a,b) => a - b,
  '*': (a,b) => a * b,
  '/': (a,b) => a / b,
}
const INV_LHS = {
  '+': (a,b) => a - b,
  '-': (a,b) => a + b,
  '*': (a,b) => a / b,
  '/': (a,b) => a * b,
}
const INV_RHS = {
  '+': (a,b) => a - b,
  '-': (a,b) => b - a,
  '*': (a,b) => a / b,
  '/': (a,b) => b / a,
}

function toInt(s) {
  const n = parseInt(s, 10);
  return Number.isNaN(n) ? s : n;
}

function link(tree, parent, name) {
  if (typeof name === 'string') {
    const node = tree.get(name)
    node.parent = parent;
    node.n0 = link(tree, node, node.t0);
    node.n1 = link(tree, node, node.t1);
    return node;
  }
  return name;
}

function parse() {
  const tree = new Map();
  for (const [n0, t0, ops, t1] of data) {
    const node = {
      ops: OPS[ops],
      inv_lhs: INV_LHS[ops],
      inv_rhs: INV_RHS[ops],
      t0: toInt(t0),
      t1: toInt(t1),
    }
    tree.set(n0.substring(0, 4), node);
  }
  // link tree
  link(tree, null, 'root');
  return tree;
}

/*

  r
 /=\
3   c
   /*\
  9   b
     /+\
    X   3

3 = 9 * (x + 3)

*/

function solve(node) {
  if (typeof node === 'number') {
    return node;
  }
  if (node.ops) {
    return node.ops(solve(node.n0), solve(node.n1));
  } else {
    return solve(node.n0);
  }
}

function prune(tree) {
  let h = tree.get('humn');
  let hp = h.parent;
  while (hp) {
    if (h === hp.n0) {
      hp.n1 = solve(hp.n1);
    } else {
      hp.n0 = solve(hp.n0);
    }
    h = hp;
    hp = hp.parent;
  }
}

function puzzle1() {
  return solve(parse().get('root'));
}


function puzzle2() {
  const tree = parse();
  const root = tree.get('root');
  root.ops = OPS['-'];

  // prune tree
  prune(tree);

  // define function
  const h = tree.get('humn');
  const fn = (x) => {
    h.n0 = x;
    return solve(root);
  }

  // binary search
  let low = 0;
  let high = Number.MAX_SAFE_INTEGER;
  let x = Math.floor(high / 2);
  let y = 0;

  // check slope of function
  const s = Math.sign(fn(1) - fn(0));

  while (true) {
    x = low + Math.round((high - low) / 2);
    y = fn(x);
    if (y === 0) {
      break;
    }
    if (y*s < 0) {
      low = x;
    } else {
      high = x;
    }
  }
  return x;
}

function puzzle2_solver() {
  const tree = parse();
  // prune tree
  prune(tree);
  const h = tree.get('humn');
  let n = tree.get('root');
  n.inv_lhs = INV_LHS['-'];
  n.inv_rhs = INV_RHS['-'];
  let v = 0;
  while (n !== h) {
    if (typeof n.n0 === 'number') {
      v = n.inv_rhs(v, n.n0);
      n = n.n1;
    } else {
      v = n.inv_lhs(v, n.n1);
      n = n.n0;
    }
  }
  return v;
}

console.log('puzzle 1 : ', puzzle1()); // 54703080378102
console.log('puzzle 2 : ', puzzle2()); // 3952673930912
console.log('puzzle 2 : ', puzzle2_solver()); // 3952673930912
