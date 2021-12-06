const fs = require('fs');

/*
b inc 5 if a > 1
a inc 1 if b < 5
c dec -10 if a >= 1
c inc -20 if c == 10
 */

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/).filter((c) => !!c));

const COND = {
  '>': (a, b) => (a > b),
  '<': (a, b) => (a < b),
  '>=': (a, b) => (a >= b),
  '<=': (a, b) => (a <= b),
  '==': (a, b) => (a === b),
  '!=': (a, b) => (a !== b),
}

const OP = {
  'inc': (r, v) => (r + v),
  'dec': (r, v) => (r - v),
}

class Registers {
  constructor() {
    this.regs = new Map();
    this.biggest = Number.MIN_SAFE_INTEGER;
  }

  get(r) {
    return this.regs.get(r) ?? 0;
  }

  set(r, v) {
    this.biggest = Math.max(this.biggest, v);
    return this.regs.set(r, v);
  }

  max() {
    let max = Number.MIN_SAFE_INTEGER;
    for (const v of this.regs.values()) {
      max = Math.max(v, max);
    }
    return max;
  }
}

class Program {
  constructor(data) {
    this.regs = new Registers();
    this.code = data.map((line) => {
      const [r, op, arg, _, cr, cnd, cv] = line;
      return {
        r,
        op: OP[op],
        arg: parseInt(arg, 10),
        cr,
        cnd: COND[cnd],
        cv: parseInt(cv, 10),
      }
    });
  }

  run() {
    this.code.forEach((ins) => {
      const crv = this.regs.get(ins.cr);
      if (ins.cnd(crv, ins.cv)) {
        let r = this.regs.get(ins.r);
        r = ins.op(r, ins.arg);
        this.regs.set(ins.r, r);
      }
    })
  }
}

function puzzle1() {
  const prog = new Program(data);
  prog.run();
  return prog.regs.max();
}

function puzzle2() {
  const prog = new Program(data);
  prog.run();
  return prog.regs.biggest;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
