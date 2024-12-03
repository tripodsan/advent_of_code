import fs from 'fs';
import chalk from 'chalk-template';

const data =  fs.readFileSync('./input.txt', 'utf-8').trim();


function puzzle1() {
  let sum = 0;
  for (const m of data.matchAll(/mul\((\d{1,3}),(\d{1,3})\)/g)) {
    sum += parseInt(m[1], 10) * parseInt(m[2], 10)
  }
  return sum;
}

function puzzle2() {
  let sum = 0;
  let enabled = true
  for (const m of data.matchAll(/mul\((\d{1,3}),(\d{1,3})\)|do\(\)|don't\(\)/g)) {
    // console.log(m)
    if (m[0] === 'do()') {
      enabled = true;
    } else if (m[0] === 'don\'t()') {
      enabled = false;
    } else if (enabled) {
      sum += parseInt(m[1], 10) * parseInt(m[2], 10)
    }
  }
  return sum;
}

console.log('puzzle 1: ', puzzle1());
console.log('puzzle 2: ', puzzle2());
