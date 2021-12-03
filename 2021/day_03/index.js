
const fs = require('fs');
// p1: 749376
// p2: 2372923

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split('').map((c) => parseInt(c, 10)));

const len = data[0].length;

function countBits(data) {
  const cnt = [
    new Array(len).fill(0),
    new Array(len).fill(0),
  ];
  for (const ns of data) {
    ns.forEach((b, idx) => {
      cnt[b][idx]++;
    });
  }
  const mcb = [];
  const lcb = [];
  for (let p = 0; p < len; p++) {
    if (cnt[0][p] > cnt[1][p]) {
      mcb[p]=0;
      lcb[p]=1;
    } else {
      mcb[p]=1;
      lcb[p]=0;
    }
  }
  return [mcb, lcb];
}

function filter(dat, cb) {
  for (let p = 0; p < len; p++) {
    if (dat.length === 1) {
      break;
    }
    const cmp = countBits(dat)[cb];
    for (let i = 0; i < dat.length; i++) {
      if (dat[i][p] !== cmp[p]) {
        dat.splice(i, 1);
        i--;
      }
    }
  }
  return dat;
}

function puzzle2() {
  let oxy = filter(data.slice(), 0);
  let co2 = filter(data.slice(), 1);
  const oxyv = parseInt(oxy[0].join(''), 2);
  const co2v = parseInt(co2[0].join(''), 2);
  return oxyv * co2v;
}

function puzzle1() {
  const [lcb, mcb] = countBits(data);
  let gamma = 0;
  let epsilon = 0;
  for (let i = len - 1, p = 1; i >= 0; i--, p*=2) {
    epsilon += p*mcb[i];
    gamma += p*lcb[i];
  }
  return gamma * epsilon;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
