import fs from 'fs';
import '../../utils.js';

const TEST = false;

const data = fs.readFileSync(TEST ? './input_test.txt': './input.txt', 'utf-8')
  .trim()
  .split('\n');

function parse() {
  let molec;
  const reps = [];
  for (const line of data) {
    if (line.includes('=>')) {
      const words = line.split(/\s+/);
      reps.push([words[0], words[2]]);
    } else if (line) {
      molec = line.trim();
    }
  }
  return {
    molec,
    reps,
  }
}


function puzzle1() {
  const { molec, reps } = parse();
  const res = new Set();
  for (const [r0, r1] of reps) {
    let idx = -1;
    while ((idx = molec.indexOf(r0, idx + 1)) >= 0) {
      const rep = molec.substring(0, idx) + r1 + molec.substring(idx + r0.length);
      res.add(rep);
    }
  }
  return res.size;
}

function puzzle2() {
  let { molec } = parse();
  molec = molec
    .replaceAll('Rn', '(')
    .replaceAll('Ar', ')')
    .replaceAll('Y', ',')
    .split(/(?<!^)(?=[A-Z(),])/)
    .map((c) => ((c === '(' || c === ')' || c === ',') ? c : 'X'))
    .join('');
  let num = 0;
  while (molec.length > 1) {
    for (const pat of ['XX', 'X(X)', 'X(X,X)', 'X(X,X,X)']) {
      while (molec.indexOf(pat) >= 0) {
        molec = molec.replace(pat, 'X');
        num++;
      }
    }
  }
  return num;
}

console.log('puzzle 1: ', puzzle1()); // 768
console.log('puzzle 2: ', puzzle2()); // 781
