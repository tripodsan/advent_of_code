
const fs = require('fs');
const A = 'a'.charCodeAt(0);
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(''));

function puzzle2() {
  for (let i = 0; i < data.length - 1; i++) {
    const a = data[i];
    for (let j = i + 1; j < data.length; j++) {
      let miss = 0;
      const b = data[j];
      for (let x = 0; x < a.length; x++) {
        if (a[x] !== b[x]) {
          miss++;
          if (miss > 1) {
            break;
          }
        }
      }
      if (miss === 1) {
        return a.filter((c, idx) => a[idx] === b[idx]).join('');
      }
    }
  }
}

function puzzle1() {
  let twos = 0;
  let threes = 0;
  for (const box of data) {
    const cnt = [];
    box
      .map((c) => c.charCodeAt(0) - A)
      .forEach((b) => {
      cnt[b] = cnt[b] ? cnt[b] + 1 : 1;
    });
    if (cnt.indexOf(2) >= 0) {
      twos++;
    }
    if (cnt.indexOf(3) >= 0) {
      threes++;
    }
  }
  return twos * threes;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
