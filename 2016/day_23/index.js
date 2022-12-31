import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n');

const TOGGLE = {
  'inc': 'dec',
  'dec': 'inc',
  'tgl': 'inc',
  'cpy': 'jnz',
  'jnz': 'cpy',
}

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
      // console.log(this.pc, opc);
      switch (opc) {
        case 'cpy':
          if (typeof a1 === 'number') {
            break;
          }
          this.reg[a1] = this.atom(a0);
          break;
        case 'inc':
          if (typeof a0 === 'number') {
            break;
          }
          this.reg[a0]++;
          break;
        case 'dec':
          if (typeof a0 === 'number') {
            break;
          }
          this.reg[a0]--;
          break;
        case 'jnz':
          if (this.atom(a0)) {
            this.pc += this.atom(a1) - 1;
          }
          break;
        case 'tgl':
          const idx = this.pc + this.atom(a0);
          if (idx >=0 && idx < this.code.length) {
            this.code[idx].opc = TOGGLE[this.code[idx].opc];
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
  prog.reg.a = 7;

  prog.run();
  return prog.reg.a;
}

function puzzle2() {
  const prog = new Program(data);
  prog.reg.a = 12;
  prog.run();
  return prog.reg.a;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
