require('../../utils.js');
const fs = require('fs');
const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s) => s.trim())
  .filter((s) => !!s)
  .map((s) =>
    s.split('')
  );

const OP = {
  ')': '(',
  ']': '[',
  '}': '{',
  '>': '<',
}

const SCORES = {
  ')': 3,
  ']': 57,
  '}': 1197,
  '>': 25137,
}

const SCORES_2 = {
  '(': 1,
  '[': 2,
  '{': 3,
  '<': 4,
}

function run() {
  let score = 0;
  const comps = [];
  for (const line of data) {
    let stack = [];
    for (const c of line) {
      const o = OP[c];
      if (!o) {
        stack.push(c);
      } else {
        if (stack.pop() !== o) {
          score += SCORES[c];
          stack = [];
          break;
        }
      }
    }
    if (stack.length) {
      let complete = 0;
      while (stack.length) {
        complete = (complete * 5) + SCORES_2[stack.pop()];
      }
      comps.push(complete);
    }
  }
  comps.sort((c0, c1) => c0 - c1);

  console.log('puzzle 1: ',score);
  console.log('puzzle 2: ', comps[(comps.length - 1) / 2]);
}

run();
