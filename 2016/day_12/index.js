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

  run() {
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
        default:
          throw Error('syntax error');
      }
      this.pc++;
    }
  }
}
function puzzle1() {
  const prog = new Program(data);
  prog.run();
  return prog.reg.a;
}

function puzzle2() {
  const prog = new Program(data);
  prog.reg.c = 1;
  prog.run();
  return prog.reg.a;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
