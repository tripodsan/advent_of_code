
const fs = require('fs');

let data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => parseInt(s, 10));

function puzzle2() {
  const ins = [...data];
  let pc = 0;
  let cnt = 0;
  do {
    cnt++;
    const npc = pc + ins[pc];
    if (ins[pc] >= 3) {
      ins[pc]--;
    } else {
      ins[pc]++;
    }
    pc = npc;
  } while (pc >= 0 && pc < ins.length);
  return cnt;
}

function puzzle1() {
  const ins = [...data];
  let pc = 0;
  let cnt = 0;
  do {
    cnt++;
    ins[pc]++;
    pc += ins[pc] - 1;
  } while (pc >= 0 && pc < ins.length);
  return cnt;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
