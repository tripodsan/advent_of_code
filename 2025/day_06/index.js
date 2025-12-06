import fs from 'fs';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .filter((line) => !!line)


const OPS = {
  '+': (a, b) => a + b,
  '*': (a, b) => a * b,
}

const ops = data.pop().split('')
  .map((c, idx) => ({
  op: OPS[c],
  idx,
    v0: c === '+' ? 0 : 1,
})).filter((o) => !!o.op);
ops.push({ idx: data[0].length + 1})

// console.log(data);
// console.log(ops);

function puzzle1() {
  let total = 0;
  for (let i = 0; i < ops.length - 1; i += 1) {
    const { op, idx, v0 } = ops[i];
    let v = v0;
    for (const line of data) {
      const num = line.substring(idx, ops[i + 1].idx);
      // console.log(num);
      v = op(v, parseInt(num, 10))
    }
    total += v;
  }
  return total;
}

function puzzle2() {
  let total = 0;
  for (let i = 0; i < ops.length - 1; i += 1) {
    const { op, idx, v0 } = ops[i];
    let v = v0;
    // for each column
    for (let j = idx; j < ops[i + 1].idx - 1; j += 1) {
      let d = 0;
      for (let k = 0; k < data.length; k += 1) {
        const c = data[k].charCodeAt(j) - 48;
        if (c > 0 && c < 10) {
          d = d * 10 + c;
        }
      }
      // console.log(d);
      v = op(v, d);
    }
    total += v;
  }
  return total;
}

console.log('puzzle 1: ', puzzle1()); // 6725216329103
console.log('puzzle 2: ', puzzle2()); // 354226555270043
