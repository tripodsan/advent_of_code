
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s)=>Number.parseInt(s));

class Program {
  constructor(code, input = []) {
    this.code = code;
    this.input = input;
    this.pc = 0;
    this.isRunning = true;
    this.isWaiting = false;
    this.output = [];
    this.relBase = 0;
    this.idle = 0;
  }

  run() {
    if (this.isWaiting && this.input.length > 0) {
      this.isWaiting = false;
    }
    while (this.isRunning && !this.isWaiting) {
      this.step();
    }
    return this.output;
  }

  step() {
    const { code } = this;
    const opc = code[this.pc];
    const m = [
      Math.floor(opc / 100) % 10,
      Math.floor(opc / 1000) % 10,
      Math.floor(opc / 10000) % 10
    ];

    const lda = (a) => {
      const p = code[this.pc + 1 + a];
      switch (m[a]) {
        case 0: return code[p] || 0;
        case 1: return p;
        case 2: return code[p + this.relBase] || 0;
      }
      throw Error('illegal parameter mode: ' + m[a]);
    };

    const sta = (a, v) => {
      const p = code[this.pc + 1 + a];
      switch (m[a]) {
        case 0: code[p] = v; return;
        case 1: break;
        case 2: code[p + this.relBase] = v; return;
      }
      throw Error('illegal parameter mode: ' + m[a]);
    };

    const ops = {
      // c = a + b
      '1': () => {
        sta(2, lda(0) + lda(1));
        this.pc += 4;
      },
      // c = a * b
      '2': () => {
        sta(2, lda(0) * lda(1));
        this.pc += 4;
      },
      // a = input
      '3': () => {
        if (this.input.length === 0) {
          this.isWaiting = true;
          return;
        }
        sta(0, this.input.shift());
        this.isWaiting = false;
        this.pc += 2;
      },
      // output = a;
      '4': () => {
        this.output.push(lda(0));
        this.pc += 2;
      },
      // if (a) jmp b
      '5': () => {
        if (lda(0)) {
          this.pc = lda(1) - 3;
        }
        this.pc += 3;
      },
      // if (!a) jmp b
      '6': () => {
        if (!lda(0)) {
          this.pc = lda(1) - 3;
        }
        this.pc += 3;
      },
      // c = a < b
      '7': () => {
        sta(2, lda(0) < lda(1) ? 1 : 0);
        this.pc += 4;
      },
      // c = a == b
      '8': () => {
        sta(2, lda(0) === lda(1) ? 1 : 0);
        this.pc += 4;
      },
      // relBase += a
      '9': () => {
        this.relBase += lda(0);
        this.pc += 2;
      },
      // terminate
      '99': () => {
        this.isRunning = false;
      }
    };
    const fn = ops[opc % 100];
    if (!fn) {
      throw Error('illegal opcode: ' + opc);
    }
    fn();
  }
}

function puzzle1() {
  const progs = [];
  for (let i = 0; i<50; i++) {
    progs.push(new Program(Array.from(data), [ i ]));
  }
  let result = undefined;
  while (result === undefined) {
    progs.forEach((p) => {
      if (p.isWaiting) {
        p.input.push(-1);
        p.isWaiting = false;
      }
      if (p.isRunning) {
        p.step();
        if (p.output.length > 2) {
          const [a, x, y] = p.output.splice(0, 3);
          if (a === 255) {
            result = y;
            return;
          }
          progs[a].input.push(x, y);
          progs[a].isWaiting = false;
        }
      }
    });
  }
  console.log('Result 1:', result);
}

function puzzle2() {
  const progs = [];
  for (let i = 0; i<50; i++) {
    progs.push(new Program(Array.from(data), [ i ]));
  }
  let result = undefined;
  let natX = -1;
  let natY = -1;
  let prevY = -2;
  while (result === undefined) {
    progs.forEach((p) => {
      if (p.isWaiting) {
        p.input.push(-1);
        p.isWaiting = false;
        p.idle++;
      }
      if (p.isRunning) {
        p.step();
        if (p.output > 0) {
          p.idle = 0;
        }
        if (p.output.length > 2) {
          const [a, x, y] = p.output.splice(0, 3);
          if (a === 255) {
            natX = x;
            natY = y;
          } else {
            progs[a].input.push(x, y);
            progs[a].isWaiting = false;
          }
        }
      }
    });
    const notIdle = progs.find((p) => p.idle < 10);
    if (!notIdle && natX >= 0) {
      console.log('idle', natX, natY);
      progs[0].input.push(natX, natY);
      progs[0].isWaiting = false;
      progs.forEach((p) => p.idle = 0);
      if (prevY === natY) {
        result = natY;
      }
      prevY = natY;
      natX = -1;
      natY = -1;
    }
  }
  console.log('Result 2:', result);
}

puzzle1();
puzzle2();

