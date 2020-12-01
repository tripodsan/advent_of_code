
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


function computeGrid(output, pos = [0, 0]) {
  let x = 0;
  let y = 0;
  const grid = [];
  let row = ['.'];
  output.forEach((c) => {
    if (c === 10) {
      if (row.length > 1) {
        row.push('.');
        grid.push(row);
        y++;
      }
      row = ['.'];
      x = 0;
      return;
    }
    const chr = String.fromCharCode(c);
    if (chr === '^') {
      pos[0] = x+1;
      pos[1] = y+2;
    }
    row.push(chr);
    x++;
  });
  grid.unshift('.'.repeat(grid[0].length).split(''));
  grid.push('.'.repeat(grid[0].length).split(''));
  return grid;
}

function renderGrid(grid) {
  grid.forEach((row) => {
    row.forEach((c) => {
      process.stdout.write(c);
    });
    process.stdout.write('\n');
  })
}

function getPix(grid, pos, dir = [0, 0]) {
  const y = pos[1] + dir[1];
  const x = pos[0] + dir[0];
  return grid[y][x];
}

function puzzle1() {
  const p = new Program(Array.from(data), []);
  const out = p.run();
  const grid = computeGrid(out);
  const maxX = grid[0].length;
  let s = 0;
  for (let y = 1; y < grid.length - 1; y++) {
    for (let x = 1; x < maxX - 1; x++) {
      if (grid[y][x] === '#'
        && grid[y-1][x] === '#'
        && grid[y+1][x] === '#'
        && grid[y][x-1] === '#'
        && grid[y][x+1] === '#') {
        s += (x-1)*(y-1);
        grid[y][x] = 'O';
      }
    }
  }
  renderGrid(grid);
  console.log('Result 1:', s);
}

function toAscii(s) {
  return s.split('').map((x) => x.charCodeAt(0));
}

const wait = (delay) => new Promise((resolve) => setTimeout(resolve, delay));

async function puzzle2() {
  const code = Array.from(data);
  let p = new Program(code, []);
  const pos = [0, 0];
  const grid = computeGrid(p.run(), pos);

  // process.stdout.write('\u001b[2J\u001b[0;0H');
  // renderGrid(grid);

  const DIRS = [
    [0, -1],
    [1, 0],
    [0, 1],
    [-1, 0],
  ];
  let dir = 0;
  let s = 1;
  let path = [];
  for (;;) {
    pos[0] += DIRS[dir][0];
    pos[1] += DIRS[dir][1];
    grid[pos[1]][pos[0]] = '*';
    // process.stdout.write('\u001b[0;0H\u001b[2J');
    // renderGrid(grid);
    // console.log(path.join(''));

    const c = getPix(grid, pos, DIRS[dir]);
    if (c === '#' || c === '*') {
      s++;
    } else if (getPix(grid, pos, DIRS[(dir+1)%4]) === '#') {
      if (s > 1) {
        path.push(`${s}`);
      }
      dir = (dir + 1)%4;
      path.push('R');
      s = 1;
    } else if (getPix(grid, pos, DIRS[(dir+3)%4]) === '#') {
      if (s > 1) {
        path.push(`${s}`);
      }
      dir = (dir + 3)%4;
      path.push('L');
      s = 1;
    } else {
      if (s > 1) {
        path.push(`${s}`);
      }
      break;
    }
    // await wait(20);
  }

  // console.log(path.join(','));

  const patterns = {};
  for (let l = 2; l < path.length/2; l++) {
    for (let i = 0; i < path.length - l; i++) {
      const pat = path.slice(i, i + l);
      if (pat.join(',').length <= 20) {
        const key = pat.join('');
        patterns[key] = {
          key,
          pat,
        }
      }
    }
  }

  const list = Object.values(patterns);
  list.sort((p0, p1) => {
    return p1.pat.length - p0.pat.length
  });

  function find() {
    for (let a = 0; a < list.length - 2; a++) {
      for (let b = a + 1; b < list.length - 1; b++) {
        for (let c = b + 1; c < list.length; c++) {
          const patA = list[a].key;
          const patB = list[b].key;
          const patC = list[c].key;
          let str = path.join('');
          str = str.replace(new RegExp(patA, 'g'), 'A');
          str = str.replace(new RegExp(patB, 'g'), 'B');
          str = str.replace(new RegExp(patC, 'g'), 'C');
          if (str.indexOf('R') < 0
            && str.indexOf('L') < 0
            && str.indexOf('6') < 0
            && str.indexOf('2') < 0
            && str.indexOf('8') < 0
          ) {
            return {
              main: str.split('').join(','),
              a: list[a].pat.join(','),
              b: list[b].pat.join(','),
              c: list[c].pat.join(','),
            };
          }
        }
      }
    }
  }
  const best = find();
  // console.log(best);

  p = new Program(Array.from(data), [
    ...toAscii(best.main), 10,
    ...toAscii(best.a), 10,
    ...toAscii(best.b), 10,
    ...toAscii(best.c), 10,
    ...toAscii('n'), 10,
  ]);
  p.code[0] = 2;

  p.run();
  // process.stdout.write('\u001b[2J\u001b[0;0H');
  // process.stdout.write(String.fromCharCode(...p.output));
  console.log('Result 2:', p.output.pop());

  // const maxOutput = (grid.length-2) * (grid[0].length-1);
  // while (p.isRunning) {
  //   p.step();
  //   if (p.output.length > maxOutput) {
  //     process.stdout.write('\u001b[2J\u001b[0;0H');
  //     process.stdout.write(String.fromCharCode(...p.output));
  //     p.output = [];
  //     await wait(100);
  //   }
  // }
}


puzzle1();
puzzle2().then();

