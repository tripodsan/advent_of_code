import fs from 'fs';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => {
    const [map, chk] = s.split(/\s+/);
    return {
      map: map.split(''),
      chk: chk.split(',').map((s) => parseInt(s, 10)),
    };
  });

function spans(map, pos, len) {
  // if any of the position is reserved by a `.`, it cannot span
  for (let i = 0; i < len; i++) {
    if (map[pos + i] === '.') {
      return false;
    }
  }
  // left and right edge must not be a '#'
  return (pos === 0 || map[pos - 1] !== '#') && (pos + len === map.length || map[pos + len] !== '#');
}

let iter = 0;
function distribute(pot, hashes, hashIdx, last, chk, x, total, remain, key = '', cache = {}) {
  if (++iter % 1000000 === 0) {
    console.log(iter, x);
  }
  let sum = 0;
  const num = chk[x];
  key += `,${x}`;
  const pkey = `${last}${key}`;
  if (cache[pkey] !== undefined) {
    return cache[pkey];
  }
  for (const p of pot[num]) {
    if (p > last) {
      const end = p + num;
      // remove any hashes that are covered
      let idx  =  hashIdx;
      while (idx < hashes.length) {
        const hash = hashes[idx];
        if (hash[0] >= p && hash[1] <= end) {
          idx += 1;
        } else {
          break;
        }
      }
      // if there are hashes not covered yet, abort
      if (idx < hashes.length && hashes[idx][1] <= end) {
        continue;
      }
      // if there is not enough room to cover the remaining springs, abort
      if (p + remain > total) {
        continue;
      }
      sum += x < chk.length - 1
        ? distribute(pot, hashes, idx, end, chk, x + 1, total, remain - num, key, cache)
        : (idx === hashes.length ? 1 : 0);
    }
  }
  cache[pkey] = sum;
  return sum;
}

function solve(map, chk) {
  const str = map.join('');
  // console.log(`    ${str}`, chk.join());
  // potential positions for groups of springs
  const pot = {};
  let numSprings = 0;
  for (const num of chk) {
    numSprings += num;
    if (!pot[num]) {
      pot[num] = [];
      for (let x = 0; x <= map.length - num; x++) {
        if (spans(map, x, num)) {
          pot[num].push(x);
          // console.log(chalk`${String(num).padStart(3)} ${str.substring(0, x)}{red ${'#'.repeat(num)}}${str.substring(x + num)}`);
        }
      }
    }
  }
  // collect the ranges of hashes
  const hashes = [];
  let start = -1;
  let end = 0;
  for (let x = 0; x < map.length; x++) {
    if (map[x] === '#') {
      if (start < 0) {
        start = x;
      }
      end = x;
    } else {
      if (start >= 0) {
        hashes.push([start, end + 1]);
        start = -1;
      }
    }
  }
  if (start >= 0) {
    hashes.push([start, end + 1]);
  }

  const num = distribute(pot, hashes, 0, -1, chk, 0, map.length, numSprings);
  // console.log(str, chk.join(), num);
  return num;
}

function puzzle1() {
  let sum = 0;
  for (const { map, chk } of data) {
    sum += solve(map, chk);
  }
  return sum;
}
function puzzle2() {
  let sum = 0;
  for (const { map, chk } of data) {
    sum += solve(
      map.concat('?', map, '?', map, '?', map, '?', map),
      chk.concat(chk, chk, chk, chk),
    );
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1()); // 8180
console.log('puzzle 2: ', puzzle2()); // 620189727003627
console.log('iterations:', iter);
