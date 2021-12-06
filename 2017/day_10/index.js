const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(',')
  .map((s) => parseInt(s.trim()));

function puzzle1(n) {
  let a = new Array(n);
  for (let i = 0; i < n; i++) {
    a[i] = i;
  }
  let pos = 0;
  let skip = 0;

  data.forEach((l) => {
    let t = [...a];
    for (let i = 0; i < l; i++) {
      t[(pos + i) % n] = a[(pos + l - i - 1) % n];
    }
    a = t;
    pos += (l + skip) % n;
    skip ++;
  });

  return a[0] * a[1];
}

function puzzle2(str) {
  const lens = str.split('').map((c) => c.charCodeAt(0));
  lens.push(17, 31, 73, 47, 23);

  let a = new Array(256);
  for (let i = 0; i < 256; i++) {
    a[i] = i;
  }
  let pos = 0;
  let skip = 0;

  for (let round = 0; round < 64; round++) {
    lens.forEach((l) => {
      let t = [...a];
      for (let i = 0; i < l; i++) {
        t[(pos + i) % 256] = a[(pos + l - i - 1) % 256];
      }
      a = t;
      pos += (l + skip) % 256;
      skip++;
    });
  }

  let s = '';
  let x = 0;
  while (a.length) {
    x ^= a.shift();
    if (a.length % 16 === 0) {
      s += x.toString(16).padStart(2, '0');
      x = 0;
    }
  }
  return s;
}

console.log('puzzle 1: ', puzzle1(256));
console.log('puzzle 2: ', puzzle2(fs.readFileSync('./input.txt', 'utf-8').trim()));
