import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n');


class Program {
  constructor(code) {
    this.code = [];
    this.pc = 0;
    this.reg = {
      a: 0,
      b: 0,
      c: 0,
      d: 0,
    }
    for (const line of code) {
      const [opc, a0, a1] = line.split(/\s+/);
      const ins = {
        opc,
        a0: a0 in this.reg ? a0 : parseInt(a0, 10),
        a1: a1 in this.reg ? a1 : parseInt(a1, 10),
      }
      this.code.push(ins);
    }
  }

  atom(a) {
    if (typeof a === 'number') {
      return a;
    }
    return this.reg[a];
  }

  reset() {
    this.reg.a = 0;
    this.reg.b = 0;
    this.reg.c = 0;
    this.reg.d = 0;
  }

  *run() {
    this.pc = 0;
    while (this.pc < this.code.length) {
      const { opc, a0, a1 } = this.code[this.pc];
      switch (opc) {
        case 'cpy':
          this.reg[a1] = this.atom(a0);
          break;
        case 'inc':
          this.reg[a0]++;
          break;
        case 'dec':
          this.reg[a0]--;
          break;
        case 'jnz':
          if (this.atom(a0)) {
            this.pc += this.atom(a1) - 1;
          }
          break;
        case 'out':
          yield this.atom(a0);
          break;
        default:
          throw Error('syntax error');
      }
      this.pc++;
    }
  }
}
function puzzle1() {
  const prog = new Program(data);
  for (let a = 0; a < 1000; a++) {
    prog.reset();
    prog.reg.a=a;
    let next = 0;
    let iter = 0;
    for (const v of prog.run()) {
      if (v !== next) {
        break;
      }
      next = 1 - next;
      if (iter++ === 1000) {
        return a;
      }
    }
  }
  return -1;
}

console.log('puzzle 1: ', puzzle1());
