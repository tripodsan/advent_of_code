
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split(',')
  .map((s)=>Number.parseInt(s));

function run(code) {
  for (let i = 0; i< code.length; i+=4) {
    switch (code[i]) {
      case 1:
        code[code[i+3]] = code[code[i+1]] + code[code[i+2]];
        break;
      case 2:
        code[code[i+3]] = code[code[i+1]] * code[code[i+2]];
        break;
      case 99:
        return code[0];
      default:
        throw Error('illegal opcode');
    }
  }
}

function puzzle2() {
  for (let x = 0; x<10000; x++) {
    const code = Array.from(data);
    code[1] = Math.floor(x / 100);
    code[2] = x % 100;
    const r = run(code);
    if (r === 19690720) {
      console.log('result 2: ' + x);
      break;
    }
  }
}

function puzzle1() {
  const code = Array.from(data);
  code[1] = 12;
  code[2] = 2;
  const r0 = run(code);

  console.log('result 1: ' + r0);
}

puzzle1();
puzzle2();
