import fs from 'fs';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split('\n');

function nice(s) {
  let prev = '';
  let vowels = 0;
  let doubles = 0;
  for (let i = 0; i<s.length;i++) {
    const c = s[i];
    if ('aeiou'.indexOf(c) >= 0) {
      vowels++;
    }
    if (c === prev) {
      doubles++;
    }
    if (['ab', 'cd', 'pq', 'xy'].includes(prev + c)) {
      return false;
    }
    prev = c;
  }
  return vowels >= 3 && doubles > 0;
}

function nice2(s) {
  const pairs = new Map();
  let trips = 0;
  for (let i = 0; i<s.length;i++) {
    if (s[i] === s[i+2]) {
      trips++;
    }
    if (i > 0) {
      const p = s[i-1]+s[i];
      if (!pairs.has(p)) {
        pairs.set(p, [i]);
      } else {
        pairs.get(p).push(i);
      }
    }
  }
  if (!trips) {
    return false;
  }
  for (const i of pairs.values()) {
    for (let x = 0; x < i.length - 1; x++) {
      for (let y = x + 1; y < i.length; y++) {
        if (i[y]-i[x]>1) {
          return true;
        }
      }
    }
  }
  return false;
}
function puzzle1() {
  let s = 0;
  for (const line of data) {
    if (nice(line)) {
      s++;
    }
  }
  return s;
}

function puzzle2() {
  let s = 0;
  for (const line of data) {
    if (nice2(line)) {
      s++;
    }
  }
  return s;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
