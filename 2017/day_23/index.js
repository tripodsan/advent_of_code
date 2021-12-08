const fs = require('fs');

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
  constructor(data, id) {
    this.id = id;
    this.queue = [];
    this.regs = new Registers();
    this.regs.set('p', id);
    this.pipe = null;
    this.sendCounter = 0;
    this.mulCounter = 0;
    this.pc = 0;
    this.running = true;
    this.waiting = false;

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

  snd(v) {
    this.sendCounter++;
    this.pipe.write(v);
  }

  rcv() {
    if (this.queue.length) {
      return this.queue.shift();
    }
    throw Error('queue empty');
  }

  write(v) {
    this.queue.push(v);
  }

  tick() {
    const { pc } = this;
    this.running = pc >= 0 && pc < this.code.length;
    if (!this.running) {
      return;
    }
    const { op, x, xa, y, ya} = this.code[pc];
    switch (op) {
      // snd X sends a value to the pipe
      case 'snd':
        this.snd(xa());
        break;
      // set X Y sets register X to the value of Y.
      case 'set':
        this.regs.set(x, ya());
        break;
      // add X Y increases register X by the value of Y.
      case 'add':
        this.regs.set(x, this.regs.get(x) + ya());
        break;
      // sub X Y decreases register X by the value of Y.
      case 'sub':
        this.regs.set(x, this.regs.get(x) - ya());
        break;
      // mul X Y sets register X to the result of multiplying the value contained in register X by the value of Y.
      case 'mul':
        this.mulCounter++;
        this.regs.set(x, this.regs.get(x) * ya());
        break;
      // mod X Y sets register X to the remainder of dividing the value contained in register X by the value of Y (that is, it sets X to the result of X modulo Y).
      case 'mod':
        this.regs.set(x, this.regs.get(x) % ya());
        break;
      // rcv X receives a value from the pipe
      case 'rcv':
        try {
          this.waiting = false;
          this.regs.set(x, this.rcv());
        } catch (e) {
          this.waiting = true;
          return;
        }
        break;
      // jgz X Y jumps with an offset of the value of Y, but only if the value of X is greater than zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
      case 'jgz':
        if (xa() > 0) {
          this.pc += ya();
          return;
        }
        break;
      // jnz X Y jumps with an offset of the value of Y, but only if the value of X is not zero. (An offset of 2 skips the next instruction, an offset of -1 jumps to the previous instruction, and so on.)
      case 'jnz':
        if (xa() !== 0) {
          this.pc += ya();
          // console.log(`${pc}`.padStart(4, ' '), op, x, String(y).padStart(3), this.regs.dump());
          return;
        }
        break;
      default:
        throw Error(op);
    }
    // console.log(`${pc}`.padStart(4, ' '), op, x, String(y).padStart(3), this.regs.dump());
    this.pc++;
  }
}

function puzzle1() {
  const p = new Program(data, 0);
  while (p.running) {
    p.tick();
  }
  return p.mulCounter;
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
console.log('puzzle 2: ', puzzle2(107900, 124900));  // 907
