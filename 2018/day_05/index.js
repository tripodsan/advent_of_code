require('../../utils.js');

const fs = require('fs');

const CA = 'a'.charCodeAt(0);
const CAU = 'A'.charCodeAt(0);

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('')
  .map((c) => {
    const cc = c.charCodeAt(0);
    return cc < CA ? cc - CAU + 1 : CA - cc - 1;
  })


// console.log(data);

function reduce(poly) {
  poly = Array.from(poly);
  let pos = 0;
  while (pos < poly.length - 1) {
    if (poly[pos] + poly[pos+1] === 0) {
      poly.splice(pos, 2);
      pos = Math.max(0, pos - 1);
    } else {
      pos++;
    }
  }
  return poly;
}

function puzzle2() {
  const poly = reduce(data);
  let best = poly.length;
  for (let i = 1; i <=26; i++) {
    const p = poly.flatMap( (c) => Math.abs(c) === i ? [] : [c]);
    const r = reduce(p);
    // console.log(i, p.length, '->', r.length);
    best = Math.min(best, r.length);
  }
  return best;
}



function puzzle1() {
  const poly = reduce(data);
  return poly.length;
}

console.log('puzzle 1:', puzzle1()); // 11042
console.log('puzzle 2:', puzzle2()); // 11042


