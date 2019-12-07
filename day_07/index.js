
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s)=>Number.parseInt(s));
//
// const data = [3,15,3,16,1002,16,10,16,1,16,15,15,4,15,99,0,0];
// const data = [3,23,3,24,1002,24,10,24,1002,23,-1,23, 101,5,23,23,1,24,23,23,4,23,99,0,0]
// const data = [3,52,1001,52,-5,52,3,53,1,52,56,54,1007,54,5,55,1005,55,26,1001,54, -5,54,1105,1,12,1,53,54,53,1008,54,0,55,1001,55,1,55,2,53,55,53,4, 53,1001,56,-1,56,1005,56,6,99,0,0,0,0,10]
class Program {
  constructor(code, input = []) {
    this.code = code;
    this.input = input;
    this.pc = 0;
    this.isRunning = false;
    this.isWaiting = false;
    this.output = [];
  }

  start() {
    this.pc = 0;
    this.isRunning = true;
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
      return m[a] ? p : code[p];
    };

    const sta = (a, v) => {
      const p = code[this.pc + 1 + a];
      code[p] = v;
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

function permute(rest, prefix = []) {
  if (rest.length === 0) {
    return [prefix];
  }
  return (rest
      .map((x, index) => {
        const newRest = [...rest.slice(0, index), ...rest.slice(index + 1)];
        const newPrefix = [...prefix, x];
        return permute(newRest, newPrefix);
      })
      .reduce((flattened, arr) => [...flattened, ...arr], [])
  );
}

function puzzle2() {
  let best = 0;
  let bestAmp = [];
  permute([5, 6, 7, 8, 9]).forEach((settings) => {
    const p0 = new Program(Array.from(data));
    const p1 = new Program(Array.from(data), p0.output);
    const p2 = new Program(Array.from(data), p1.output);
    const p3 = new Program(Array.from(data), p2.output);
    const p4 = new Program(Array.from(data), p3.output);
    p0.input = p4.output;
    const amps = [p0, p1, p2, p3, p4];

    for (let i = 0; i < amps.length; i++) {
      amps[i].input.push(settings[i]);
      amps[i].start();
    }
    p0.input.push(0);
    let stillRunning;
    do {
      stillRunning = false;
      amps.forEach((amp, idx) => {
        amp.run();
        stillRunning |= amp.isRunning;
      });
    } while(stillRunning);

    let value  = p4.output[0];
    if (value > best) {
      best = value;
      bestAmp = settings;
    }
  });
  console.log('result 2: ', best, bestAmp);
}

function puzzle1() {
  let best = 0;
  let bestAmp = [];
  permute([0, 1, 2, 3, 4]).forEach((amps) => {
    let value  = 0;
    amps.forEach((a) => {
      const prog = new Program(Array.from(data),[a, value]);
      prog.start();
      const r0 = prog.run();
      value = r0[0];
    });
    if (value > best) {
      best = value;
      bestAmp = amps;
    }
  });
  console.log('result 1: ', best, bestAmp);
}

puzzle1();
puzzle2();
