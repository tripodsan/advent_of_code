
const fs = require('fs');

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => {
    const m = s.match(/(\d+)-(\d+)\s+(\w+):\s+(\w+)/);
    return {
      min: Number(m[1]),
      max: Number(m[2]),
      char: m[3],
      pwd: m[4],
    };
  });

// console.log(data);

function puzzle2() {
  let ok = 0;
  data.forEach((s) => {
    const c1 = s.pwd[s.min - 1] === s.char;
    const c2 = s.pwd[s.max - 1] === s.char;
    if (c1 ^ c2) {
      ok++;
    }
  })
  return ok;
}

function puzzle1() {
  let ok = 0;
  data.forEach((s) => {
    const c = s.pwd.split('').filter((d) => d === s.char).length;
    if (c >= s.min && c <= s.max) {
      ok++;
    }
  })
  return ok;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
