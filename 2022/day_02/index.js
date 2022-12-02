import fs from 'fs';
import { Heap } from 'heap-js';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((s) => s.split(/\s+/));

const rules = {
  // rock
  X: {
    score: 1,
    wins: 'C', // scissor
    draw: 'A',
  },
  // paper
  Y: {
    score: 2,
    wins: 'A', // rock
    draw: 'B',
  },
  // scissor
  Z: {
    score: 3,
    wins: 'B', // paper
    draw: 'C',
  },

  // puzzle 2 rules
  // rock
  A: {
    X: 'Z', // scissors looses
    Y: 'X', // draw
    Z: 'Y', // paper wins
  },
  // paper
  B: {
    X: 'X', // rock looses
    Y: 'Y', // draw
    Z: 'Z', // scissors wins
  },
  // scissors
  C: {
    X: 'Y', // paper looses
    Y: 'Z', // draw
    Z: 'X', // rock wins
  }
}

const map = {
}

function puzzle2() {
  let score = 0;
  for (const [p, o] of data) {
    const move = rules[p][o];
    score += rules[move].score;
    if (o === 'Z') {
      score += 6;
    } else if (o === 'Y') {
      score += 3;
    }
  }

  return score;
}


function puzzle1() {
  let score = 0;
  for (const [p, o] of data) {
    const rule = rules[o];
    score += rule.score;
    if (rule.wins === p) {
      score += 6;
    } else if (rule.draw === p) {
      score += 3;
    }
  }

  return score;
}

console.log('puzzle 1 : ', puzzle1());
console.log('puzzle 2 : ', puzzle2());
