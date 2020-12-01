
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s)=>Number.parseInt(s));

// const data = [109,1,204,-1,1001,100,1,100,1008,100,16,101,1006,101,0,99];
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

const DIRS = [
  [0, -1],
  [1, 0],
  [0, 1],
  [-1, 0],
];

function getColor(map, pos, def) {
  const key = `${pos[0]},${pos[1]}`;
  const i = map[key];
  if (!i) {
    return def;
  }
  return i.c;
}
function setColor(map, pos, c) {
  const key = `${pos[0]},${pos[1]}`;
  map[key] = {
    c,
    x: pos[0],
    y: pos[1],
  };
}

function paint(defColor) {
  const hull = {};
  const pos = [0, 0];
  let dir = 0;
  let xMin = Number.MAX_SAFE_INTEGER;
  let xMax = Number.MIN_SAFE_INTEGER;
  const prog = new Program(Array.from(data));
  while (prog.isRunning) {
    prog.input.push(getColor(hull, pos, defColor));
    const out = prog.run();
    while (out.length > 0) {
      setColor(hull, pos, out.shift());
      xMin = Math.min(xMin, pos[0]);
      xMax = Math.max(xMax, pos[0]);
      if (out.shift() === 0) {
        dir = (dir + 3) % 4;
      } else {
        dir = (dir + 1) % 4;
      }
      pos[0] += DIRS[dir][0];
      pos[1] += DIRS[dir][1];
    }
  }
  return [Object.values(hull), xMin, xMax];
}

function puzzle2() {
  const [hull, xMin, xMax] = paint(1);
  hull.sort((p0, p1) => {
    const d = p0.y - p1.y;
    return d === 0 ? p0.x - p1.x : d;
  });
  let x = xMin;
  let y = hull[0].y;
  console.log('result 2:');
  const w = process.stdout.write.bind(process.stdout);
  hull.forEach((p) => {
    if (p.y > y) {
      while (x++ <= xMax) {
        w('.');
      }
      x = xMin;
      while (y < p.y) {
        w('\n');
        y++;
      }
    }
    if (x < p.x) {
      w('.');
      x++;
    }
    w(p.c === 0 ? '.' : '█');
    x++;
  });
  while (x++ <= xMax) {
    w('-');
  }
  w('\n');
}

function puzzle1() {
  const [hull, xMin, xMax] = paint(0);
  console.log('result 1: ', hull.length);
}

puzzle1();
puzzle2();
