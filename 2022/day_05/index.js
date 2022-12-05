import fs from 'fs';
import { clone } from '../../utils.js';

const stacks = Array.init(9, () => ([]));

const moves = [];


const data = fs.readFileSync('./input.txt', 'utf-8').split('\n');

while (true) {
  const line = data.shift();
  if (!line.trim()) {
    break;
  }
  for (let i = 0; i < stacks.length; i += 1) {
    const c = line[i*4+1] || ' ';
    if (c !== ' ') {
      stacks[i].push(c)
    }
  }
}

while (data[0]) {
  const words = data.shift().split(/\s+/);
  const num = parseInt(words[1], 10);
  const from = parseInt(words[3], 10) - 1;
  const to = parseInt(words[5], 10) - 1;
  moves.push({
    num, from, to,
  })
}


// console.log(stacks);
// console.log(moves);

function puzzle2(s) {
  for (const { num, from, to} of moves) {
    const del = s[from].splice(0, num);
    s[to].unshift(...del);
  }
  return s.map((st) => st[0] || '').join('');
}


function puzzle1(s) {
  for (const { num, from, to} of moves) {
    const del = s[from].splice(0, num);
    while (del.length) {
      s[to].unshift(del.shift());
    }
  }
  return s.map((st) => st[0] || '').join('');
}

console.log('puzzle 1 : ', puzzle1(clone(stacks)));
console.log('puzzle 2 : ', puzzle2(stacks));
