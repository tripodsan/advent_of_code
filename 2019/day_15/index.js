
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
  '█', // wall
  '.', // air
  '*', // leak
  'O', // oxygen
];

const screen = [];
let minX = 0;
let minY = 0;
let leakX = 0;
let leakY = 0;

function setPixel(x,y,c) {
  while (y < minY) {
    screen.unshift([]);
    minY--;
  }
  y -= minY;
  while (y >= screen.length) {
    screen.push([]);
  }
  const row = screen[y];

  while (x < minX) {
    screen.forEach((s) => s.unshift(0));
    minX--;
  }

  x -= minX;
  while (x >= row.length) {
    row.push(0);
  }
  row[x] = c;
}
function getPixel(x,y) {
  x -= minX;
  y -= minY;
  if (x < 0 || y < 0 || y >= screen.length) {
    return undefined;
  }
  return screen[y][x];
}

function render(score) {
  process.stdout.write('\u001b[2J\u001b[0;0H');
  screen.forEach((row) => {
    row.forEach((c) => {
      process.stdout.write(CHARS[c])
    });
    process.stdout.write('\n');
  });
  process.stdout.write(`\n\nResult: ${score}\n`);
}

function createTask(tasks, t, d, dx, dy) {
  const x = t.x + dx;
  const y = t.y + dy;
  if (getPixel(x, y)) {
    return;
  }
  tasks.push({
    d: t.d + 1,
    x,
    y,
    p: new Program(Array.from(t.p.code), [d]),
  });
}

async function puzzle1(headless) {
  return new Promise((resolve) => {
    let tasks = [];
    let result = 0;
    const fill = (ts, t) => {
      createTask(ts, t, 1, 0, -1);
      createTask(ts, t, 2, 0, 1);
      createTask(ts, t, 3, -1, 0);
      createTask(ts, t, 4, 1, 0);
    };

    const run = () => {
      const newTasks = [];
      tasks.forEach((t) => {
        const out = t.p.run();
        t.s = out.shift();
        if (t.s === 2) {
          result = t.d;
          leakX = t.x;
          leakY = t.y;
        }
        setPixel(t.x, t.y, t.s + 1);
      });
      tasks.forEach((t) => {
        if (t.s) {
          fill(newTasks, t);
        }
      });
      tasks = newTasks;
      if (!headless) {
        render(result);
        if (tasks.length) {
          setTimeout(run, 16);
        } else {
          resolve();
        }
      }
    };

    setPixel(0, 0, 2);
    fill(tasks, {
      d: 0,
      x: 0,
      y: 0,
      p: new Program(Array.from(data), []),
    });
    if (headless) {
      while (tasks.length) {
        run();
      }
      render(result);
      resolve();
    } else {
      run();
    }
  });
}

function puzzle2(headless) {
  let steps = -1;
  let tasks = [];

  const fill = (ts, t, dx, dy) => {
    const x = t.x + dx;
    const y = t.y + dy;
    if (getPixel(x,y) === 2) {
      ts.push({
        x,
        y,
      });
    }
  };

  const run = () => {
    steps++;
    const newTasks = [];
    tasks.forEach((t) => {
      setPixel(t.x, t.y, 4);
      fill(newTasks, t, 0, -1);
      fill(newTasks, t, 0, 1);
      fill(newTasks, t, -1, 0);
      fill(newTasks, t, 1, 0);
    });
    tasks = newTasks;
    if (!headless) {
      render(steps);
      if (tasks.length) {
        setTimeout(run, 16);
      }
    }
  };
  tasks.push({
    x: leakX,
    y: leakY,
  });

  if (headless) {
    while (tasks.length) {
      run();
    }
    render(steps);
  } else {
    run();
  }
}


puzzle1().then(() => {
  puzzle2();
});
