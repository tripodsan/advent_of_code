require('../utils.js');
const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) =>
    s.split('|')
      .map((c) => c.trim())
      .map((c) => c.split(/\s+/)
        .map((d) => d.split('').sort()))
  );



/*

  0:      1:      2:      3:      4:
 aaaa    ....    aaaa    aaaa    ....
b    c  .    c  .    c  .    c  b    c
b    c  .    c  .    c  .    c  b    c
 ....    ....    dddd    dddd    dddd
e    f  .    f  e    .  .    f  .    f
e    f  .    f  e    .  .    f  .    f
 gggg    ....    gggg    gggg    ....

  5:      6:      7:      8:      9:
 aaaa    aaaa    aaaa    aaaa    aaaa
b    .  b    .  .    c  b    c  b    c
b    .  b    .  .    c  b    c  b    c
 dddd    dddd    ....    dddd    dddd
.    f  e    f  .    f  e    f  .    f
.    f  e    f  .    f  e    f  .    f
 gggg    gggg    ....    gggg    gggg

 0 -> 6
 1 -> 2
 2 -> 5
 3 -> 5
 4 -> 4
 5 -> 5
 6 -> 6
 7 -> 3
 8 -> 7
 9 -> 6
 */
const DIGITS = {
  abcefg: 0,
  cf: 1,
  acdeg: 2,
  acdfg: 3,
  bcdf: 4,
  abdfg: 5,
  abdefg: 6,
  acf: 7,
  abcdefg: 8,
  abcdfg: 9,
}

const map = {
  5: [2, 3, 5],
  2: [1],
  3: [7],
  4: [4],
  6: [0, 6, 9],
  7: [8],
}

// console.log(data);

function puzzle1() {
  let simple = 0;
  data.forEach((line) => {
    const [pats, digits] = line;
    digits.forEach((segs) => {
      if (map[segs.length].length === 1) {
        simple++;
      }
    })
  })
  return simple;
}

function sub(a, b) {
  const ret = [];
  for (const d of a) {
    if (b.indexOf(d) < 0) {
      ret.push(d);
    }
  }
  return ret;
}

function intersect(...a) {
  let ret = a[0];
  for (let i = 1; i < a.length; i++) {
    let r1 = [];
    for (const d of a[i]) {
      if (ret.indexOf(d) >= 0) {
        r1.push(d);
      }
    }
    ret = r1;
  }
  return ret;
}

function puzzle2() {
  let sum = 0;
  for (const [pats, digits] of data) {
    const byLength = new Array(10);
    const segMapping = {};
    for (let i = 0; i < 10; i++) {
      byLength[i] = [];
    }
    for (const segs of pats) {
      byLength[segs.length].push(segs);
    }

    const abcdefg = byLength[7][0];
    const acf = byLength[3][0];
    const cf = byLength[2][0];
    const bcdf = byLength[4][0];
    const a = sub(acf, cf);
    const bd = sub(bcdf, cf);
    const abfg = intersect(...byLength[6]);
    const cde = sub(abcdefg, abfg);
    const e = sub(cde, bcdf);
    const bf = sub(bcdf, cde);
    const f = intersect(bf, cf);
    const b = sub(bf, f);
    const c = sub(cf, f);
    const d = sub(bd, b);
    const bg = sub(abfg, acf);
    const g = sub(bg, b);

    segMapping[a] = 'a';
    segMapping[b] = 'b';
    segMapping[c] = 'c';
    segMapping[d] = 'd';
    segMapping[e] = 'e';
    segMapping[f] = 'f';
    segMapping[g] = 'g';

    const out = digits.map((digit) => {
      const pat = digit.map((t) => segMapping[t]).sort().join('');
      return DIGITS[pat];
    }).join('');

    sum += parseInt(out, 10);
    // console.log(out);
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1()); // 264
console.log('puzzle 2: ', puzzle2()); // 1063760
