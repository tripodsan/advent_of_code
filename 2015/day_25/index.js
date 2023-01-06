import '../../utils.js';

const START = 20151125;

const P = 252533;
const M = 33554393;

const CX = 3019;
const CY = 3010;

function puzzle1() {
  let prev = START;
  for (let y = 2; y <= CY * CX; y++) {
    for (let x = 0; x < y; x++) {
      const yy = y - x;
      const xx = x + 1;
      const n = (prev * P) % M;
      // console.log(yy, xx, n);
      if (yy === CY && xx === CX) {
        return n;
      }
      prev = n;
    }
  }
}

console.log('puzzle 1: ', puzzle1());
