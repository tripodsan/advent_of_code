
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

const CHARS = [
  ' ',
  '█',
  'x',
  '_',
  '.',
];

const screen = [];

function setPixel(x,y,c) {
  if (!screen[y]) {
    screen[y] = [];
  }
  screen[y][x] = c;
}

function render() {
  screen.forEach((row, y) => {
    row.forEach((c, x) => {
      process.stdout.write(CHARS[c])
    });
    process.stdout.write('\n');
  });
}

function puzzle2() {
  const prog = new Program(Array.from(data));
  // insert coin :-)
  prog.code[0] = 2;

  let score = 0;
  const run = () => {
    const out = prog.run();
    let ball = 0;
    let pad = 0;
    while (out.length > 0) {
      const x = out.shift();
      const y = out.shift();
      const c = out.shift();
      if (x === -1) {
        score = c;
      } else {
        if (c === 4) {
          ball = x;
        } else if (c === 3) {
          pad = x;
        }
        setPixel(x, y, c);
      }
    }
    prog.input.push(Math.sign(ball - pad));
    process.stdout.write('\u001b[2J\u001b[0;0H');
    render();
    process.stdout.write(`\n\nSCORE: ${score}\n`);
    if (prog.isRunning) {
      setTimeout(run, 10);
    }
  };
  run();
}

function puzzle1() {
  let numBlocks = 0;
  const prog = new Program(Array.from(data));
  while (prog.isRunning) {
    const out = prog.run();
    while (out.length > 0) {
      const x = out.shift();
      const y = out.shift();
      const c = out.shift();
      setPixel(x, y, c);
      if (c === 2) {
        numBlocks++;
      }
    }
  }
  render();
  console.log('Result 1:', numBlocks);
}

// puzzle1();
puzzle2();
