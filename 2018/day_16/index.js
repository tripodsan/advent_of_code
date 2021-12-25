import { Grid } from '../../utils.js';
import chalk from 'chalk';
import fs from 'fs';

function readTests() {
  /*
Before: [3, 2, 1, 1]
9 2 1 2
After:  [3, 2, 2, 1]

   */
  const tests = [];
  let test = null;
  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .forEach((line) => {
      const segs = line.split(/[a-z: \[,\]]+/).filter((c) => !!c)
      if (segs[0] === 'B') {
        segs.shift();
        test = {
          before: segs.map((s) => parseInt(s)),
        }
        tests.push(test);
      } else if (segs[0] === 'A') {
        segs.shift();
        test.after = segs.map((s) => parseInt(s));
        test = null;
      } else {
        test.ops = segs.map((s) => parseInt(s));
      }
    })
  // console.log(tests);
  return tests;
}

function readCode() {
  return fs.readFileSync('./input1.txt', 'utf-8')
    .split('\n')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .map((line) => line.split(/\s+/).map((c) => parseInt(c)));
}

const OPS = [
  // addr (add register) stores into register C the result of adding register A and register B.
  (regs, a, b, c) => regs[c] = regs[a] + regs[b],
  // addi (add immediate) stores into register C the result of adding register A and value B.
  (regs, a, b, c) => regs[c] = regs[a] + b,
  // mulr (multiply register) stores into register C the result of multiplying register A and register B.
  (regs, a, b, c) => regs[c] = regs[a] * regs[b],
  // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
  (regs, a, b, c) => regs[c] = regs[a] * b,
  // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
  (regs, a, b, c) => regs[c] = regs[a] & regs[b],
  // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
  (regs, a, b, c) => regs[c] = regs[a] & b,
  // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
  (regs, a, b, c) => regs[c] = regs[a] | regs[b],
  // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
  (regs, a, b, c) => regs[c] = regs[a] | b,
  // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
  (regs, a, b, c) => regs[c] = regs[a],
  // seti (set immediate) stores value A into register C. (Input B is ignored.)
  (regs, a, b, c) => regs[c] = a,
  // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
  (regs, a, b, c) => regs[c] = a > regs[b] ? 1 : 0,
  // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
  (regs, a, b, c) => regs[c] = regs[a] > b ? 1 : 0,
  // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
  (regs, a, b, c) => regs[c] = regs[a] > regs[b] ? 1 : 0,
  // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
  (regs, a, b, c) => regs[c] = a === regs[b] ? 1 : 0,
  // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
  (regs, a, b, c) => regs[c] = regs[a] === b ? 1 : 0,
  // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
  (regs, a, b, c) => regs[c] = regs[a] === regs[b] ? 1 : 0,
];


function puzzle1() {
  const tests = readTests();
  let num = 0;
  // puzzle opcode to ops numbers
  const map = Array.init(16, () => new Map());
  for (const test of tests) {
    let match = 0;
    for (let i = 0; i < OPS.length; i++) {
      const regs = [...test.before];
      const [o, a, b, c] = test.ops;
      OPS[i](regs, a, b, c);
      if (regs.equals(test.after)) {
        map[o].set(i, (map[o].get(i) ?? 0) + 1);
        match++;
      }
    }
    if (match >= 3) {
      num++;
    }
  }
  // console.log(map);
  // console.log('------------------------------------------');

  const mapping = Array.init(16, -1);
  let mapped = 0;
  while (mapped < 16) {
    const idx = map.findIndex((m) => m.size === 1);
    if (idx < 0) {
      console.log(map);
      console.log(mapping);
      throw Error('no solution!');
    }
    const ops = map[idx].keys().next().value;
    map[idx].clear();
    if (mapping[idx] >= 0) {
      console.log(map);
      console.log(mapping);
      throw Error('already mapped ' + idx);
    }
    // console.log('adding mapping', idx, ' --> ', ops);
    mapped++;
    mapping[idx] = ops;
    map.forEach((m) => m.delete(ops))
  }
  return [num, mapping];
}

function puzzle2() {
  const code = readCode();
  const map = puzzle1()[1];
  const regs = [0, 0, 0, 0];
  for (const [o, a, b, c] of code) {
    OPS[map[o]](regs, a, b, c);
  }
  return regs[0];
}

console.log('puzzle 1:', puzzle1()[0])
console.log('puzzle 2:', puzzle2());
