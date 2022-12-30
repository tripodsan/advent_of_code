import crypto from 'crypto';
import fs from 'fs';

// const ID = 'abc';
const ID = 'ngcjuoqr';

const RE3 = /(.)\1\1/;

const FOAK = {};
'0123456789abcdef'.split('').forEach((c) => FOAK[c] = c.repeat(5));

const cache = [];

function hash(i, n) {
  if (cache[i]) {
    return cache[i];
  }
  let chk = `${ID}${i}`;
  for (let j = 0; j <= n; j++) {
    chk = crypto
      .createHash('md5')
      .update(chk, 'utf-8')
      .digest('hex');
  }
  cache[i] = chk;
  return chk;
}

function generate(n = 0) {
  let i = 0;
  const keys = [];
  while (keys.length < 64) {
    const key = hash(i, n);
    const m = key.match(RE3);
    if (m) {
      const pat = FOAK[m[1]];
      for (let j = 1; j <= 1000; j++) {
        if (hash(i + j, n).indexOf(pat) >= 0) {
          keys.push({
            key,
            i,
          });
          console.log(keys.length, key, i);
          break;
        }
      }
    }
    i++;
  }
  return keys;
}
function puzzle1() {
  const keys = generate();
  return keys[63].i;
}

function puzzle2() {
  cache.fill(null);
  const keys = generate(2016);
  return keys[63].i;
}

console.log('puzzle 1: ', puzzle1()); // 18626
console.log('puzzle 2: ', puzzle2()); // 20092
