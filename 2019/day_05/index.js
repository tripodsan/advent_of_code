
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s)=>Number.parseInt(s));

function run(code, input) {
  const output = [];
  let i = 0;
  let pc = 0;
  while (pc < code.length) {
    const opc = code[pc];
    const m = [
      Math.floor(opc / 100) % 10,
      Math.floor(opc / 1000) % 10,
      Math.floor(opc / 10000) % 10
    ];

    const lda = (a) => {
      const p = code[pc + 1 + a];
      return m[a] ? p : code[p];
    };

    const sta = (a, v) => {
      const p = code[pc + 1 + a];
      code[p] = v;
    };
    const ops = {
      // c = a + b
      '1': () => {
        sta(2, lda(0) + lda(1));
        pc += 4;
      },
      // c = a * b
      '2': () => {
        sta(2, lda(0) * lda(1));
        pc += 4;
      },
      // a = input
      '3': () => {
        sta(0, input[i++]);
        pc += 2;
      },
      // output = a;
      '4': () => {
        output.push(lda(0));
        pc += 2;
      },
      // if (a) jmp b
      '5': () => {
        if (lda(0)) {
          pc = lda(1) - 3;
        }
        pc += 3;
      },
      // if (!a) jmp b
      '6': () => {
        if (!lda(0)) {
          pc = lda(1) - 3;
        }
        pc += 3;
      },
      // c = a < b
      '7': () => {
        sta(2, lda(0) < lda(1) ? 1 : 0);
        pc += 4;
      },
      // c = a == b
      '8': () => {
        sta(2, lda(0) === lda(1) ? 1 : 0);
        pc += 4;
      },
      '99': () => {
        return true;
      }
    };
    const fn = ops[opc % 100];
    if (!fn) {
      throw Error('illegal opcode: ' + opc);
    }
    if (fn()) {
      return output;
    }
  }
}

function puzzle2() {
  const r0 = run(Array.from(data), [5]);
  console.log('result 2: ', r0);
}

function puzzle1() {
  const r0 = run(Array.from(data), [1]);
  console.log('result 1: ', r0);
}

puzzle1();
puzzle2();
