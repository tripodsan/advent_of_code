import fs from 'fs';
import { counter, rangedCounter } from '../../utils.js';

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/).filter((c) => !!c));

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

  dump() {
    const s = [];
    [...this.regs.keys()].sort().forEach((n) => {
      s.push(`${n}: ${String(this.regs.get(n)).padStart(4)}`);
    });
    return s.join(' ');
  }
}

class Program {
  constructor(data) {
    this.regs = new Registers();
    this.input = [];
    this.running = true;
    this.pc = 0;

    const atomize = (a) => {
      const v = parseInt(a, 10);
      if (Number.isNaN(v)) {
        return () => this.regs.get(a);
      } else {
        return () => v;
      }
    }

    this.code = data.map((line) => {
      const [op, x, y] = line;
      return {
        op,
        x,
        xa: atomize(x),
        y,
        ya: atomize(y),
      }
    });
  }

  tick() {
    const { pc } = this;
    this.running = pc >= 0 && pc < this.code.length;
    if (!this.running) {
      return;
    }

    const { op, x, xa, y, ya} = this.code[pc];
    switch (op) {
      // inp a - Read an input value and write it to variable a.
      case 'inp':
        this.regs.set(x, this.input.shift());
        break;
      // add a b - Add the value of a to the value of b, then store the result in variable a.
      case 'add':
        this.regs.set(x, this.regs.get(x) + ya());
        break;
      // mul a b - Multiply the value of a by the value of b, then store the result in variable a.
      case 'mul':
        this.regs.set(x, this.regs.get(x) * ya());
        break;
      //  div a b - Divide the value of a by the value of b, truncate the result to an integer, then store the result in variable a. (Here, "truncate" means to round the value toward zero.)
      case 'div':
        const d = ya();
        if (d === 0) {
          throw Error('crash. div by 0');
        }
        this.regs.set(x, Math.trunc(this.regs.get(x) / ya()));
        break;
      // mod a b - Divide the value of a by the value of b, then store the remainder in variable a. (This is also called the modulo operation.)
      case 'mod':
        // a<0 or b<=0
        const a = this.regs.get(x);
        const b = ya();
        if (a<0 || b <= 0) {
          throw Error('crash. mod by 0');
        }
        this.regs.set(x, a % b);
        break;
      // eql a b - If the value of a and b are equal, then store the value 1 in variable a. Otherwise, store the value 0 in variable a.
      case 'eql':
        this.regs.set(x, this.regs.get(x) === ya() ? 1 : 0);
        break;
      default:
        throw Error(op);
    }
    console.log(`${pc}`.padStart(4, ' '), op, x, String(y).padStart(3), this.regs.dump());
    this.pc++;
  }
}

function puzzle1() {
  const p = new Program(data);
  // p.input = '99999795919456'.split('').map((c) => Number.parseInt(c, 10));
  p.input = '45311191516111'.split('').map((c) => Number.parseInt(c, 10));
  while (p.running) {
    p.tick();
  }
  console.log(p.regs.dump())
}

function puzzle2(b, c) {
  let h = 0;
  for (let n = b; n <= c; n += 17) {
    for (let d = 2; d < n; d++) {
      if (n % d === 0) {
        h += 1;
        break;
      }
    }
  }
  return h;
}



console.log('puzzle 1: ', puzzle1());  // 5929
// console.log('puzzle 2: ', puzzle2(107900, 124900));  // 907
