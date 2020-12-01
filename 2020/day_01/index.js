
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> Number(s.trim()))
  .filter((n) => n > 0);


function puzzle2() {
  for (let i = 0; i < data.length; i += 1) {
    const a = data[i];
    for (let j = i + 1; j < data.length; j += 1) {
      const b = data[j];
      for (let k = j + 1; k < data.length; k += 1) {
        const c = data[k];
        if (a + b + c === 2020) {
          console.log('result puzzle 2:', `${a} * ${b} * ${c} = `, a*b*c);
          return;
        }
      }
    }
  }
  console.log('no solution');
}

function puzzle1() {
  for (let i = 0; i < data.length; i += 1) {
    const a = data[i];
    for (let j = i + 1; j < data.length; j += 1) {
      const b = data[j];
      if (a + b === 2020) {
        console.log('result puzzle 1:', `${a} * ${b} = `, a*b);
        return;
      }
    }
  }
  console.log('no solution');
}

puzzle1();
puzzle2();
