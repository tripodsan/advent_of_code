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
    }
    for (const line of code) {
      const [opc, a0, a1] = line.split(/[\s,]+/);
      const ins = {
        opc,
        a0: a0 in this.reg ? a0 : parseInt(a0, 10),
        a1: parseInt(a1, 10),
      }
      this.code.push(ins);
    }
  }

  run() {
    while (this.pc < this.code.length) {
      const { opc, a0, a1 } = this.code[this.pc];
      switch (opc) {
        case 'hlf':
          this.reg[a0] >>= 1;
          break;
        case 'tpl':
          this.reg[a0] *= 3;
          break;
        case 'inc':
          this.reg[a0]++;
          break;
        case 'jmp':
          this.pc += a0 - 1;
          break;
        case 'jie':
          if (this.reg[a0] % 2 === 0) {
            this.pc += a1 - 1;
          }
          break;
        case 'jio':
          if (this.reg[a0] === 1) {
            this.pc += a1 - 1;
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
  return prog.reg.b;
}

function puzzle2() {
  const prog = new Program(data);
  prog.reg.a = 1;
  prog.run();
  return prog.reg.b;
}

console.log('puzzle 1: ', puzzle1()); // 307
console.log('puzzle 2: ', puzzle2()); // 160
