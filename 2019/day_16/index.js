const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('')
  .map((c) => +c);

function apply(d) {
  // first row is different
  let prev = d[0];
  let part = d[0];
  let s = 0;
  let j = 0;
  const len = d.length;
  while (j < len) {
    s += d[j] || 0;
    j+= 2;
    s -= d[j] || 0;
    j+= 2;
  }
  d[0] = Math.abs(s)%10;
  for (let i = 1; i < len; i++) {
    const ip1 = i+1;
    // update first batch of 1s
    part -= prev;
    prev = d[i];
    let j = i + (i + 1) - 2;
    part += d[j++] || 0;
    part += d[j++] || 0;
    let s = part;
    while (j < len) {
      // 0
      j += ip1;
      // -1
      const l = Math.min(j + ip1, len);
      while (j < l) {
        s -= d[j++];
      }
      // 0
      j += ip1;
      // 1
      const l1 = Math.min(j + ip1, len);
      while (j < l1) {
        s += d[j++];
      }
    }
    d[i] = Math.abs(s)%10;
  }
}

function apply1(d) {
  const len = d.length;
  let s = 0;
  for (let i = len - 1; i >=0; i--) {
    s += d[i];
    d[i] = s % 10;
  }
}

function puzzle2() {
  let d = [];
  for (let n = 0; n <10000;n++) {
    d.push(...data);
  }
  const offset = Number.parseInt(data.slice(0, 7).join(''), 10);
  d = d.slice(offset);
  for (let i = 0; i<100; i++) {
    apply1(d);
  }
  console.log('result 2: ', d.slice(0, 8).join(''));
}

function puzzle1() {
  const d = Array.from(data);
  for (let i = 0; i<100; i++) {
    apply(d);
  }
  console.log('result 1: ', d.join('').substring(0,8));
}

puzzle1(); // 94960436
puzzle2();
