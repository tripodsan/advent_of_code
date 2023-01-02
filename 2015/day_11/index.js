import '../../utils.js';

const data = 'hepxcrrq'.split('').map((c) => c.charCodeAt(0)- 97);

const I = 'i'.charCodeAt(0) - 97;
const O = 'o'.charCodeAt(0) - 97;
const L = 'l'.charCodeAt(0) - 97;

function dump(s) {
  return String.fromCharCode(...s.map((d) => d + 97));
}

function valid(s) {
  let straight = false;
  let pairs = 0;
  for (let i = 0; i < s.length - 1; i++) {
    if (s[i] === s[i+1] - 1 && s[i] === s[i+2] - 2) {
      straight = true;
    }
    if (s[i] === s[i+1] && s[i] !== s[i+2]) {
      pairs++;
    }
  }
  return straight && pairs > 1;
}

function next(s) {
  while (true) {
    let i = s.length - 1;
    while (true) {
      do {
        s[i] = (s[i] + 1) % 26;
      } while (s[i] === I || s[i] === O || s[i] === L);
      if (s[i]) {
        break;
      }
      i--;
      if (i === -1) {
        i = s.length - 1;
      }
    }
    // console.log(dump(s));
    if (valid(s)) {
      return s;
    }
  }
}

function puzzle1() {
  return dump(next([...data]));
}

function puzzle2() {
  return dump(next(next([...data])));
}

console.log('puzzle 1: ', puzzle1()); // hepxxyzz
console.log('puzzle 2: ', puzzle2()); // heqaabcc
