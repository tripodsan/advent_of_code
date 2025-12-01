import fs from 'fs';
import chalk from 'chalk-template';

const data = fs.readFileSync('./input.txt', 'utf-8')
  .split('\n')
  .map((s)=> s.trim())
  .filter((s) => !!s)
  .map((line) => {
    const num = Number.parseInt(line.substring(1), 10);
    return line[0] === 'L' ? -num : num;
  });

// console.log(data);

function puzzle1() {
  let dial = 50;
  let pwd = 0
  for (const turn of data) {
    dial = (dial+turn) % 100;
    if (dial === 0) {
      pwd += 1
    }
  }
  return pwd;
}

function puzzle2_lazy() {
  let pwd = 0
  let dial = 50;
  for (let turn of data) {
    while (turn > 0) {
      turn -= 1;
      dial = (dial + 1) % 100
      if (dial === 0) {
        pwd += 1
      }
    }
    while (turn < 0) {
      turn += 1;
      dial = (dial + 99) % 100
      if (dial === 0) {
        pwd += 1
      }
    }
  }
  return pwd;
}

function puzzle2() {
  let dial = 50;
  let pwd = 0
  for (const turn of data) {
    // special case, if turning left from 0, don't count the 0
    const carry = dial === 0 ? 0 : 1;
    dial += turn;
    if (dial === 0) {
      pwd += 1
    }
    if (dial >= 100) {
      pwd += Math.floor(dial / 100)
    } else if (dial < 0) {
      pwd += Math.floor(-dial / 100) + carry
    }
    dial = (dial % 100 + 100) % 100;
  }
  return pwd;
}

console.log('puzzle 1: ', puzzle1()); // 995
console.log('puzzle 2: ', puzzle2_lazy()); // 5847
console.log('puzzle 2: ', puzzle2()); // 5847
