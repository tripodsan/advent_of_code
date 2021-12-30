import { Grid } from '../../utils.js';
import chalk from 'chalk';
import fs from 'fs';

function readCode() {
  /*
#ip 0
seti 5 0 1
seti 6 0 2
   */
  const code = [];
  fs.readFileSync('./input.txt', 'utf-8')
    .split('\n')
    .map((c) => c.trim())
    .filter((c) => !!c)
    .forEach((line) => {
      const segs = line.split(/\s+/).filter((c) => !!c);
      code.push(segs);
      for (let i = 1; i < segs.length; i++) {
        segs[i] = parseInt(segs[i]);
      }
    })
  return code;
}

const OPS = {
  // addr (add register) stores into register C the result of adding register A and register B.
  addr: (regs, a, b, c) => regs[c] = regs[a] + regs[b],
  // addi (add immediate) stores into register C the result of adding register A and value B.
  addi: (regs, a, b, c) => regs[c] = regs[a] + b,
  // mulr (multiply register) stores into register C the result of multiplying register A and register B.
  mulr: (regs, a, b, c) => regs[c] = regs[a] * regs[b],
  // muli (multiply immediate) stores into register C the result of multiplying register A and value B.
  muli: (regs, a, b, c) => regs[c] = regs[a] * b,
  // banr (bitwise AND register) stores into register C the result of the bitwise AND of register A and register B.
  banr: (regs, a, b, c) => regs[c] = regs[a] & regs[b],
  // bani (bitwise AND immediate) stores into register C the result of the bitwise AND of register A and value B.
  bani: (regs, a, b, c) => regs[c] = regs[a] & b,
  // borr (bitwise OR register) stores into register C the result of the bitwise OR of register A and register B.
  borr: (regs, a, b, c) => regs[c] = regs[a] | regs[b],
  // bori (bitwise OR immediate) stores into register C the result of the bitwise OR of register A and value B.
  bori: (regs, a, b, c) => regs[c] = regs[a] | b,
  // setr (set register) copies the contents of register A into register C. (Input B is ignored.)
  setr: (regs, a, b, c) => regs[c] = regs[a],
  // seti (set immediate) stores value A into register C. (Input B is ignored.)
  seti: (regs, a, b, c) => regs[c] = a,
  // gtir (greater-than immediate/register) sets register C to 1 if value A is greater than register B. Otherwise, register C is set to 0.
  gtir: (regs, a, b, c) => regs[c] = a > regs[b] ? 1 : 0,
  // gtri (greater-than register/immediate) sets register C to 1 if register A is greater than value B. Otherwise, register C is set to 0.
  gtri: (regs, a, b, c) => regs[c] = regs[a] > b ? 1 : 0,
  // gtrr (greater-than register/register) sets register C to 1 if register A is greater than register B. Otherwise, register C is set to 0.
  gtrr: (regs, a, b, c) => regs[c] = regs[a] > regs[b] ? 1 : 0,
  // eqir (equal immediate/register) sets register C to 1 if value A is equal to register B. Otherwise, register C is set to 0.
  eqir: (regs, a, b, c) => regs[c] = a === regs[b] ? 1 : 0,
  // eqri (equal register/immediate) sets register C to 1 if register A is equal to value B. Otherwise, register C is set to 0.
  eqri: (regs, a, b, c) => regs[c] = regs[a] === b ? 1 : 0,
  // eqrr (equal register/register) sets register C to 1 if register A is equal to register B. Otherwise, register C is set to 0.
  eqrr: (regs, a, b, c) => regs[c] = regs[a] === regs[b] ? 1 : 0,
};


function puzzle1(reg0 = 0) {
  const code = readCode();
  const ip = code.shift()[1];
  console.log('ip', ip);
  const regs = new Array(6).fill(0);
  regs[0] = reg0;
  while (true) {
    const opc = code[regs[ip]];
    let s = `ip=${regs[ip]} ${regs} ${opc}`;
    if (!opc) {
      break;
    }
    const [o, a, b, c] = opc;
    if (!OPS[o]) {
      throw Error(o);
    }
    OPS[o](regs, a, b, c);
    s += ` ${regs}`;
    // console.log(s);
    regs[ip]++;
  }
  return regs[0];
}

function solve(pn = 1) {
  let r4 = 0;
  const list = [];
  while (true) {
    let r3 = r4 | 0x10000;
    r4 = 3730679;

    while (true) {
      r4 += r3 & 0xff;
      r4 &= 0xFFFFFF;
      r4 *= 0x01016B;
      r4 &= 0xFFFFFF;
      if (r3 < 256) {
        if (pn === 1) {
          return r4;
        }
        if (list.indexOf(r4) < 0) {
          list.push(r4);
          console.log(r4);
        }
        break;
      }
      r3 = Math.floor(r3 / 256);
    }
  }
}


function puzzle2(r5) {
  let r0 = 0
  let r3 = 1
  while (r3 <= r5) {
    if (r5 % r3 === 0) {
      r0 += r3
    }
    r3++;
  }
  return r0;
}

console.log('puzzle 1:', solve(1));
console.log('puzzle 2:', solve(2)); // 7705368
