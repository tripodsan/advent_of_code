const fs = require('fs');

let data = fs.readFileSync('./input.txt', 'utf-8')
  .trim()
  .split(/\s+/)
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));

function puzzle1(mem) {
  let cnt = 0;
  const configs = new Set();
  configs.add(mem.join(':'));
  while (true) {
    cnt++;
    // console.log(cnt, mem);
    let idx = 0;
    let max = 0;
    mem.forEach((m, i) => {
      if (m > max) {
        max = m;
        idx = i;
      }
    });
    mem[idx] = 0;
    while (max) {
      idx = (idx + 1) % mem.length;
      mem[idx]++;
      max--;
    }
    const key = mem.join(':');
    if (configs.has(key)) {
      return cnt;
    }
    configs.add(key);
  }
}

function puzzle2() {
  const mem = [...data];
  puzzle1(mem);
  return puzzle1(mem);
}

console.log('puzzle 1: ', puzzle1([...data]));
console.log('puzzle 2: ', puzzle2());
