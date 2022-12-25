import fs from 'fs';


const TEST = false;

const SNAFU = {
  '2': 2,
  '1': 1,
  '0': 0,
  '-': -1,
  '=': -2,
}

const data = fs.readFileSync(TEST ? './input_test.txt' : './input.txt', 'utf-8')
  .trim().split('\n').map((s) => s.split('').map((s) => SNAFU[s]));

// console.log(data);


function toInt(s) {
  let pow = 1;
  let v = 0;
  while (s.length) {
    v += s.pop() * pow;
    pow *= 5;
  }
  return v;
}

function toSnafu(d) {
  const UFANS = [0, 1, 2, '=', '-'];
  let s = [];
  while (d) {
    const r = d % 5;
    s.unshift(UFANS[r]);
    if (r >= 3) {
      d += 5;
    }
    d = Math.floor(d / 5);
  }
  return s.join('');
}

function puzzle1() {
  let s = 0;
  for (let v of data) {
    s += toInt(v);
  }
  return toSnafu(s);
}

console.log('puzzle 1 : ', puzzle1());
